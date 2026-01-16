import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faPlug,
  faTag,
  faBatteryFull,
  faLayerGroup,
  faClock,
  faPlusCircle,
  faChartLine,
  faTrashAlt,
  faListCheck,
  faChartBar,
  faChartNetwork,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const App = () => {
  const [appliances, setAppliances] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    power: '',
    quantity: '',
    hours: ''
  });
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const nameRef = useRef(null);
  const powerRef = useRef(null);
  const quantityRef = useRef(null);
  const hoursRef = useRef(null);

  // Initialize and handle responsive features
  useEffect(() => {
    // Focus first field on load
    if (nameRef.current) {
      nameRef.current.focus();
    }

    // Add responsive class to body
    document.body.classList.add('responsive-layout');

    // Cleanup
    return () => {
      document.body.classList.remove('responsive-layout');
    };
  }, []);

  const validateInput = useCallback((name, power, quantity, hours) => {
    const errors = [];

    if (!name.trim()) {
      errors.push("Appliance name cannot be empty");
    } else if (name.trim().length > 50) {
      errors.push("Appliance name is too long (max 50 characters)");
    }

    if (!power || parseFloat(power) <= 0) {
      errors.push("Power rating must be a positive number");
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      errors.push("Quantity must be a positive number");
    }

    if (!hours || parseFloat(hours) <= 0) {
      errors.push("Daily usage must be a positive number");
    } else if (parseFloat(hours) > 24) {
      errors.push("Daily usage cannot exceed 24 hours");
    }

    return errors;
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleKeyPress = useCallback((e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  }, []);

  const addAppliance = useCallback((e) => {
    e.preventDefault();

    const errors = validateInput(
      formData.name,
      formData.power,
      formData.quantity,
      formData.hours
    );

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    const energy = ((parseFloat(formData.power) / 1000) * parseFloat(formData.hours)) * parseFloat(formData.quantity);

    const newAppliance = {
      id: Date.now(),
      name: formData.name,
      power: parseFloat(formData.power),
      quantity: parseFloat(formData.quantity),
      hours: parseFloat(formData.hours),
      energy: energy
    };

    setAppliances(prev => [...prev, newAppliance]);

    // Reset form
    setFormData({
      name: '',
      power: '',
      quantity: '',
      hours: ''
    });

    // Focus first field
    setTimeout(() => {
      if (nameRef.current) nameRef.current.focus();
    }, 100);
  }, [formData, validateInput]);

  const deleteAppliance = useCallback((id) => {
    setAppliances(prev => prev.filter(appliance => appliance.id !== id));
  }, []);

  const analyzeData = useCallback(() => {
    if (appliances.length === 0) {
      alert("Please add at least one appliance before analyzing.");
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const totalEnergy = appliances.reduce((sum, app) => sum + app.energy, 0);
      const maxEnergyAppliance = appliances.reduce((max, app) => app.energy > max.energy ? app : max);
      const minEnergyAppliance = appliances.reduce((min, app) => app.energy < min.energy ? app : min);
      const avgEnergy = totalEnergy / appliances.length;

      setAnalysisResults({
        totalEnergy,
        maxEnergyAppliance,
        minEnergyAppliance,
        avgEnergy
      });
      setIsAnalyzing(false);
    }, 800);
  }, [appliances]);

  const clearAll = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all appliances?")) {
      setAppliances([]);
      setAnalysisResults(null);
    }
  }, []);

  // Responsive chart data and options
  const chartData = {
    labels: appliances.map(app => {
      // Truncate long names for mobile
      const maxLength = window.innerWidth < 768 ? 8 : 15;
      return app.name.length > maxLength ?
        app.name.substring(0, maxLength) + '...' :
        app.name;
    }),
    datasets: [
      {
        label: 'Energy Consumption (kWh/day)',
        data: appliances.map(app => app.energy),
        backgroundColor: appliances.map(app => {
          if (analysisResults && app.id === analysisResults.maxEnergyAppliance?.id) {
            return '#EF4444'; // Red for max
          } else if (analysisResults && app.id === analysisResults.minEnergyAppliance?.id) {
            return '#10B981'; // Green for min
          } else {
            return '#3B82F6'; // Blue for others
          }
        }),
        borderColor: appliances.map(app => {
          if (analysisResults && app.id === analysisResults.maxEnergyAppliance?.id) {
            return '#DC2626';
          } else if (analysisResults && app.id === analysisResults.minEnergyAppliance?.id) {
            return '#059669';
          } else {
            return '#2563EB';
          }
        }),
        borderWidth: window.innerWidth < 768 ? 1 : 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: window.innerWidth >= 640,
        position: 'top',
        labels: {
          color: '#ffffff',
          font: {
            size: window.innerWidth < 640 ? 10 : 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        titleColor: '#F8FAFC',
        bodyColor: '#F8FAFC',
        borderColor: '#3B82F6',
        borderWidth: 1,
        padding: window.innerWidth < 640 ? 8 : 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `${context.parsed.y.toFixed(2)} kWh/day`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: window.innerWidth >= 640,
          text: 'Energy Consumption (kWh)',
          color: '#ffffff',
          font: {
            size: window.innerWidth < 640 ? 10 : 12
          }
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: window.innerWidth < 640 ? 9 : 11
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        title: {
          display: window.innerWidth >= 640,
          text: 'Appliances',
          color: '#ffffff',
          font: {
            size: window.innerWidth < 640 ? 10 : 12
          }
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: window.innerWidth < 640 ? 9 : 11
          },
          maxRotation: window.innerWidth < 640 ? 45 : 0,
          minRotation: 0
        },
        grid: {
          display: false
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  // Handle window resize for responsive chart
  useEffect(() => {
    const handleResize = () => {
      if (window.Chart) {
        // Force chart to update on resize
        window.dispatchEvent(new Event('resize'));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <FontAwesomeIcon icon={faBolt} className="text-yellow-400 text-2xl sm:text-3xl md:text-4xl" />
            <span className="leading-tight">Professional Home Load Analyzer</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-200 leading-relaxed">
            Advanced Energy Consumption Analysis & Management System
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column - Input and List - Responsive */}
          <div className="space-y-6 sm:space-y-8">
            {/* Input Section - Responsive */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faPlug} className="text-yellow-400" />
                Add New Appliance
              </h2>

              <form onSubmit={addAppliance} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-200">
                      <FontAwesomeIcon icon={faTag} className="text-yellow-400" />
                      Appliance Name
                    </label>
                    <input
                      ref={nameRef}
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, powerRef)}
                      placeholder="e.g., Energy Efficient Refrigerator"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-blue-200 focus:border-yellow-400 focus:outline-none transition-all duration-200 bg-white/90 text-gray-800 text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-200">
                      <FontAwesomeIcon icon={faBatteryFull} className="text-yellow-400" />
                      Power Rating (Watts)
                    </label>
                    <input
                      ref={powerRef}
                      type="number"
                      value={formData.power}
                      onChange={(e) => handleInputChange('power', e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, quantityRef)}
                      placeholder="e.g., 150"
                      min="1"
                      step="any"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-blue-200 focus:border-yellow-400 focus:outline-none transition-all duration-200 bg-white/90 text-gray-800 text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-200">
                      <FontAwesomeIcon icon={faLayerGroup} className="text-yellow-400" />
                      Quantity
                    </label>
                    <input
                      ref={quantityRef}
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, hoursRef)}
                      placeholder="e.g., 1"
                      min="1"
                      step="any"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-blue-200 focus:border-yellow-400 focus:outline-none transition-all duration-200 bg-white/90 text-gray-800 text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-200">
                      <FontAwesomeIcon icon={faClock} className="text-yellow-400" />
                      Daily Usage (Hours)
                    </label>
                    <input
                      ref={hoursRef}
                      type="number"
                      value={formData.hours}
                      onChange={(e) => handleInputChange('hours', e.target.value)}
                      onKeyPress={(e) => {
                        handleKeyPress(e, null);
                        if (e.key === 'Enter') {
                          addAppliance(e);
                        }
                      }}
                      placeholder="e.g., 24"
                      min="0.1"
                      max="24"
                      step="any"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-blue-200 focus:border-yellow-400 focus:outline-none transition-all duration-200 bg-white/90 text-gray-800 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
                >
                  <FontAwesomeIcon icon={faPlusCircle} />
                  Add Appliance
                </motion.button>
              </form>
            </motion.div>

            {/* Appliances List - Responsive */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faListCheck} className="text-green-400" />
                  Energy Load Inventory
                </h2>
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={analyzeData}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-2 sm:py-3 px-3 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    <FontAwesomeIcon icon={faChartLine} />
                    <span className="hidden sm:inline">Analyze</span>
                    <span className="sm:hidden">Go</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearAll}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-2 sm:py-3 px-3 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                    <span className="hidden sm:inline">Clear</span>
                    <span className="sm:hidden">Clr</span>
                  </motion.button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">Appliance</th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">Power (W)</th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">Qty</th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">Hours</th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">Energy (kWh)</th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {appliances.map((appliance, index) => (
                        <motion.tr
                          key={appliance.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-white/10 hover:bg-white/10 transition-all duration-200"
                        >
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">{appliance.name}</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">{appliance.power}</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">{appliance.quantity}</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">{appliance.hours}</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 font-bold text-yellow-400 text-xs sm:text-sm">
                            {appliance.energy.toFixed(2)}
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteAppliance(appliance.id)}
                              className="bg-red-500 hover:bg-red-600 text-white p-1 sm:p-2 rounded-lg transition-colors duration-200 text-xs"
                            >
                              <FontAwesomeIcon icon={faTrash} size="sm" />
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {appliances.length === 0 && (
                <div className="text-center py-6 sm:py-8 text-blue-200">
                  <FontAwesomeIcon icon={faListCheck} className="text-2xl sm:text-4xl mb-2 sm:mb-4" />
                  <p className="text-sm sm:text-base">No appliances added yet</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Results and Chart - Responsive */}
          <div className="space-y-6 sm:space-y-8">
            {/* Results Section - Responsive */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faChartBar} className="text-purple-400" />
                Energy Analysis Dashboard
              </h2>

              {analysisResults ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-3 sm:p-4 rounded-xl border border-blue-400/30">
                      <h3 className="text-blue-200 font-semibold text-xs sm:text-sm mb-1">Total Energy</h3>
                      <p className="text-xl sm:text-2xl font-bold text-white">{analysisResults.totalEnergy.toFixed(2)} kWh</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 p-3 sm:p-4 rounded-xl border border-green-400/30">
                      <h3 className="text-green-200 font-semibold text-xs sm:text-sm mb-1">Avg Energy</h3>
                      <p className="text-xl sm:text-2xl font-bold text-white">{analysisResults.avgEnergy.toFixed(2)} kWh</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 p-3 sm:p-4 rounded-xl border border-red-400/30">
                    <h3 className="text-red-200 font-semibold text-xs sm:text-sm mb-1">Highest Consumer</h3>
                    <p className="text-base sm:text-lg font-bold text-white">{analysisResults.maxEnergyAppliance.name}</p>
                    <p className="text-red-300 text-xs sm:text-sm">{analysisResults.maxEnergyAppliance.energy.toFixed(2)} kWh</p>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 p-3 sm:p-4 rounded-xl border border-emerald-400/30">
                    <h3 className="text-emerald-200 font-semibold text-xs sm:text-sm mb-1">Lowest Consumer</h3>
                    <p className="text-base sm:text-lg font-bold text-white">{analysisResults.minEnergyAppliance.name}</p>
                    <p className="text-emerald-300 text-xs sm:text-sm">{analysisResults.minEnergyAppliance.energy.toFixed(2)} kWh</p>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-8 sm:py-12 text-blue-200">
                  <FontAwesomeIcon icon={faChartNetwork} className="text-2xl sm:text-4xl mb-2 sm:mb-4" />
                  <p className="text-sm sm:text-base">Add appliances and click "Analyze" to see comprehensive energy insights</p>
                </div>
              )}
            </motion.div>

            {/* Chart Section - Responsive */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl"
            >
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Energy Consumption Overview</h3>
              <div className="h-64 sm:h-80">
                {appliances.length > 0 ? (
                  <Bar data={chartData} options={chartOptions} />
                ) : (
                  <div className="h-full flex items-center justify-center text-blue-200">
                    <p className="text-sm sm:text-base">Add appliances to see the energy consumption chart</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;