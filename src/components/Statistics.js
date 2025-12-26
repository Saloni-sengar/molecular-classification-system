import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Target, 
  Clock,
  BarChart3,
  Activity,
  Award
} from 'lucide-react';

const Statistics = ({ stats }) => {
  const statisticsData = [
    {
      title: 'Total Predictions',
      value: stats.totalPredictions.toLocaleString(),
      change: '+12.5%',
      changeType: 'positive',
      icon: Zap,
      color: 'from-blue-400 to-blue-600',
      description: 'Molecules analyzed this month'
    },
    {
      title: 'Model Accuracy',
      value: `${stats.accuracy}%`,
      change: '+2.1%',
      changeType: 'positive',
      icon: Target,
      color: 'from-green-400 to-green-600',
      description: 'Average prediction accuracy'
    },
    {
      title: 'Models Compared',
      value: stats.modelsCompared,
      change: '+4',
      changeType: 'positive',
      icon: BarChart3,
      color: 'from-purple-400 to-purple-600',
      description: 'ML algorithms benchmarked'
    },
    {
      title: 'Functional Groups',
      value: stats.functionalGroups,
      change: 'stable',
      changeType: 'neutral',
      icon: Activity,
      color: 'from-orange-400 to-orange-600',
      description: 'Chemical groups detected'
    }
  ];

  const performanceData = [
    { name: 'Alcohol', accuracy: 94.2, predictions: 342 },
    { name: 'Carbonyl', accuracy: 91.8, predictions: 298 },
    { name: 'Amine', accuracy: 96.1, predictions: 267 },
    { name: 'Amide', accuracy: 89.3, predictions: 156 },
    { name: 'Alkene', accuracy: 87.5, predictions: 203 },
    { name: 'Alkyne', accuracy: 85.9, predictions: 189 },
    { name: 'Ether', accuracy: 92.7, predictions: 445 },
    { name: 'Fluorinated', accuracy: 98.4, predictions: 23 },
    { name: 'Nitrile', accuracy: 93.6, predictions: 178 }
  ];

  const recentActivity = [
    { time: '2 minutes ago', action: 'Caffeine molecule analyzed', result: '3 functional groups detected' },
    { time: '5 minutes ago', action: 'Model comparison completed', result: 'Random Forest performed best' },
    { time: '12 minutes ago', action: 'Aspirin structure predicted', result: '2 functional groups found' },
    { time: '18 minutes ago', action: 'Batch analysis finished', result: '25 molecules processed' },
    { time: '23 minutes ago', action: 'New model trained', result: '94.3% accuracy achieved' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-8 h-8 text-green-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Performance Statistics</h2>
            <p className="text-gray-300">Real-time analytics and model performance metrics</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statisticsData.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <motion.div
              key={stat.title}
              className="card p-6 hover:bg-white/15 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {stat.changeType !== 'neutral' && (
                  <div className={`
                    text-sm font-semibold px-2 py-1 rounded-full
                    ${stat.changeType === 'positive' 
                      ? 'text-green-400 bg-green-400/20' 
                      : 'text-red-400 bg-red-400/20'
                    }
                  `}>
                    {stat.change}
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Functional Group Performance */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
          <Award className="w-5 h-5 text-yellow-400" />
          <span>Functional Group Performance</span>
        </h3>
        
        <div className="space-y-4">
          {performanceData.map((group, index) => (
            <motion.div
              key={group.name}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                <div>
                  <h4 className="font-semibold text-white">{group.name}</h4>
                  <p className="text-sm text-gray-400">{group.predictions} predictions</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-bold text-white">{group.accuracy}%</div>
                  <div className="text-xs text-gray-400">Accuracy</div>
                </div>
                
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${group.accuracy}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity & Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span>Recent Activity</span>
          </h3>
          
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white truncate">
                      {activity.action}
                    </p>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{activity.result}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Performance Trends */}
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span>Performance Trends</span>
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-400">Accuracy Trend</span>
                <span className="text-sm text-green-400">↗ +2.1%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: '94%' }}
                  transition={{ duration: 1.5 }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">Consistent improvement over last 30 days</p>
            </div>
            
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-400">Processing Speed</span>
                <span className="text-sm text-blue-400">↗ +15%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: '87%' }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">Faster predictions with model optimization</p>
            </div>
            
            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-400">User Satisfaction</span>
                <span className="text-sm text-purple-400">↗ +8%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: '92%' }}
                  transition={{ duration: 1.5, delay: 0.4 }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">Positive feedback from research community</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Statistics;