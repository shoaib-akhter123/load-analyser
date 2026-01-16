// Global variables
let appliances = [];
let chart = null;

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeEventListeners();

    // Auto-focus first field
    const nameInput = document.getElementById('appliance-name');
    if (nameInput) {
        nameInput.focus();
    }
});

function initializeAnimations() {
    // Simple fade-in animation for main sections
    const sections = document.querySelectorAll('[id$="-animation-target"]');
    sections.forEach((section, index) => {
        setTimeout(() => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

            // Trigger animation after a slight delay
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 100 + 100);
        }, 50);
    });
}

function initializeEventListeners() {
    // Form submission
    const form = document.getElementById('appliance-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            addAppliance();
        });
    }

    // Add Enter key navigation for form fields
    const nameInput = document.getElementById('appliance-name');
    const powerInput = document.getElementById('power-rating');
    const quantityInput = document.getElementById('quantity');
    const hoursInput = document.getElementById('daily-usage');

    if (nameInput) nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && powerInput) {
            e.preventDefault();
            powerInput.focus();
        }
    });

    if (powerInput) powerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && quantityInput) {
            e.preventDefault();
            quantityInput.focus();
        }
    });

    if (quantityInput) quantityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && hoursInput) {
            e.preventDefault();
            hoursInput.focus();
        }
    });

    if (hoursInput) hoursInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addAppliance();
        }
    });

    // Finish & Analyze button
    const analyzeBtn = document.getElementById('finish-analyze');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeData);
    }

    // Clear All button
    const clearBtn = document.getElementById('clear-all');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAll);
    }
}

function validateInput(name, power, quantity, hours) {
    const errors = [];

    // Validate appliance name
    if (!name.trim()) {
        errors.push("Appliance name cannot be empty");
    } else if (name.trim().length > 50) {
        errors.push("Appliance name is too long (max 50 characters)");
    }

    // Validate power rating
    if (!power || parseFloat(power) <= 0) {
        errors.push("Power rating must be a positive number");
    }

    // Validate quantity
    if (!quantity || parseFloat(quantity) <= 0) {
        errors.push("Quantity must be a positive number");
    }

    // Validate daily usage
    if (!hours || parseFloat(hours) <= 0) {
        errors.push("Daily usage must be a positive number");
    } else if (parseFloat(hours) > 24) {
        errors.push("Daily usage cannot exceed 24 hours");
    }

    return errors;
}

function addAppliance() {
    const nameInput = document.getElementById('appliance-name');
    const powerInput = document.getElementById('power-rating');
    const quantityInput = document.getElementById('quantity');
    const hoursInput = document.getElementById('daily-usage');

    const name = nameInput.value.trim();
    const power = powerInput.value;
    const quantity = quantityInput.value;
    const hours = hoursInput.value;

    // Validate inputs
    const errors = validateInput(name, power, quantity, hours);

    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return;
    }

    // Calculate energy consumption (kWh)
    const energy = ((parseFloat(power) / 1000) * parseFloat(hours)) * parseFloat(quantity);

    // Create appliance object
    const appliance = {
        id: Date.now(),
        name: name,
        power: parseFloat(power),
        quantity: parseFloat(quantity),
        hours: parseFloat(hours),
        energy: energy
    };

    // Add to list
    appliances.push(appliance);

    // Update table with animation
    updateAppliancesTable();

    // Show success notification
    showNotification(`"${name}" added successfully!`, 'success');

    // Clear form
    if (nameInput) nameInput.value = '';
    if (powerInput) powerInput.value = '';
    if (quantityInput) quantityInput.value = '';
    if (hoursInput) hoursInput.value = '';

    // Focus first field
    setTimeout(() => {
        if (nameInput) nameInput.focus();
    }, 100);
}

function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(note => note.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-md ${
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'success' ? 'bg-green-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100px)';
    notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

function updateAppliancesTable() {
    const tbody = document.getElementById('appliances-body');

    // Clear existing content
    if (tbody) {
        tbody.innerHTML = '';
    }

    // Hide placeholder if there are appliances
    const placeholder = document.getElementById('no-appliances-placeholder');
    if (placeholder) {
        if (appliances.length > 0) {
            placeholder.style.display = 'none';
        } else {
            placeholder.style.display = 'block';
        }
    }

    // Add appliances with animation
    appliances.forEach((appliance, index) => {
        if (tbody) {
            const row = document.createElement('tr');
            row.className = 'border-b border-white/10 hover:bg-white/10 transition-all duration-200';
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';

            row.innerHTML = `
                <td class="py-3 px-4">${appliance.name}</td>
                <td class="py-3 px-4">${appliance.power}</td>
                <td class="py-3 px-4">${appliance.quantity}</td>
                <td class="py-3 px-4">${appliance.hours}</td>
                <td class="py-3 px-4 font-bold text-yellow-400">${appliance.energy.toFixed(2)}</td>
                <td class="py-3 px-4">
                    <button class="delete-btn bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors duration-200" onclick="deleteAppliance(${appliance.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

            tbody.appendChild(row);

            // Trigger animation
            setTimeout(() => {
                row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, 10 + (index * 50)); // Stagger the animations
        }
    });
}

function deleteAppliance(id) {
    const appliance = appliances.find(a => a.id === id);
    if (appliance) {
        appliances = appliances.filter(a => a.id !== id);
        updateAppliancesTable();
        showNotification(`"${appliance.name}" deleted successfully!`, 'success');
    }
}

function analyzeData() {
    if (appliances.length === 0) {
        showNotification("Please add at least one appliance before analyzing.", 'error');
        return;
    }

    // Calculate statistics
    const totalEnergy = appliances.reduce((sum, app) => sum + app.energy, 0);
    const maxEnergyAppliance = appliances.reduce((max, app) => app.energy > max.energy ? app : max);
    const minEnergyAppliance = appliances.reduce((min, app) => app.energy < min.energy ? app : min);
    const avgEnergy = totalEnergy / appliances.length;

    // Show loading effect
    const summaryDiv = document.getElementById('summary-results');
    if (summaryDiv) {
        summaryDiv.innerHTML = '<div class="text-center py-12 text-blue-200"><p class="text-lg">Analyzing data...</p><div class="mt-4"><i class="fas fa-spinner fa-spin text-2xl"></i></div></div>';
    }

    // Delay for animation
    setTimeout(() => {
        // Update summary
        updateSummary(totalEnergy, maxEnergyAppliance, minEnergyAppliance, avgEnergy);

        // Update chart
        updateChart(maxEnergyAppliance, minEnergyAppliance);
    }, 800);
}

function updateSummary(totalEnergy, maxEnergyAppliance, minEnergyAppliance, avgEnergy) {
    const summaryDiv = document.getElementById('summary-results');

    if (summaryDiv) {
        summaryDiv.innerHTML = `
            <div class="space-y-4 animate-fadeIn">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-4 rounded-xl border border-blue-400/30 animate-slideInLeft">
                        <h3 class="text-blue-200 font-semibold mb-1">Total Energy</h3>
                        <p class="text-2xl font-bold text-white">${totalEnergy.toFixed(2)} kWh</p>
                    </div>
                    <div class="bg-gradient-to-r from-green-500/20 to-green-600/20 p-4 rounded-xl border border-green-400/30 animate-slideInRight">
                        <h3 class="text-green-200 font-semibold mb-1">Avg Energy</h3>
                        <p class="text-2xl font-bold text-white">${avgEnergy.toFixed(2)} kWh</p>
                    </div>
                </div>

                <div class="bg-gradient-to-r from-red-500/20 to-red-600/20 p-4 rounded-xl border border-red-400/30 animate-slideInUp">
                    <h3 class="text-red-200 font-semibold mb-1">Highest Consumer</h3>
                    <p class="text-lg font-bold text-white">${maxEnergyAppliance.name}</p>
                    <p class="text-red-300">${maxEnergyAppliance.energy.toFixed(2)} kWh</p>
                </div>

                <div class="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 p-4 rounded-xl border border-emerald-400/30 animate-slideInUp">
                    <h3 class="text-emerald-200 font-semibold mb-1">Lowest Consumer</h3>
                    <p class="text-lg font-bold text-white">${minEnergyAppliance.name}</p>
                    <p class="text-emerald-300">${minEnergyAppliance.energy.toFixed(2)} kWh</p>
                </div>
            </div>
        `;
    }
}

function updateChart(maxApp, minApp) {
    const ctx = document.getElementById('energy-chart');
    if (!ctx) return;

    const chartCtx = ctx.getContext('2d');

    // Destroy existing chart if it exists
    if (chart) {
        chart.destroy();
    }

    const names = appliances.map(app => app.name);
    const energies = appliances.map(app => app.energy);

    // Create colors: highlight max and min
    const colors = appliances.map(app => {
        if (app.id === maxApp.id) {
            return '#EF4444'; // Red for max
        } else if (app.id === minApp.id) {
            return '#10B981'; // Green for min
        } else {
            return '#3B82F6'; // Blue for others
        }
    });

    const borderColors = appliances.map(app => {
        if (app.id === maxApp.id) {
            return '#DC2626';
        } else if (app.id === minApp.id) {
            return '#059669';
        } else {
            return '#2563EB';
        }
    });

    chart = new Chart(chartCtx, {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                label: 'Energy Consumption (kWh/day)',
                data: energies,
                backgroundColor: colors,
                borderColor: borderColors,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    titleColor: '#F8FAFC',
                    bodyColor: '#F8FAFC',
                    borderColor: '#3B82F6',
                    borderWidth: 1,
                    padding: 12,
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
                        display: true,
                        text: 'Energy Consumption (kWh)',
                        color: '#ffffff',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Appliances',
                        color: '#ffffff',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
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
    if (confirm("Are you sure you want to clear all appliances? This action cannot be undone.")) {
        // Add animation to clearing process
        const sections = document.querySelectorAll('[id$="-animation-target"]');
        sections.forEach(section => {
            section.style.transition = 'all 0.3s ease';
            section.style.opacity = '0.5';
            section.style.transform = 'scale(0.98)';
        });

        setTimeout(() => {
            appliances = [];
            updateAppliancesTable();

            // Clear summary
            const summaryDiv = document.getElementById('summary-results');
            if (summaryDiv) {
                summaryDiv.innerHTML = `
                    <div class="text-center py-12 text-blue-200 animate-fadeIn">
                        <i class="fas fa-network-wired text-4xl mb-4"></i>
                        <p>Add appliances and click "Analyze" to see comprehensive energy insights</p>
                    </div>
                `;
            }

            // Clear chart
            if (chart) {
                chart.destroy();
                chart = null;
            }

            // Reset animations
            sections.forEach(section => {
                section.style.opacity = '1';
                section.style.transform = 'scale(1)';
            });

            showNotification("All appliances cleared successfully!", 'success');
        }, 300);
    }
}