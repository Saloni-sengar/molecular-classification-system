import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Target, 
  Clock,
  Award,
  Brain,
  Activity
} from 'lucide-react';

const ModelComparison = () => {
  const [selectedMetric, setSelectedMetric] = useState('accuracy');

  const models = [
    {
      name: 'Random Forest',
      type: 'Ensemble',
      accuracy: 94.3,
      precision: 92.1,
      recall: 95.8,
      f1Score: 93.9,
      speed: 0.23,
      color: 'from-green-400 to-green-600',
      description: 'Robust ensemble method with excellent performance'
    },
    {
      name: 'Gradient Boosting',
      type: 'Ensemble',
      accuracy: 93.8,
      precision: 91.5,
      recall: 94.2,
      f1Score: 92.8,
      speed: 0.45,
      color: 'from-blue-400 to-blue-600',
      description: 'Sequential learning with high accuracy'
    },
    {
      name: 'SVM (RBF)',
      type: 'Kernel',
      accuracy: 91.2,
      precision: 89.8,
      recall: 92.1,
      f1Score: 90.9,
      speed: 1.23,
      color: 'from-purple-400 to-purple-600',
      description: 'Non-linear classification with kernel trick'
    },
    {
      name: 'Neural Network',
      type: 'Deep Learning',
      accuracy: 92.7,
      precision: 90.3,
      recall: 93.8,
      f1Score: 92.0,
      speed: 0.67,
      color: 'from-red-400 to-red-600',
      description: 'Multi-layer perceptron with backpropagation'
    },
    {
      name: 'Logistic Regression',
      type: 'Linear',
      accuracy: 87.5,
      precision: 85.2,
      recall: 89.1,
      f1Score: 87.1,
      speed: 0.08,
      color: 'from-yellow-400 to-yellow-600',
      description: 'Fast linear classifier with good interpretability'
    },
    {
      name: 'Decision Tree',
      type: 'Tree',
      accuracy: 85.9,
      precision: 83.4,
      recall: 87.6,
      f1Score: 85.4,
      speed: 0.12,
      color: 'from-cyan-400 to-cyan-600',
      description: 'Interpretable tree-based classification'
    }
  ];

  const metrics = [
    { key: 'accuracy', label: 'Accuracy', icon: Target, unit: '%' },
    { key: 'precision', label: 'Precision', icon: Award, unit: '%' },
    { key: 'recall', label: 'Recall', icon: Activity, unit: '%' },
    { key: 'f1Score', label: 'F1-Score', icon: TrendingUp, unit: '%' },
    { key: 'speed', label: 'Speed', icon: Clock, unit: 's', reverse: true }
  ];

  const getMetricValue = (model, metric) => {
    return model[metric];
  };

  const getBestModel = (metric) => {
    if (metric === 'speed') {
      return models.reduce((best, current) => 
        current.speed < best.speed ? current : best
      );
    }
    return models.reduce((best, current) => 
      current[metric] > best[metric] ? current : best
    );
  };

  const sortedModels = [...models].sort((a, b) => {
    if (selectedMetric === 'speed') {
      return a[selectedMetric] - b[selectedMetric];
    }
    return b[selectedMetric] - a[selectedMetric];
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Model Comparison</h2>
            <p className="text-gray-300">Performance analysis of 24+ machine learning algorithms</p>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="flex flex-wrap gap-2">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const isSelected = selectedMetric === metric.key;
            
            return (
              <motion.button
                key={metric.key}
                onClick={() => setSelectedMetric(metric.key)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                  ${isSelected 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{metric.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Performance Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            Performance by {metrics.find(m => m.key === selectedMetric)?.label}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Brain className="w-4 h-4" />
            <span>Best: {getBestModel(selectedMetric).name}</span>
          </div>
        </div>

        <div className="space-y-4">
          {sortedModels.map((model, index) => {
            const value = getMetricValue(model, selectedMetric);
            const maxValue = selectedMetric === 'speed' 
              ? Math.max(...models.map(m => m.speed))
              : Math.max(...models.map(m => m[selectedMetric]));
            const percentage = selectedMetric === 'speed' 
              ? ((maxValue - value) / maxValue) * 100
              : (value / maxValue) * 100;
            
            return (
              <motion.div
                key={model.name}
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${model.color}`} />
                    <div>
                      <span className="font-semibold text-white">{model.name}</span>
                      <span className="text-sm text-gray-400 ml-2">({model.type})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-white">
                      {selectedMetric === 'speed' ? value.toFixed(2) : value.toFixed(1)}
                      {metrics.find(m => m.key === selectedMetric)?.unit}
                    </span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${model.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
                
                <p className="text-xs text-gray-400">{model.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <span>Detailed Performance Metrics</span>
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-2 text-gray-300">Model</th>
                <th className="text-center py-3 px-2 text-gray-300">Type</th>
                <th className="text-center py-3 px-2 text-gray-300">Accuracy</th>
                <th className="text-center py-3 px-2 text-gray-300">Precision</th>
                <th className="text-center py-3 px-2 text-gray-300">Recall</th>
                <th className="text-center py-3 px-2 text-gray-300">F1-Score</th>
                <th className="text-center py-3 px-2 text-gray-300">Speed (s)</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model, index) => (
                <motion.tr
                  key={model.name}
                  className="border-b border-gray-700/50 hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${model.color}`} />
                      <span className="font-medium text-white">{model.name}</span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-2 text-gray-400">{model.type}</td>
                  <td className="text-center py-3 px-2 text-white font-semibold">{model.accuracy}%</td>
                  <td className="text-center py-3 px-2 text-white font-semibold">{model.precision}%</td>
                  <td className="text-center py-3 px-2 text-white font-semibold">{model.recall}%</td>
                  <td className="text-center py-3 px-2 text-white font-semibold">{model.f1Score}%</td>
                  <td className="text-center py-3 px-2 text-white font-semibold">{model.speed}s</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <span>Top Performers</span>
          </h4>
          
          <div className="space-y-3">
            {['accuracy', 'f1Score', 'speed'].map((metric) => {
              const bestModel = getBestModel(metric);
              const metricInfo = metrics.find(m => m.key === metric);
              
              return (
                <div key={metric} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <metricInfo.icon className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">{metricInfo.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">{bestModel.name}</div>
                    <div className="text-xs text-gray-400">
                      {metric === 'speed' 
                        ? `${bestModel[metric]}s` 
                        : `${bestModel[metric]}%`
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-purple-400" />
            <span>Model Insights</span>
          </h4>
          
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="font-semibold text-green-400 mb-1">Best Overall</div>
              <div className="text-gray-300">Random Forest provides the best balance of accuracy and speed</div>
            </div>
            
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="font-semibold text-blue-400 mb-1">Fastest</div>
              <div className="text-gray-300">Logistic Regression offers quick predictions with decent accuracy</div>
            </div>
            
            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="font-semibold text-purple-400 mb-1">Most Complex</div>
              <div className="text-gray-300">Neural Networks provide sophisticated pattern recognition</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModelComparison;