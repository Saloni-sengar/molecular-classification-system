import React from 'react';
import { motion } from 'framer-motion';
import { Atom, Zap, Brain } from 'lucide-react';

const LoadingAnimation = () => {
  const atoms = [
    { id: 1, color: 'bg-blue-400', delay: 0 },
    { id: 2, color: 'bg-purple-400', delay: 0.2 },
    { id: 3, color: 'bg-green-400', delay: 0.4 },
    { id: 4, color: 'bg-yellow-400', delay: 0.6 },
    { id: 5, color: 'bg-red-400', delay: 0.8 },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animated-bg"></div>
      <div className="relative z-10 text-center space-y-8">
        {/* Main loading animation */}
        <motion.div
          className="relative w-32 h-32 mx-auto"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          {/* Central atom */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Orbiting atoms */}
          {atoms.map((atom, index) => (
            <motion.div
              key={atom.id}
              className={`absolute w-4 h-4 ${atom.color} rounded-full`}
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '0 0',
              }}
              animate={{
                rotate: 360,
                x: Math.cos((index * 72) * Math.PI / 180) * 50,
                y: Math.sin((index * 72) * Math.PI / 180) * 50,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: atom.delay,
              }}
            />
          ))}
          
          {/* Electron paths */}
          <svg className="absolute inset-0 w-full h-full">
            <motion.circle
              cx="64"
              cy="64"
              r="50"
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1"
              strokeDasharray="5,5"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              cx="64"
              cy="64"
              r="35"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
              strokeDasharray="3,3"
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </motion.div>

        {/* Loading text */}
        <div className="space-y-4">
          <motion.div
            className="flex items-center justify-center space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Atom className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MolecularAI
            </h1>
          </motion.div>
          
          <motion.p
            className="text-gray-300 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Initializing AI Models...
          </motion.p>
          
          {/* Loading steps */}
          <div className="space-y-2 max-w-md mx-auto">
            {[
              { icon: Brain, text: "Loading Neural Networks", delay: 0.5 },
              { icon: Zap, text: "Calibrating Algorithms", delay: 1.0 },
              { icon: Atom, text: "Preparing Molecular Analysis", delay: 1.5 },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3 text-sm text-gray-400"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: step.delay }}
              >
                <step.icon className="w-4 h-4" />
                <span>{step.text}</span>
                <motion.div
                  className="flex space-x-1 ml-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: step.delay + 0.3 }}
                >
                  {[0, 1, 2].map((dot) => (
                    <motion.div
                      key={dot}
                      className="w-1 h-1 bg-blue-400 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: dot * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 mx-auto">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;