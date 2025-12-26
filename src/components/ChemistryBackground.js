import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ChemistryBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate floating particles
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 5,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Molecule structures for background
  const molecules = [
    {
      id: 'benzene',
      atoms: [
        { x: 50, y: 30, element: 'C' },
        { x: 65, y: 40, element: 'C' },
        { x: 65, y: 60, element: 'C' },
        { x: 50, y: 70, element: 'C' },
        { x: 35, y: 60, element: 'C' },
        { x: 35, y: 40, element: 'C' },
      ],
      bonds: [
        { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 },
        { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 5, to: 0 }
      ]
    },
    {
      id: 'ethanol',
      atoms: [
        { x: 20, y: 80, element: 'C' },
        { x: 35, y: 80, element: 'C' },
        { x: 50, y: 80, element: 'O' },
        { x: 65, y: 80, element: 'H' },
      ],
      bonds: [
        { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }
      ]
    }
  ];

  const getAtomColor = (element) => {
    const colors = {
      'C': '#1a1a1a',
      'O': '#ff0d0d',
      'N': '#3050f8',
      'H': '#ffffff',
      'F': '#90e050',
      'S': '#ffff30',
    };
    return colors[element] || '#ffffff';
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
      
      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Molecular structures */}
      <div className="absolute inset-0 opacity-10">
        {molecules.map((molecule, molIndex) => (
          <motion.svg
            key={molecule.id}
            className="absolute"
            style={{
              left: `${20 + molIndex * 60}%`,
              top: `${10 + molIndex * 30}%`,
              width: '200px',
              height: '200px',
            }}
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              rotate: 360,
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Bonds */}
            {molecule.bonds.map((bond, bondIndex) => {
              const fromAtom = molecule.atoms[bond.from];
              const toAtom = molecule.atoms[bond.to];
              return (
                <motion.line
                  key={bondIndex}
                  x1={fromAtom.x}
                  y1={fromAtom.y}
                  x2={toAtom.x}
                  y2={toAtom.y}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2,
                    delay: bondIndex * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              );
            })}
            
            {/* Atoms */}
            {molecule.atoms.map((atom, atomIndex) => (
              <motion.circle
                key={atomIndex}
                cx={atom.x}
                cy={atom.y}
                r="6"
                fill={getAtomColor(atom.element)}
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="1"
                initial={{ scale: 0 }}
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{
                  duration: 3,
                  delay: atomIndex * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.svg>
        ))}
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full">
          <defs>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Glowing orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full opacity-10 blur-xl"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-500 rounded-full opacity-10 blur-xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* DNA helix-like structure */}
      <div className="absolute right-0 top-0 h-full w-32 opacity-5">
        <svg className="w-full h-full">
          <motion.path
            d="M 16 0 Q 32 50 16 100 Q 0 150 16 200 Q 32 250 16 300 Q 0 350 16 400"
            fill="none"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </svg>
      </div>
    </div>
  );
};

export default ChemistryBackground;