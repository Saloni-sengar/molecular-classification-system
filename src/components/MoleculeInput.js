import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  Beaker, 
  Zap,
  Copy,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Database
} from 'lucide-react';
import toast from 'react-hot-toast';

const MoleculeInput = ({ onPredict, isLoading, systemStatus }) => {
  const [smiles, setSmiles] = useState('');
  const [selectedExample, setSelectedExample] = useState(null);
  const [inputError, setInputError] = useState('');

  const exampleMolecules = [
    // SMILES Examples
    { name: 'Ethanol', smiles: 'CCO', description: 'Simple alcohol - contains OH group', groups: ['alcohol'] },
    { name: 'Acetone', smiles: 'CC(=O)C', description: 'Ketone compound - contains C=O group', groups: ['carbonyl'] },
    { name: 'Methylamine', smiles: 'CN', description: 'Primary amine - contains NH2 group', groups: ['amine'] },
    { name: 'Acetamide', smiles: 'CC(=O)N', description: 'Simple amide - contains CONH2 group', groups: ['amide', 'carbonyl'] },
    { name: 'Ethene', smiles: 'C=C', description: 'Simple alkene - contains C=C double bond', groups: ['alkene'] },
    { name: 'Acetylene', smiles: 'C#C', description: 'Simple alkyne - contains C≡C triple bond', groups: ['alkyne'] },
    { name: 'Diethyl ether', smiles: 'CCOC', description: 'Simple ether - contains C-O-C linkage', groups: ['ether'] },
    { name: 'Fluoromethane', smiles: 'CF', description: 'Fluorinated compound - contains C-F bond', groups: ['fluorinated'] },
    { name: 'Acetonitrile', smiles: 'CC#N', description: 'Nitrile compound - contains C≡N group', groups: ['nitrile'] },
    
    // Molecular Formula Examples
    { name: 'Water', smiles: 'H2O', description: 'Water molecule - inorganic compound', groups: [] },
    { name: 'Nitric Acid', smiles: 'HNO3', description: 'Strong acid - contains nitro group', groups: [] },
    { name: 'Methanol', smiles: 'CH3OH', description: 'Simplest alcohol - from molecular formula', groups: ['alcohol'] },
    { name: 'Acetic Acid', smiles: 'C2H4O2', description: 'Carboxylic acid - from molecular formula', groups: ['carbonyl'] },
    { name: 'Ammonia', smiles: 'NH3', description: 'Simple nitrogen compound', groups: [] },
    { name: 'Carbon Dioxide', smiles: 'CO2', description: 'Greenhouse gas - inorganic', groups: [] },
    
    // Complex Examples
    { name: 'Glucose', smiles: 'C([C@@H]1[C@H]([C@@H]([C@H]([C@H](O1)O)O)O)O)O', description: 'Complex sugar - multiple OH groups', groups: ['alcohol'] },
    { name: 'Caffeine', smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C', description: 'Complex alkaloid - multiple functional groups', groups: ['carbonyl', 'amine'] },
    { name: 'Aspirin', smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O', description: 'Pain reliever - ester and carboxylic acid', groups: ['carbonyl', 'alcohol'] }
  ];

  const validateSMILES = (smilesString) => {
    if (!smilesString.trim()) {
      return 'SMILES string cannot be empty';
    }
    
    // Basic SMILES validation
    const invalidChars = /[^A-Za-z0-9\[\]()=#+\-@\/\\\.]/;
    if (invalidChars.test(smilesString)) {
      return 'SMILES contains invalid characters';
    }
    
    // Check for balanced brackets
    const brackets = smilesString.match(/[\[\]()]/g) || [];
    let squareCount = 0, roundCount = 0;
    for (let bracket of brackets) {
      if (bracket === '[') squareCount++;
      else if (bracket === ']') squareCount--;
      else if (bracket === '(') roundCount++;
      else if (bracket === ')') roundCount--;
    }
    
    if (squareCount !== 0 || roundCount !== 0) {
      return 'Unbalanced brackets in SMILES';
    }
    
    return '';
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSmiles(value);
    
    if (value.trim()) {
      const error = validateSMILES(value);
      setInputError(error);
    } else {
      setInputError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!systemStatus.backendConnected) {
      toast.error('❌ Backend not connected. Please start the Flask server.');
      return;
    }
    
    if (!systemStatus.modelsLoaded) {
      toast.error('❌ ML models not loaded. Please check the backend.');
      return;
    }
    
    if (!smiles.trim()) {
      toast.error('Please enter a SMILES string');
      return;
    }
    
    const error = validateSMILES(smiles);
    if (error) {
      toast.error(`Invalid SMILES: ${error}`);
      return;
    }
    
    toast.success('🔬 Analyzing molecule...');
    onPredict(smiles.trim());
  };

  const handleExampleClick = (example) => {
    setSmiles(example.smiles);
    setSelectedExample(example);
    setInputError('');
    toast.success(`📋 Loaded ${example.name}`);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('📋 Copied to clipboard!');
  };

  const clearInput = () => {
    setSmiles('');
    setSelectedExample(null);
    setInputError('');
  };

  const getSystemStatusIcon = () => {
    if (!systemStatus.backendConnected) {
      return <AlertCircle className="w-5 h-5 text-red-400" />;
    }
    if (!systemStatus.modelsLoaded) {
      return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    }
    return <CheckCircle className="w-5 h-5 text-green-400" />;
  };

  const getSystemStatusText = () => {
    if (!systemStatus.backendConnected) {
      return 'Backend Disconnected';
    }
    if (!systemStatus.modelsLoaded) {
      return 'Models Not Loaded';
    }
    return 'System Ready';
  };

  const isSystemReady = systemStatus.backendConnected && systemStatus.modelsLoaded;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Main Input Section */}
      <div className="card p-8">
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center space-x-3 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Beaker className="w-10 h-10 text-blue-400" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Molecular Functional Group Predictor
            </h2>
            <Sparkles className="w-10 h-10 text-purple-400" />
          </motion.div>
          <p className="text-gray-300 text-lg mb-4">
            Advanced multi-level ML pipeline for functional group prediction<br/>
            <span className="text-sm text-blue-300">Supports both SMILES strings and molecular formulas</span>
          </p>
          
          {/* System Status */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            {getSystemStatusIcon()}
            <span className={`text-sm font-medium ${
              isSystemReady ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {getSystemStatusText()}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <motion.input
              type="text"
              value={smiles}
              onChange={handleInputChange}
              placeholder="Enter SMILES string or molecular formula (e.g., CCO, H2O, HNO3)"
              className={`
                input-glass w-full text-lg py-4 pl-12 pr-24 transition-all duration-200
                ${inputError ? 'border-red-500/50 bg-red-500/5' : ''}
                ${!isSystemReady ? 'opacity-50' : ''}
              `}
              disabled={!isSystemReady}
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            
            {smiles && (
              <motion.button
                type="button"
                onClick={clearInput}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RotateCcw className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          {inputError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center space-x-2 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{inputError}</span>
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading || !smiles.trim() || inputError || !isSystemReady}
            className={`
              btn-primary w-full py-4 text-lg font-semibold transition-all duration-200
              ${isLoading || !smiles.trim() || inputError || !isSystemReady
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:shadow-2xl hover:shadow-blue-500/25'
              }
            `}
            whileHover={isSystemReady && !isLoading && smiles.trim() && !inputError ? { scale: 1.02 } : {}}
            whileTap={isSystemReady && !isLoading && smiles.trim() && !inputError ? { scale: 0.98 } : {}}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="loading-spinner" />
                <span>Analyzing Molecule...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Predict Functional Groups</span>
              </div>
            )}
          </motion.button>
        </form>

        {selectedExample && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-blue-300 text-lg">{selectedExample.name}</h4>
                <p className="text-sm text-gray-300 mb-2">{selectedExample.description}</p>
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400">Expected groups:</span>
                  <div className="flex space-x-1">
                    {selectedExample.groups.map((group, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-300">
                        {group}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(selectedExample.smiles)}
                className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                title="Copy SMILES"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Example Molecules */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <span>Example Molecules</span>
          <span className="text-sm text-gray-400 font-normal">({exampleMolecules.length} examples)</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exampleMolecules.map((molecule, index) => (
            <motion.div
              key={molecule.name}
              className={`
                card cursor-pointer p-4 border-2 transition-all duration-200 hover:shadow-lg
                ${selectedExample?.name === molecule.name 
                  ? 'border-blue-500/50 bg-blue-500/10 shadow-blue-500/20' 
                  : 'border-transparent hover:border-white/20 hover:bg-white/5'
                }
                ${!isSystemReady ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => isSystemReady && handleExampleClick(molecule)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={isSystemReady ? { scale: 1.02 } : {}}
              whileTap={isSystemReady ? { scale: 0.98 } : {}}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-white text-lg">{molecule.name}</h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(molecule.smiles);
                  }}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  title="Copy SMILES"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-sm text-gray-300 mb-3">{molecule.description}</p>
              
              <div className="space-y-2">
                <code className="block text-xs bg-black/30 px-3 py-2 rounded font-mono text-blue-300 break-all">
                  {molecule.smiles}
                </code>
                
                <div className="flex flex-wrap gap-1">
                  {molecule.groups.map((group, groupIndex) => (
                    <span 
                      key={groupIndex} 
                      className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium"
                    >
                      {group}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MoleculeInput;