#!/usr/bin/env python3
"""
Professional Flask API for Molecular Functional Group Prediction
Multi-level ML classification system with comprehensive error handling

Author: ML Team
Version: 1.0.0
Date: 2025-12-25
"""

import os
import json
import time
import logging
from datetime import datetime
from typing import Dict, List, Optional, Tuple, Any

import pandas as pd
import numpy as np
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS
import warnings

# Suppress warnings for cleaner output
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

# Global variables for models and data
models = {}
dataset_embeddings = None
smiles_to_embedding = {}
target_columns = []
feature_columns = []
dataset_stats = {}

# Try to import RDKit
try:
    from rdkit import Chem
    from rdkit.Chem import Descriptors
    RDKIT_AVAILABLE = True
    logger.info("✅ RDKit available - Full molecular processing enabled")
except ImportError:
    RDKIT_AVAILABLE = False
    logger.warning("⚠️ RDKit not available - Using dataset lookup only")

class MolecularPredictor:
    """Professional molecular prediction system with multi-level classification"""
    
    def __init__(self):
        self.models_loaded = False
        self.dataset_loaded = False
        self.load_models()
        self.load_dataset()
    
    def load_models(self) -> bool:
        """Load all trained ML models with comprehensive error handling"""
        try:
            logger.info("🔄 Loading trained ML models...")
            
            # Load Level 1 model (binary classification)
            level1_path = 'models/model_level1.pkl'
            if os.path.exists(level1_path):
                models['level1'] = joblib.load(level1_path)
                logger.info("✅ Level 1 binary classifier loaded")
            else:
                logger.error(f"❌ Level 1 model not found at {level1_path}")
                return False
            
            # Load Level 2 models (multi-label classification)
            level2_path = 'models/models_level2.pkl'
            if os.path.exists(level2_path):
                models['level2'] = joblib.load(level2_path)
                logger.info("✅ Level 2 multi-label classifiers loaded")
            else:
                logger.error(f"❌ Level 2 models not found at {level2_path}")
                return False
            
            # Load target columns (functional group names)
            targets_path = 'models/target_columns.pkl'
            if os.path.exists(targets_path):
                global target_columns
                target_columns = joblib.load(targets_path)
                logger.info(f"✅ Target columns loaded: {len(target_columns)} functional groups")
            else:
                logger.error(f"❌ Target columns not found at {targets_path}")
                return False
            
            # Load feature columns
            features_path = 'models/feature_columns.pkl'
            if os.path.exists(features_path):
                global feature_columns
                feature_columns = joblib.load(features_path)
                logger.info(f"✅ Feature columns loaded: {len(feature_columns)} dimensions")
            else:
                logger.error(f"❌ Feature columns not found at {features_path}")
                return False
            
            # Load metadata if available
            metadata_path = 'models/pipeline_metadata.json'
            if os.path.exists(metadata_path):
                with open(metadata_path, 'r') as f:
                    metadata = json.load(f)
                    logger.info(f"✅ Pipeline metadata loaded: {metadata.get('training_date', 'Unknown')}")
            
            self.models_loaded = True
            logger.info("🎉 All ML models loaded successfully!")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error loading models: {str(e)}")
            return False
    
    def load_dataset(self) -> bool:
        """Load dataset for SMILES lookup and molecular embeddings"""
        try:
            logger.info("📊 Loading molecular dataset...")
            
            dataset_path = 'dataset.csv'
            if not os.path.exists(dataset_path):
                logger.warning("⚠️ Dataset not found - predictions will work with reduced accuracy")
                return False
            
            # Load dataset
            df = pd.read_csv(dataset_path)
            logger.info(f"📈 Dataset loaded: {len(df):,} molecules")
            
            # Create SMILES to embedding mapping
            global dataset_embeddings, smiles_to_embedding, dataset_stats
            
            # Extract embedding columns (numeric features)
            embedding_cols = df.select_dtypes(include=[np.number]).columns.tolist()
            
            # Remove target columns from embeddings
            for target in target_columns:
                if target in embedding_cols:
                    embedding_cols.remove(target)
            
            # Remove SMILES column if it exists
            if 'smiles' in embedding_cols:
                embedding_cols.remove('smiles')
            
            dataset_embeddings = df[embedding_cols].values
            
            # Create SMILES mapping if SMILES column exists
            if 'smiles' in df.columns:
                logger.info("Creating SMILES to embedding mapping...")
                # Only process first 10000 rows for faster startup
                sample_df = df.head(10000) if len(df) > 10000 else df
                
                for idx, row in sample_df.iterrows():
                    smiles = row['smiles']
                    embedding = row[embedding_cols].values
                    smiles_to_embedding[smiles] = embedding
                
                logger.info(f"✅ SMILES mapping created: {len(smiles_to_embedding):,} molecules")
            
            # Calculate dataset statistics
            dataset_stats = {
                'total_molecules': len(df),
                'embedding_dimensions': len(embedding_cols),
                'functional_groups': len(target_columns),
                'dataset_loaded': True,
                'smiles_available': 'smiles' in df.columns
            }
            
            self.dataset_loaded = True
            return True
            
        except Exception as e:
            logger.error(f"❌ Error loading dataset: {str(e)}")
            return False
    
    def formula_to_smiles(self, formula: str) -> Optional[str]:
        """Convert molecular formula to SMILES notation"""
        # Comprehensive molecular formulas to SMILES mapping
        formula_map = {

    # Simple inorganic molecules
    'H2O': 'O', 'H₂O': 'O',
    'CO2': 'O=C=O', 'CO₂': 'O=C=O',
    'CO': '[C-]#[O+]',
    'NH3': 'N', 'NH₃': 'N',
    'CH4': 'C', 'CH₄': 'C',
    'H2': '[H][H]', 'H₂': '[H][H]',
    'O2': 'O=O', 'O₂': 'O=O',
    'N2': 'N#N', 'N₂': 'N#N',
    'HCl': 'Cl',
    'HF': 'F',
    'HBr': 'Br',
    'HI': 'I',
    'H2S': 'S', 'H₂S': 'S',
    'SO2': 'O=S=O', 'SO₂': 'O=S=O',
    'NO': '[N]=O',
    'NO2': '[N+](=O)[O-]', 'NO₂': '[N+](=O)[O-]',
    'N2O': '[N-]=[N+]=O', 'N₂O': '[N-]=[N+]=O',
    'HNO3': 'O[N+](=O)[O-]', 'HNO₃': 'O[N+](=O)[O-]',
    'H2SO4': 'OS(=O)(=O)O', 'H₂SO₄': 'OS(=O)(=O)O',
    'H3PO4': 'OP(=O)(O)O', 'H₃PO₄': 'OP(=O)(O)O',

    # Alcohols (single safest choice)
    'CH3OH': 'CO', 'CH₃OH': 'CO',
    'C2H6O': 'CCO', 'C₂H₆O': 'CCO',
    'C3H8O': 'CCCO', 'C₃H₈O': 'CCCO',
    'C4H10O': 'CCCCO', 'C₄H₁₀O': 'CCCCO',

    # Aldehydes & ketones
    'CH2O': 'C=O', 'CH₂O': 'C=O',
    'C2H4O': 'CC=O', 'C₂H₄O': 'CC=O',
    'C3H6O': 'CC(=O)C', 'C₃H₆O': 'CC(=O)C',

    # Carboxylic acids
    'CH2O2': 'C(=O)O', 'CH₂O₂': 'C(=O)O',
    'C2H4O2': 'CC(=O)O', 'C₂H₄O₂': 'CC(=O)O',
    'C3H6O2': 'CCC(=O)O', 'C₃H₆O₂': 'CCC(=O)O',
    'C4H8O2': 'CCCC(=O)O', 'C₄H₈O₂': 'CCCC(=O)O',
    'C7H6O2': 'O=C(O)c1ccccc1', 'C₇H₆O₂': 'O=C(O)c1ccccc1',

    # Alkanes
    'C2H6': 'CC', 'C₂H₆': 'CC',
    'C3H8': 'CCC', 'C₃H₈': 'CCC',
    'C4H10': 'CCCC', 'C₄H₁₀': 'CCCC',
    'C5H12': 'CCCCC', 'C₅H₁₂': 'CCCCC',
    'C6H14': 'CCCCCC', 'C₆H₁₄': 'CCCCCC',

    # Alkenes
    'C2H4': 'C=C', 'C₂H₄': 'C=C',
    'C3H6': 'CC=C', 'C₃H₆': 'CC=C',

    # Alkynes
    'C2H2': 'C#C', 'C₂H₂': 'C#C',
    'C3H4': 'CC#C', 'C₃H₄': 'CC#C',

    # Aromatics
    'C6H6': 'c1ccccc1', 'C₆H₆': 'c1ccccc1',
    'C7H8': 'Cc1ccccc1', 'C₇H₈': 'Cc1ccccc1',
    'C6H5OH': 'Oc1ccccc1',
    'C6H4Cl2': 'Clc1ccc(Cl)cc1', 'C₆H₄Cl₂': 'Clc1ccc(Cl)cc1',

    # Amines
    'CH5N': 'CN', 'CH₅N': 'CN',
    'C2H7N': 'CCN', 'C₂H₇N': 'CCN',
    'C3H9N': 'CCCN', 'C₃H₉N': 'CCCN',
    'C6H7N': 'Nc1ccccc1', 'C₆H₇N': 'Nc1ccccc1',

    # Amides (corrected)
    'CH3NO': 'C(=O)N', 'CH₃NO': 'C(=O)N',
    'C2H5NO': 'CC(=O)N', 'C₂H₅NO': 'CC(=O)N',

    # Nitriles
    'C2H3N': 'CC#N', 'C₂H₃N': 'CC#N',
    'C6H5CN': 'N#Cc1ccccc1', 'C₆H₅CN': 'N#Cc1ccccc1',

    # Halogenated
    'CH3Cl': 'CCl', 'CH₃Cl': 'CCl',
    'CHCl3': 'C(Cl)(Cl)Cl', 'CHCl₃': 'C(Cl)(Cl)Cl',
    'CCl4': 'C(Cl)(Cl)(Cl)Cl', 'CCl₄': 'C(Cl)(Cl)(Cl)Cl',

    # Common biomolecules
    'C6H12O6': 'C([C@@H]1[C@H]([C@@H]([C@H]([C@H](O1)O)O)O)O)O',
    'C₂H₆O₂': 'OCCO', 'C2H6O2': 'OCCO',
    'C3H8O3': 'OCC(O)CO', 'C₃H₈O₃': 'OCC(O)CO',

}

        
        # Clean and normalize formula
        clean_formula = formula.strip().replace(' ', '')
        
        # Try direct lookup
        if clean_formula in formula_map:
            return formula_map[clean_formula]
        
        # Try variations (case, subscript normalization)
        variations = [
            clean_formula.upper(),
            clean_formula.lower(),
            clean_formula.replace('₁', '1').replace('₂', '2').replace('₃', '3')
                         .replace('₄', '4').replace('₅', '5').replace('₆', '6')
                         .replace('₇', '7').replace('₈', '8').replace('₉', '9')
        ]
        
        for variation in variations:
            if variation in formula_map:
                return formula_map[variation]
        
        return None
    
    def smiles_to_features(self, smiles: str) -> Optional[np.ndarray]:
        """Convert SMILES to molecular feature vector"""
        try:
            # First check if SMILES exists in dataset
            if smiles in smiles_to_embedding:
                return smiles_to_embedding[smiles].reshape(1, -1)
            
            # If not in dataset and RDKit is available, compute features
            if not RDKIT_AVAILABLE:
                logger.warning("RDKit not available and SMILES not in dataset")
                return None
            
            mol = Chem.MolFromSmiles(smiles)
            if mol is None:
                return None
            
            # Compute molecular descriptors
            features = []
            try:
                features.extend([
                    Descriptors.MolWt(mol),
                    Descriptors.MolLogP(mol),
                    Descriptors.NumHDonors(mol),
                    Descriptors.NumHAcceptors(mol),
                    Descriptors.TPSA(mol),
                    Descriptors.NumRotatableBonds(mol),
                    Descriptors.NumAromaticRings(mol),
                    Descriptors.NumSaturatedRings(mol),
                    Descriptors.NumAliphaticRings(mol),
                    Descriptors.RingCount(mol),
                    Descriptors.NumHeteroatoms(mol),
                    Descriptors.BertzCT(mol),
                ])
                
                # Add more descriptors to reach expected feature count
                try:
                    features.extend([
                        Descriptors.Kappa1(mol),
                        Descriptors.Kappa2(mol),
                        Descriptors.Kappa3(mol),
                        Descriptors.FractionCsp3(mol),
                        Descriptors.BalabanJ(mol),
                    ])
                except:
                    features.extend([0.0] * 5)  # Fallback values
                
            except Exception as e:
                logger.warning(f"Error computing descriptors: {e}")
                features = [1.0] * 17  # Basic fallback
            
            # Pad or truncate to match expected feature count
            expected_features = len(feature_columns) if feature_columns else 64
            
            if len(features) < expected_features:
                features.extend([0.0] * (expected_features - len(features)))
            elif len(features) > expected_features:
                features = features[:expected_features]
            
            return np.array(features).reshape(1, -1)
            
        except Exception as e:
            logger.error(f"Error converting SMILES to features: {str(e)}")
            return None
    
    def predict_functional_groups(self, input_molecule: str) -> Dict[str, Any]:
        """Make predictions using the multi-level ML pipeline"""
        start_time = time.time()
        
        try:
            # Validate input
            if not input_molecule or not isinstance(input_molecule, str):
                return {
                    'success': False,
                    'error': 'Invalid input',
                    'message': 'Input must be a non-empty string'
                }
            
            # Check if models are loaded
            if not self.models_loaded:
                return {
                    'success': False,
                    'error': 'Models not loaded',
                    'message': 'ML models are not properly loaded'
                }
            
            # Determine input type and convert to SMILES if needed
            original_input = input_molecule.strip()
            smiles = original_input
            input_type = 'smiles'
            
            # Try to parse as SMILES first
            if RDKIT_AVAILABLE:
                mol = Chem.MolFromSmiles(original_input)
                if mol is None:
                    # If SMILES parsing fails, try as molecular formula
                    converted_smiles = self.formula_to_smiles(original_input)
                    if converted_smiles:
                        smiles = converted_smiles
                        input_type = 'formula'
                        logger.info(f"Converted formula {original_input} → {smiles}")
                    else:
                        return {
                            'success': False,
                            'error': 'Invalid input',
                            'message': f'Could not parse "{original_input}" as SMILES or molecular formula'
                        }
            
            # Convert SMILES to features
            features = self.smiles_to_features(smiles)
            if features is None:
                return {
                    'success': False,
                    'error': 'Feature extraction failed',
                    'message': 'Could not convert molecule to features for prediction'
                }
            
            # Level 1 Prediction (Binary: has any functional groups?)
            level1_model = models['level1']
            level1_pred = level1_model.predict(features)[0]
            level1_proba = level1_model.predict_proba(features)[0]
            level1_confidence = float(max(level1_proba))
            
            # Level 2 Predictions (Multi-label: which specific groups?)
            level2_models = models['level2']
            level2_predictions = {}
            detected_groups = []
            
            # Run Level 2 predictions for each functional group
            if level1_pred == 1:  # Has functional groups
                for group_name in target_columns:
                    if group_name in level2_models:
                        group_model = level2_models[group_name]
                        group_pred = group_model.predict(features)[0]
                        group_proba = group_model.predict_proba(features)[0]
                        group_confidence = float(group_proba[1])  # Probability of having this group
                        
                        level2_predictions[group_name] = group_confidence
                        
                        # Consider detected if confidence > 0.5
                        if group_confidence > 0.5:
                            detected_groups.append(group_name)
            else:
                # If Level 1 says no functional groups, set all Level 2 to low confidence
                for group_name in target_columns:
                    level2_predictions[group_name] = 0.1
            
            # Check if molecule is in dataset
            in_dataset = smiles in smiles_to_embedding
            
            # Prepare response
            processing_time = time.time() - start_time
            
            result = {
                'success': True,
                'original_input': original_input,
                'input_type': input_type,
                'smiles': smiles,
                'processing_time': round(processing_time, 4),
                'timestamp': datetime.now().isoformat(),
                
                # Level 1 Results
                'level1': {
                    'has_functional_groups': bool(level1_pred),
                    'confidence': round(level1_confidence, 4),
                    'prediction': 'HAS_GROUPS' if level1_pred else 'NO_GROUPS'
                },
                
                # Level 2 Results
                'level2': {
                    'functional_groups': {
                        group: round(conf, 4) 
                        for group, conf in level2_predictions.items()
                    },
                    'detected_groups': detected_groups,
                    'total_detected': len(detected_groups)
                },
                
                # Metadata
                'metadata': {
                    'in_dataset': in_dataset,
                    'model_version': '1.0.0',
                    'algorithm': 'Random Forest Multi-level',
                    'feature_count': features.shape[1] if features is not None else 0
                },
                
                # Warnings
                'warnings': [] if in_dataset else [
                    'Molecule not found in training dataset - predictions may be less accurate'
                ]
            }
            
            logger.info(f"✅ Prediction completed: {original_input} → {smiles} ({processing_time:.3f}s)")
            return result
            
        except Exception as e:
            logger.error(f"❌ Prediction error: {str(e)}")
            return {
                'success': False,
                'error': 'Prediction failed',
                'message': str(e),
                'original_input': input_molecule,
                'timestamp': datetime.now().isoformat()
            }

# Initialize predictor
predictor = MolecularPredictor()

# API Routes
@app.route('/')
def index():
    """API information endpoint"""
    return jsonify({
        'name': 'Molecular Functional Group Predictor API',
        'version': '1.0.0',
        'status': 'active',
        'description': 'Multi-level ML pipeline for functional group prediction',
        'endpoints': {
            '/predict': 'POST - Predict functional groups (SMILES or formula)',
            '/batch_predict': 'POST - Batch predictions',
            '/health': 'GET - Health check',
            '/stats': 'GET - System statistics',
            '/models': 'GET - Model information'
        },
        'supported_inputs': [
            'SMILES strings (e.g., CCO, CC(=O)C)',
            'Molecular formulas (e.g., H2O, HNO3, C2H5OH)'
        ]
    })

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'models_loaded': predictor.models_loaded,
        'dataset_loaded': predictor.dataset_loaded,
        'system': {
            'rdkit_available': RDKIT_AVAILABLE,
            'models_available': list(models.keys()),
            'target_groups': target_columns,
            'feature_dimensions': len(feature_columns)
        }
    })

@app.route('/stats')
def get_stats():
    """Get system and model statistics"""
    return jsonify({
        'dataset_stats': dataset_stats,
        'model_stats': {
            'level1_loaded': 'level1' in models,
            'level2_loaded': 'level2' in models,
            'target_groups': len(target_columns),
            'feature_dimensions': len(feature_columns)
        },
        'system_info': {
            'rdkit_available': RDKIT_AVAILABLE,
            'uptime': 'Active',
            'last_updated': datetime.now().isoformat()
        }
    })

@app.route('/models')
def get_models():
    """Get model information"""
    return jsonify({
        'models': {
            'level1': {
                'type': 'Binary Classifier',
                'task': 'Detect presence of any functional groups',
                'loaded': 'level1' in models
            },
            'level2': {
                'type': 'Multi-label Classifier',
                'task': 'Identify specific functional groups',
                'groups': target_columns,
                'loaded': 'level2' in models
            }
        },
        'architecture': 'Multi-level Classification Pipeline',
        'algorithm': 'Random Forest',
        'features': len(feature_columns) if feature_columns else 'Unknown'
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint"""
    try:
        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided',
                'message': 'Request body must contain JSON data'
            }), 400
        
        # Extract input (can be SMILES or molecular formula)
        input_molecule = data.get('smiles', '').strip()
        
        if not input_molecule:
            return jsonify({
                'success': False,
                'error': 'No input provided',
                'message': 'Request must include "smiles" field (accepts SMILES or molecular formula)'
            }), 400
        
        # Make prediction
        result = predictor.predict_functional_groups(input_molecule)
        
        # Return appropriate status code
        status_code = 200 if result['success'] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        logger.error(f"❌ API error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/batch_predict', methods=['POST'])
def batch_predict():
    """Batch prediction endpoint"""
    try:
        data = request.get_json()
        molecules_list = data.get('smiles_list', [])
        
        if not molecules_list or not isinstance(molecules_list, list):
            return jsonify({
                'success': False,
                'error': 'Invalid input',
                'message': 'Request must include "smiles_list" as an array'
            }), 400
        
        # Limit batch size for performance
        if len(molecules_list) > 100:
            return jsonify({
                'success': False,
                'error': 'Batch too large',
                'message': 'Maximum batch size is 100 molecules'
            }), 400
        
        # Process batch
        results = []
        for molecule in molecules_list:
            result = predictor.predict_functional_groups(molecule)
            results.append(result)
        
        return jsonify({
            'success': True,
            'batch_size': len(molecules_list),
            'results': results,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"❌ Batch prediction error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Batch prediction failed',
            'message': str(e)
        }), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found',
        'message': 'The requested endpoint does not exist',
        'available_endpoints': ['/predict', '/health', '/stats', '/models']
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error',
        'message': 'An unexpected error occurred'
    }), 500

if __name__ == '__main__':
    print("🚀 MOLECULAR FUNCTIONAL GROUP PREDICTOR API")
    print("=" * 60)
    
    # Check system status
    if predictor.models_loaded:
        print("✅ ML Models loaded successfully")
        print(f"📊 Target groups: {target_columns}")
        print(f"🔧 Feature dimensions: {len(feature_columns)}")
    else:
        print("❌ ML Models failed to load")
    
    if predictor.dataset_loaded:
        print(f"✅ Dataset loaded: {dataset_stats.get('total_molecules', 0):,} molecules")
    else:
        print("⚠️ Dataset not loaded - basic functionality available")
    
    print("=" * 60)
    print("🌐 API Endpoints:")
    print("   POST /predict       - Main prediction endpoint")
    print("   POST /batch_predict - Batch predictions")
    print("   GET  /health        - Health check")
    print("   GET  /stats         - Statistics")
    print("   GET  /models        - Model information")
    print("=" * 60)
    print("🚀 Starting server on http://localhost:5000")
    print("🔗 Frontend connects to http://localhost:3000")
    print("💡 Supports SMILES (CCO) and formulas (H2O, HNO3)")
    print("=" * 60)
    
    # Start Flask app
    app.run(
        debug=False,  # Set to False for production
        host='0.0.0.0',
        port=5000,
        threaded=True
    )