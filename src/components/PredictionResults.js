import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Clock, 
  Brain,
  Zap,
  Target,
  Atom,
  AlertTriangle,
  Database,
  Activity
} from 'lucide-react';

const PredictionResults = ({ data }) => {
  const { 
    smiles, 
    hasGroups, 
    confidence, 
    level1Prediction,
    functionalGroups, 
    detectedGroups,
    totalDetected,
    modelUsed, 
    processingTime,
    inDataset,
    warnings,
    timestamp,
    featureCount
  } = data;

  const highConfidenceGroups = functionalGroups.filter(group => group.probability > 0.7);

  const getGroupColor = (groupName) => {
    const colors = {
      alcohol: 'from-red-400 to-red-600',
      carbonyl: 'from-orange-400 to-orange-600',
      amine: 'from-blue-400 to-blue-600',
      amide: 'from-purple-400 to-purple-600',
      alkene: 'from-green-400 to-green-600',
      alkyne: 'from-yellow-400 to-yellow-600',
      ether: 'from-pink-400 to-pink-600',
      fluorinated: 'from-cyan-400 to-cyan-600',
      nitrile: 'from-indigo-400 to-indigo-600'
    };
    return colors[groupName.toLowerCase()] || 'from-gray-400 to-gray-600';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'text-green-400';
    if (confidence >= 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceBadge = (confidence) => {
    if (confidence >= 0.9) return { text: 'High', color: 'bg-green-500' };
    if (confidence >= 0.7) return { text: 'Medium', color: 'bg-yellow-500' };
    return { text: 'Low', color: 'bg-red-500' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 backdrop-blur-sm"
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <h4 className="text-yellow-300 font-semibold mb-1">Prediction Warnings</h4>
              {warnings.map((warning, index) => (
                <p key={index} className="text-yellow-200 text-sm">{warning}</p>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Results Card */}
      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.div
              className={`
                w-16 h-16 rounded-full flex items-center justify-center
                ${hasGroups ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'}
                shadow-lg
              `}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {hasGroups ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : (
                <XCircle className="w-8 h-8 text-white" />
              )}
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {hasGroups ? `${totalDetected} Functional Groups Detected` : 'No Functional Groups'}
              </h3>
              <p className="text-gray-300 mb-2">
                Analysis of: <code className="bg-black/30 px-2 py-1 rounded text-blue-300 font-mono text-sm">{smiles}</code>
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Database className="w-4 h-4" />
                  <span>{inDataset ? 'In training dataset' : 'New molecule'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Activity className="w-4 h-4" />
                  <span>{featureCount} features</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-4xl font-bold ${getConfidenceColor(confidence)} mb-1`}>
              {(confidence * 100).toFixed(1)}%
            </div>
            <div className="flex items-center justify-end space-x-2">
              <span className="text-sm text-gray-400">Confidence</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getConfidenceBadge(confidence).color}`}>
                {getConfidenceBadge(confidence).text}
              </span>
            </div>
          </div>
        </div>

        {/* Level 1 Prediction Info */}
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <h4 className="text-lg font-semibold text-white mb-2 flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-400" />
            <span>Level 1 Classification</span>
          </h4>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Binary prediction:</span>
            <span className={`font-semibold ${hasGroups ? 'text-green-400' : 'text-red-400'}`}>
              {level1Prediction || (hasGroups ? 'HAS_GROUPS' : 'NO_GROUPS')}
            </span>
          </div>
        </div>

        {/* Model Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
            <Brain className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Model Used</p>
              <p className="font-semibold text-white">{modelUsed}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
            <Clock className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Processing Time</p>
              <p className="font-semibold text-white">{processingTime.toFixed(3)}s</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
            <Target className="w-6 h-6 text-purple-400" />
            <div>
              <p className="text-sm text-gray-400">Groups Found</p>
              <p className="font-semibold text-white">{totalDetected} / {functionalGroups.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Functional Groups Grid */}
      <div className="card p-6">
        <h4 className="text-xl font-semibold mb-6 flex items-center space-x-2">
          <Atom className="w-6 h-6 text-blue-400" />
          <span>Level 2: Functional Group Analysis</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {functionalGroups.map((group, index) => (
            <motion.div
              key={group.name}
              className={`
                p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg
                ${group.detected 
                  ? 'border-green-500/50 bg-green-500/10 shadow-green-500/20' 
                  : 'border-gray-600/50 bg-gray-600/5'
                }
              `}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-semibold text-white text-lg capitalize">
                  {group.name.replace('_', ' ')}
                </h5>
                <div className={`
                  w-4 h-4 rounded-full border-2
                  ${group.detected 
                    ? 'bg-green-400 border-green-400' 
                    : 'bg-transparent border-gray-500'
                  }
                `} />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Probability</span>
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold text-lg ${getConfidenceColor(group.probability)}`}>
                      {(group.probability * 100).toFixed(1)}%
                    </span>
                    {group.probability > 0.8 && <Zap className="w-4 h-4 text-yellow-400" />}
                  </div>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className={`h-3 rounded-full bg-gradient-to-r ${getGroupColor(group.name)} shadow-sm`}
                    initial={{ width: 0 }}
                    animate={{ width: `${group.probability * 100}%` }}
                    transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
                  />
                </div>
                
                <div className="text-xs text-gray-500">
                  {group.detected ? 'DETECTED' : 'NOT DETECTED'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Summary Statistics */}
      {totalDetected > 0 && (
        <div className="card p-6">
          <h4 className="text-xl font-semibold mb-6 flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <span>Detection Summary</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-green-400 mb-3 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Detected Groups ({totalDetected})</span>
              </h5>
              <div className="space-y-2">
                {functionalGroups.filter(g => g.detected).map((group, index) => (
                  <motion.div
                    key={group.name}
                    className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <span className="capitalize text-white font-medium">{group.name.replace('_', ' ')}</span>
                    <span className="text-green-400 font-bold">
                      {(group.probability * 100).toFixed(1)}%
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-blue-400 mb-3 flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>High Confidence ({highConfidenceGroups.length})</span>
              </h5>
              <div className="space-y-2">
                {highConfidenceGroups.map((group, index) => (
                  <motion.div
                    key={group.name}
                    className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <span className="capitalize text-white font-medium">{group.name.replace('_', ' ')}</span>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-blue-400 font-bold">
                        {(group.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="card p-4">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Prediction completed at {new Date(timestamp).toLocaleString()}</span>
          <span>Multi-level ML Pipeline v1.0</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PredictionResults;