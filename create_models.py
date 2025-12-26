#!/usr/bin/env python3
"""
Create mock models for deployment when real trained models are not available
"""

import os
import joblib
import numpy as np
from sklearn.dummy import DummyClassifier
import json

def create_mock_models():
    """Create simple mock models for deployment"""
    
    # Create models directory
    os.makedirs('models', exist_ok=True)
    
    # Define functional groups
    target_columns = [
        'alcohol', 'carbonyl', 'amine', 'amide', 'alkene', 
        'alkyne', 'ether', 'fluorinated', 'nitrile'
    ]
    
    # Define feature columns
    feature_columns = [f'emb_{i}' for i in range(64)]
    
    # Create mock Level 1 model
    level1_model = DummyClassifier(strategy='constant', constant=1)
    X_dummy = np.random.random((100, 64))
    y_dummy = np.ones(100)
    level1_model.fit(X_dummy, y_dummy)
    
    # Create mock Level 2 models with realistic predictions
    level2_models = {}
    for group in target_columns:
        model = DummyClassifier(strategy='stratified', random_state=42)
        if group == 'alcohol':
            y_group = np.random.choice([0, 1], 100, p=[0.3, 0.7])  # Alcohol common
        elif group == 'ether':
            y_group = np.random.choice([0, 1], 100, p=[0.4, 0.6])  # Ether common
        elif group == 'fluorinated':
            y_group = np.random.choice([0, 1], 100, p=[0.995, 0.005])  # Fluorinated rare
        else:
            y_group = np.random.choice([0, 1], 100, p=[0.7, 0.3])  # Moderate frequency
        model.fit(X_dummy, y_group)
        level2_models[group] = model
    
    # Save models
    joblib.dump(level1_model, 'models/model_level1.pkl')
    joblib.dump(level2_models, 'models/models_level2.pkl')
    joblib.dump(target_columns, 'models/target_columns.pkl')
    joblib.dump(feature_columns, 'models/feature_columns.pkl')
    
    # Create a simple SMILES to features mapping for common molecules
    smiles_features = {
        'CCO': np.random.random(64),  # Ethanol
        'CC(=O)C': np.random.random(64),  # Acetone
        'H2O': np.random.random(64),  # Water
        'CN': np.random.random(64),  # Methylamine
        'C=C': np.random.random(64),  # Ethene
        'HNO3': np.random.random(64),  # Nitric acid
        'CH3OH': np.random.random(64),  # Methanol
        'C2H5OH': np.random.random(64),  # Ethanol formula
        'NH3': np.random.random(64),  # Ammonia
        'c1ccccc1': np.random.random(64),  # Benzene
    }
    
    # Save the SMILES mapping
    joblib.dump(smiles_features, 'models/smiles_features.pkl')
    
    # Create pipeline metadata
    metadata = {
        'model_type': 'mock_models',
        'version': '1.0.0',
        'created_date': '2025-12-26',
        'target_columns': target_columns,
        'feature_columns': feature_columns,
        'note': 'Mock models for demonstration with common SMILES support'
    }
    
    with open('models/pipeline_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("✅ Mock models created successfully!")
    print("📋 Supported molecules for prediction:")
    for smiles in smiles_features.keys():
        print(f"   - {smiles}")
    print("🔄 Ready for deployment!")

if __name__ == "__main__":
    create_mock_models()