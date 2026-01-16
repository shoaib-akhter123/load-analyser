// Professional Home Load Analyzer - Enhanced Script
// Implements responsive design, animations, and professional UI

// Global variables
let appliances = [];
let chart = null;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeEventListeners();
    initializeResponsiveFeatures();

    // Focus first input field
    const firstInput = document.getElementById('appliance-name');
    if (firstInput) {
        firstInput.focus();
    }
});

function initializeResponsiveFeatures() {
    // Add responsive adjustments for different screen sizes
    adjustLayoutForScreenSize();

    // Add resize event listener
    window.addEventListener('resize', function() {
        adjustLayoutForScreenSize();

        // Refresh chart if it exists
        if (chart && appliances.length > 0) {
            setTimeout(() => {
                if (chart) {
                    chart.resize();
                }
            }, 100);
        }
    });

    // Add touch support for mobile devices
    addTouchSupport();
}

function addTouchSupport() {
    // Add touch-friendly interactions
    document.body.addEventListener('touchstart', function() {}, { passive: true });

    // Add touch-friendly tooltips for mobile
    const chartContainer = document.getElementById('chart-section-animation-target');
    if (chartContainer) {
        chartContainer.addEventListener('touchstart', function(e) {
            // Add visual feedback for touch on chart
            chartContainer.style.transform = 'scale(0.98)';
            setTimeout(() => {
                chartContainer.style.transform = 'scale(1)';
            }, 150);
        }, { passive: true });
    }
}

function adjustLayoutForScreenSize() {
    const width = window.innerWidth;
    const size = document.documentElement.style;

    if (width < 640) {
        // Mobile styles
        size.setProperty('--card-padding', '0.75rem');
        size.setProperty('--font-size-small', '0.75rem');
        size.setProperty('--font-size-medium', '0.875rem');
        size.setProperty('--font-size-large', '1rem');
        size.setProperty('--button-padding', '0.5rem 1rem');
        size.setProperty('--input-padding', '0.5rem');
    } else if (width < 1024) {
        // Tablet styles
        size.setProperty('--card-padding', '1rem');
        size.setProperty('--font-size-small', '0.8rem');
        size.setProperty('--font-size-medium', '0.95rem');
        size.setProperty('--font-size-large', '1.1rem');
        size.setProperty('--button-padding', '0.6rem 1.2rem');
        size.setProperty('--input-padding', '0.6rem');
    } else {
        // Desktop styles
        size.setProperty('--card-padding', '1.5rem');
        size.setProperty('--font-size-small', '0.875rem');
        size.setProperty('--font-size-medium', '1rem');
        size.setProperty('--font-size-large', '1.25rem');
        size.setProperty('--button-padding', '0.75rem 1.5rem');
        size.setProperty('--input-padding', '0.75rem');
    }
}

function initializeAnimations() {
    // Staggered fade-in animation for all sections
    const sections = document.querySelectorAll('[id$="-animation-target"], [class*="animation-target"]');
    sections.forEach((section, index) => {
        // Set initial state
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px) scale(0.95)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        // Animate in sequence
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0) scale(1)';
        }, index * 100 + 50);
    });

    // Add hover animations to interactive elements
    const interactiveElements = document.querySelectorAll('button, input, select, textarea, tr');
    interactiveElements.forEach(element => {
        element.style.transition = 'all 0.2s ease';

        element.addEventListener('mouseenter', function() {
            if (!element.classList.contains('no-hover')) {
                element.style.transform = 'translateY(-1px)';
                element.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }
        });

        element.addEventListener('mouseleave', function() {
            element.style.transform = 'translateY(0)';
            element.style.boxShadow = '';
        });
    });
}

function initializeEventListeners() {
    // Form submission
    const form = document.getElementById('appliance-form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }

    // Input field navigation with Enter key
    setupEnterKeyNavigation();

    // Button event listeners
    const analyzeBtn = document.getElementById('finish-analyze');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeData);
    }

    const clearBtn = document.getElementById('clear-all');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAll);
    }

    // Add validation feedback
    setupInputValidation();
}

function setupEnterKeyNavigation() {
    const inputs = document.querySelectorAll('#appliance-form input');
    inputs.forEach((input, index) => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const nextIndex = (index + 1) % inputs.length;
                inputs[nextIndex].focus();
            }
        });
    });
}

function setupInputValidation() {
    const inputs = document.querySelectorAll('#appliance-form input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(input);
        });

        input.addEventListener('input', function() {
            // Clear error state as user types
            input.style.borderColor = '';
            const errorElement = input.parentNode.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        });
    });
}

function validateField(input) {
    const value = input.value.trim();
    const fieldName = input.name || input.id;

    // Remove existing error
    input.style.borderColor = '';
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) existingError.remove();

    let errorMessage = '';

    switch(input.type) {
        case 'text':
            if (!value) {
                errorMessage = `${fieldName} is required`;
            } else if (value.length > 50) {
                errorMessage = `${fieldName} is too long (max 50 characters)`;
            }
            break;

        case 'number':
            const numValue = parseFloat(value);
            if (!value) {
                errorMessage = `${fieldName} is required`;
            } else if (isNaN(numValue) || numValue <= 0) {
                errorMessage = `${fieldName} must be a positive number`;
            } else if (input.id === 'daily-usage' && numValue > 24) {
                errorMessage = 'Daily usage cannot exceed 24 hours';
            }
            break;
    }

    if (errorMessage) {
        input.style.borderColor = '#EF4444';
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-400 text-xs mt-1';
        errorDiv.textContent = errorMessage;
        input.parentNode.appendChild(errorDiv);
        return false;
    }

    return true;
}

function handleSubmit(e) {
    e.preventDefault();

    // Validate all fields
    const inputs = document.querySelectorAll('#appliance-form input');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    if (!isValid) {
        showNotification('Please fix the errors above', 'error');
        return;
    }

    // Get form values
    const name = document.getElementById('appliance-name').value.trim();
    const power = parseFloat(document.getElementById('power-rating').value);
    const quantity = parseFloat(document.getElementById('quantity').value);
    const hours = parseFloat(document.getElementById('daily-usage').value);

    // Calculate energy (kWh/day)
    const energy = ((power * hours) / 1000) * quantity;

    // Create appliance object
    const appliance = {
        id: Date.now(),
        name,
        power,
        quantity,
        hours,
        energy
    };

    // Add to appliances array
    appliances.push(appliance);

    // Update UI with animation
    updateAppliancesTable();

    // Show success notification
    showNotification(`"${name}" added successfully!`, 'success');

    // Reset form
    e.target.reset();

    // Focus first field
    const firstInput = document.getElementById('appliance-name');
    if (firstInput) firstInput.focus();
}

function updateAppliancesTable() {
    const tbody = document.getElementById('appliances-body');
    if (!tbody) return;

    // Clear existing rows
    tbody.innerHTML = '';

    // Add each appliance with animation
    appliances.forEach((appliance, index) => {
        const row = document.createElement('tr');
        row.className = 'border-b border-white/20 hover:bg-white/10 transition-all duration-200';
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';

        // Responsive cell display based on screen size
        const isMobile = window.innerWidth < 768;

        row.innerHTML = `
            <td class="py-3 px-4">${appliance.name}</td>
            <td class="py-3 px-4">${appliance.power}W</td>
            <td class="py-3 px-4">${appliance.quantity}</td>
            <td class="py-3 px-4">${appliance.hours}h</td>
            <td class="py-3 px-4 font-bold text-yellow-400">${appliance.energy.toFixed(2)} kWh</td>
            <td class="py-3 px-4">
                <button onclick="deleteAppliance(${appliance.id})"
                        class="delete-btn bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors duration-200">
                    <i class="fas fa-trash text-sm"></i>
                </button>
            </td>
        `;

        tbody.appendChild(row);

        // Animate row in
        setTimeout(() => {
            row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, index * 50);
    });

    // Update summary when table changes
    updateSummary();
}

function deleteAppliance(id) {
    appliances = appliances.filter(appliance => appliance.id !== id);
    updateAppliancesTable();
    showNotification('Appliance removed successfully', 'info');
}

function analyzeData() {
    if (appliances.length === 0) {
        showNotification('Please add at least one appliance first', 'error');
        return;
    }

    // Show loading state
    const resultsSection = document.getElementById('results-section-animation-target');
    if (resultsSection) {
        resultsSection.innerHTML = `
            <div class="text-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                <p class="text-blue-200">Analyzing energy consumption...</p>
            </div>
        `;
    }

    // Simulate processing time for better UX
    setTimeout(() => {
        updateSummary();
        updateChart();
    }, 800);
}

function updateSummary() {
    if (appliances.length === 0) return;

    // Calculate statistics
    const totalEnergy = appliances.reduce((sum, app) => sum + app.energy, 0);
    const avgEnergy = totalEnergy / appliances.length;

    // Find max and min consumers
    let maxAppliance = appliances[0];
    let minAppliance = appliances[0];

    appliances.forEach(app => {
        if (app.energy > maxAppliance.energy) maxAppliance = app;
        if (app.energy < minAppliance.energy) minAppliance = app;
    });

    const resultsSection = document.getElementById('summary-results');
    if (resultsSection) {
        // Responsive layout adjustments
        const isMobile = window.innerWidth < 640;
        const cardClass = isMobile ? 'p-3' : 'p-6';
        const textClass = isMobile ? 'text-sm' : 'text-base';

        resultsSection.innerHTML = `
            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="${cardClass} bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-400/30">
                        <h3 class="text-blue-200 font-semibold ${textClass} mb-1">Total Energy</h3>
                        <p class="text-2xl font-bold text-white">${totalEnergy.toFixed(2)} kWh</p>
                    </div>
                    <div class="${cardClass} bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl border border-green-400/30">
                        <h3 class="text-green-200 font-semibold ${textClass} mb-1">Average Energy</h3>
                        <p class="text-2xl font-bold text-white">${avgEnergy.toFixed(2)} kWh</p>
                    </div>
                </div>

                <div class="${cardClass} bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-xl border border-red-400/30">
                    <h3 class="text-red-200 font-semibold ${textClass} mb-1">Highest Consumer</h3>
                    <p class="text-lg font-bold text-white">${maxAppliance.name}</p>
                    <p class="text-red-300">${maxAppliance.energy.toFixed(2)} kWh</p>
                </div>

                <div class="${cardClass} bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-xl border border-emerald-400/30">
                    <h3 class="text-emerald-200 font-semibold ${textClass} mb-1">Lowest Consumer</h3>
                    <p class="text-lg font-bold text-white">${minAppliance.name}</p>
                    <p class="text-emerald-300">${minAppliance.energy.toFixed(2)} kWh</p>
                </div>
            </div>
        `;
    }
}

function updateChart() {
    if (appliances.length === 0) return;

    const ctx = document.getElementById('energy-chart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (chart) {
        chart.destroy();
    }

    const labels = appliances.map(app => {
        // Truncate long names for mobile
        const maxLength = window.innerWidth < 640 ? 8 : 15;
        return app.name.length > maxLength ?
            app.name.substring(0, maxLength) + '...' :
            app.name;
    });

    const data = appliances.map(app => app.energy);

    // Color coding: red for max, green for min, blue for others
    const maxEnergy = Math.max(...data);
    const minEnergy = Math.min(...data);

    const backgroundColors = data.map(energy => {
        if (energy === maxEnergy) return '#EF4444'; // Red
        else if (energy === minEnergy) return '#10B981'; // Green
        else return '#3B82F6'; // Blue
    });

    const borderColors = data.map(energy => {
        if (energy === maxEnergy) return '#DC2626';
        else if (energy === minEnergy) return '#059669';
        else return '#2563EB';
    });

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Energy Consumption (kWh/day)',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: window.innerWidth >= 640,
                    labels: {
                        color: '#F8FAFC',
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
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y.toFixed(2) + ' kWh/day';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: window.innerWidth >= 640,
                        text: 'Energy (kWh)',
                        color: '#F8FAFC',
                        font: {
                            size: window.innerWidth < 640 ? 10 : 12
                        }
                    },
                    ticks: {
                        color: '#F8FAFC',
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
                        color: '#F8FAFC',
                        font: {
                            size: window.innerWidth < 640 ? 10 : 12
                        }
                    },
                    ticks: {
                        color: '#F8FAFC',
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
        }
    });
}

function clearAll() {
    if (confirm('Are you sure you want to clear all appliances?')) {
        // Add visual feedback
        const sections = document.querySelectorAll('[id$="-animation-target"]');
        sections.forEach(section => {
            section.style.transition = 'all 0.3s ease';
            section.style.opacity = '0.5';
            section.style.transform = 'scale(0.98)';
        });

        setTimeout(() => {
            appliances = [];
            updateAppliancesTable();

            // Clear results
            const resultsSection = document.getElementById('summary-results');
            if (resultsSection) {
                resultsSection.innerHTML = `
                    <div class="text-center py-12 text-blue-200">
                        <i class="fas fa-chart-network text-4xl mb-4"></i>
                        <p>Add appliances and click "Analyze" to see energy insights</p>
                    </div>
                `;
            }

            // Clear chart
            if (chart) {
                chart.destroy();
                chart = null;
            }

            // Reset sections
            sections.forEach(section => {
                section.style.opacity = '1';
                section.style.transform = 'scale(1)';
            });

            showNotification('All appliances cleared', 'success');
        }, 300);
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.className = `
        notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm
        ${type === 'error' ? 'bg-red-500' :
          type === 'success' ? 'bg-green-500' :
          'bg-blue-500'}
        text-white transition-all duration-300
    `;
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    notification.style.transform = 'translateX(100%)';

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Auto remove after delay
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Make functions available globally
window.deleteAppliance = deleteAppliance;
window.analyzeData = analyzeData;
window.clearAll = clearAll;