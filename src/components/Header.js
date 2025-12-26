import React from 'react';
import { motion } from 'framer-motion';
import { 
  Atom, 
  BarChart3, 
  TrendingUp, 
  Info,
  Zap,
  Target,
  Brain
} from 'lucide-react';

const Header = ({ currentView, setCurrentView, stats }) => {
  const navItems = [
    { id: 'predictor', label: 'Predictor', icon: Atom },
    { id: 'comparison', label: 'Models', icon: BarChart3 },
    { id: 'statistics', label: 'Stats', icon: TrendingUp },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <header className="glass mx-4 mt-4 p-6">
      <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
        {/* Logo and Title */}
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <motion.div
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Atom className="w-6 h-6 text-white" />
            </motion.div>
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MolecularAI
            </h1>
            <p className="text-sm text-gray-300">Functional Group Predictor</p>
          </div>
        </motion.div>

        {/* Stats Display */}
        <motion.div 
          className="hidden md:flex items-center space-x-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 text-sm">
            <Target className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">Accuracy:</span>
            <span className="text-green-400 font-semibold">{stats.accuracy}%</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Brain className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300">Models:</span>
            <span className="text-blue-400 font-semibold">{stats.modelsCompared}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-gray-300">Predictions:</span>
            <span className="text-purple-400 font-semibold">{stats.totalPredictions.toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.nav 
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                    layoutId="activeTab"
                  />
                )}
              </motion.button>
            );
          })}
        </motion.nav>
      </div>
    </header>
  );
};

export default Header;