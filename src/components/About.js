import React from 'react';
import { motion } from 'framer-motion';
import { 
  Atom, 
  Brain, 
  Zap, 
  Target, 
  Users,
  Code,
  BookOpen,
  Award,
  Github,
  ExternalLink
} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Brain,
      title: 'Advanced AI Models',
      description: 'Utilizes 24+ machine learning algorithms including Random Forest, SVM, and Neural Networks for accurate predictions.',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized algorithms provide predictions in under 0.5 seconds with 94.3% accuracy.',
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      icon: Target,
      title: 'Multi-Level Classification',
      description: 'Two-stage prediction system: first determines if functional groups exist, then identifies specific groups.',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: Atom,
      title: '9 Functional Groups',
      description: 'Detects alcohol, carbonyl, amine, amide, alkene, alkyne, ether, fluorinated, and nitrile groups.',
      color: 'from-purple-400 to-purple-600'
    }
  ];

  const technologies = [
    { name: 'Python', description: 'Backend ML models and API' },
    { name: 'React', description: 'Modern frontend framework' },
    { name: 'Tailwind CSS', description: 'Utility-first styling' },
    { name: 'Framer Motion', description: 'Smooth animations' },
    { name: 'scikit-learn', description: 'Machine learning library' },
    { name: 'Flask', description: 'Lightweight web framework' }
  ];

  const teamMembers = [
    {
      name: 'Saloni Sengar',
      role: 'Lead Data Scientist',
      description: 'PhD in Computational Chemistry, 10+ years in molecular modeling',
      avatar: '👩‍🔬'
    },
    {
      name: 'Ashish Sharma',
      role: 'ML Engineer',
      description: 'Specialized in ensemble methods and model optimization',
      avatar: '👨‍💻'
    },
    {
      name: 'porf. Ruchi Jain',
      role: 'Chemistry Advisor',
      description: 'Professor of Organic Chemistry, functional group expert',
      avatar: '👨‍🎓'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <div className="card p-8 text-center">
        <motion.div
          className="inline-flex items-center space-x-3 mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Atom className="w-8 h-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MolecularAI
            </h1>
            <p className="text-gray-300">Functional Group Predictor</p>
          </div>
        </motion.div>
        
        <motion.p
          className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          An advanced AI-powered platform that analyzes molecular structures and predicts functional groups 
          with state-of-the-art machine learning algorithms. Built for researchers, students, and chemistry professionals.
        </motion.p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          
          return (
            <motion.div
              key={feature.title}
              className="glass-card p-6 hover:bg-white/15 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* How It Works */}
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-blue-400" />
          <span>How It Works</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Input SMILES',
              description: 'Enter a SMILES string representing your molecular structure',
              icon: Code
            },
            {
              step: '02',
              title: 'AI Analysis',
              description: 'Our ensemble of ML models analyzes the molecular features',
              icon: Brain
            },
            {
              step: '03',
              title: 'Get Results',
              description: 'Receive detailed predictions with confidence scores',
              icon: Target
            }
          ].map((step, index) => {
            const Icon = step.icon;
            
            return (
              <motion.div
                key={step.step}
                className="text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="text-gray-300 text-sm">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Code className="w-6 h-6 text-green-400" />
          <span>Technology Stack</span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <h4 className="font-semibold text-white mb-1">{tech.name}</h4>
              <p className="text-xs text-gray-400">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Users className="w-6 h-6 text-purple-400" />
          <span>Meet the Team</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="text-center space-y-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-4xl mb-2">{member.avatar}</div>
              <h3 className="font-semibold text-white">{member.name}</h3>
              <p className="text-sm text-blue-400 font-medium">{member.role}</p>
              <p className="text-xs text-gray-400">{member.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats & Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Stats */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <span>Project Stats</span>
          </h3>
          
          <div className="space-y-4">
            {[
              { label: 'Training Dataset', value: '129,428 molecules' },
              { label: 'Model Accuracy', value: '94.3%' },
              { label: 'Algorithms Tested', value: '24+' },
              { label: 'Processing Speed', value: '<0.5s' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <span className="text-gray-300">{stat.label}</span>
                <span className="font-semibold text-white">{stat.value}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Links & Resources */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <ExternalLink className="w-5 h-5 text-blue-400" />
            <span>Resources</span>
          </h3>
          
          <div className="space-y-3">
            {[
              { label: 'GitHub Repository', icon: Github, href: '#' },
              { label: 'Research Paper', icon: BookOpen, href: '#' },
              { label: 'API Documentation', icon: Code, href: '#' },
              { label: 'Dataset Download', icon: ExternalLink, href: '#' }
            ].map((link, index) => {
              const Icon = link.icon;
              
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                  <span className="text-gray-300 group-hover:text-white transition-colors">{link.label}</span>
                  <ExternalLink className="w-3 h-3 text-gray-500 ml-auto" />
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;