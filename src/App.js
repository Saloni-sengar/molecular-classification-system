import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import MoleculeInput from './components/MoleculeInput';
import PredictionResults from './components/PredictionResults';
import ModelComparison from './components/ModelComparison';
import LoadingAnimation from './components/LoadingAnimation';
import Statistics from './components/Statistics';
import About from './components/About';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('predictor');
  const [predictionData, setPredictionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    backendConnected: false,
    modelsLoaded: false,
    datasetLoaded: false
  });
  const [modelStats, setModelStats] = useState({
    totalPredictions: 0,
    accuracy: 94.34,
    modelsCompared: 4,
    functionalGroups: 9,
    level1Accuracy: 94.34,
    level2Accuracy: 86.84
  });

  // API Configuration - automatically detects environment
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://molecular-classification-system.onrender.com'
    : 'http://localhost:5000';

  // Check backend status on app start
  useEffect(() => {
    checkBackendStatus();
    loadSystemStats();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        const data = await response.json();
        setSystemStatus({
          backendConnected: true,
          modelsLoaded: data.models_loaded,
          datasetLoaded: data.dataset_loaded
        });
        
        if (data.models_loaded) {
          toast.success('🤖 ML Models loaded successfully');
        } else {
          toast.error('❌ ML Models failed to load');
        }
      }
    } catch (error) {
      console.error('Backend connection failed:', error);
      setSystemStatus({
        backendConnected: false,
        modelsLoaded: false,
        datasetLoaded: false
      });
      toast.error('🔌 Backend connection failed');
    }
  };

  const loadSystemStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (response.ok) {
        const data = await response.json();
        setModelStats(prev => ({
          ...prev,
          totalMolecules: data.dataset_stats?.total_molecules || 0,
          embeddingDimensions: data.dataset_stats?.embedding_dimensions || 64
        }));
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handlePrediction = async (smiles) => {
    if (!systemStatus.backendConnected) {
      toast.error('❌ Backend not connected. Please start the Flask server.');
      return;
    }

    if (!systemStatus.modelsLoaded) {
      toast.error('❌ ML models not loaded. Please check the backend.');
      return;
    }

    setIsLoading(true);
    
    try {
      const startTime = Date.now();
      
      // Call Flask backend API
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ smiles: smiles })
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Prediction failed');
      }
      
      const processingTime = (Date.now() - startTime) / 1000;
      
      // Transform Flask response to match React component expectations
      const transformedPrediction = {
        smiles: result.smiles,
        hasGroups: result.level1.has_functional_groups,
        confidence: result.level1.confidence,
        level1Prediction: result.level1.prediction,
        functionalGroups: Object.entries(result.level2.functional_groups).map(([name, probability]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          probability: probability,
          detected: probability > 0.5,
          confidence: probability
        })),
        detectedGroups: result.level2.detected_groups,
        totalDetected: result.level2.total_detected,
        modelUsed: result.metadata.algorithm,
        processingTime: result.processing_time,
        inDataset: result.metadata.in_dataset,
        warnings: result.warnings || [],
        timestamp: result.timestamp,
        featureCount: result.metadata.feature_count
      };

      setPredictionData(transformedPrediction);
      setModelStats(prev => ({
        ...prev,
        totalPredictions: prev.totalPredictions + 1
      }));
      
      // Show success toast
      if (transformedPrediction.hasGroups) {
        toast.success(`✅ Found ${transformedPrediction.totalDetected} functional groups`);
      } else {
        toast.success('✅ No functional groups detected');
      }
      
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error(`❌ Prediction failed: ${error.message}`);
      setPredictionData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'predictor':
        return (
          <div className="space-y-8">
            {/* System Status Banner */}
            {!systemStatus.backendConnected && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div>
                    <h3 className="text-red-300 font-semibold">Backend Disconnected</h3>
                    <p className="text-red-200 text-sm">
                      Please start the Flask server: <code className="bg-red-900/30 px-2 py-1 rounded">python app.py</code>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {systemStatus.backendConnected && !systemStatus.modelsLoaded && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <div>
                    <h3 className="text-yellow-300 font-semibold">Models Not Loaded</h3>
                    <p className="text-yellow-200 text-sm">
                      ML models failed to load. Please check the models directory and train the models.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {systemStatus.backendConnected && systemStatus.modelsLoaded && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <h3 className="text-green-300 font-semibold">System Ready</h3>
                    <p className="text-green-200 text-sm">
                      ML models loaded successfully. Ready for predictions.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            <MoleculeInput 
              onPredict={handlePrediction} 
              isLoading={isLoading}
              systemStatus={systemStatus}
            />
            
            {predictionData && (
              <PredictionResults data={predictionData} />
            )}
          </div>
        );
      case 'comparison':
        return <ModelComparison systemStatus={systemStatus} />;
      case 'statistics':
        return <Statistics stats={modelStats} systemStatus={systemStatus} />;
      case 'about':
        return <About />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="animated-bg"></div>
      
      <div className="relative z-10">
        <Header 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          stats={modelStats}
          systemStatus={systemStatus}
        />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fade-in"
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(20px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            fontSize: '14px',
            fontWeight: '500'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
        }}
      />
    </div>
  );
}

export default App;