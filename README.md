# Professional Home Load Analyzer

A sophisticated energy consumption analysis system for calculating and analyzing home appliance energy consumption. Features both desktop and web versions with professional UI/UX!

## Features

- **Professional UI/UX**: Modern, sleek interface with glass-morphism effects and smooth animations
- **Easy Input**: Add appliances with name, power rating (W), quantity, and daily usage (hours)
- **Real-time Validation**: Ensures all inputs are valid and meaningful
- **Comprehensive Analysis**: Shows total, max, min, and average energy consumption
- **Visual Charts**: Interactive bar chart visualization of energy consumption by appliance
- **Color-coded Results**: Highlights highest and lowest energy-consuming appliances
- **Data Management**: Add, clear, and review all appliances
- **Advanced Animations**: Professional transitions and micro-interactions

## Project Structure

```
PROJECT _2 _LOAD_ANALYZER/
├── index.html              # Main web application (HTML/CSS/JS version)
├── styles.css             # Professional styling with animations
├── script.js              # JavaScript functionality with advanced features
├── main.py                # Original command-line version
├── home_load_analyzer_app.py  # Desktop GUI version (Python/Tkinter)
├── web_server.py          # Python web server for local hosting
├── README.md              # Project documentation
├── requirements.txt       # Python dependencies
└── .gitignore            # Files to exclude from Git
```

## Versions Available

### Web Version (HTML/CSS/JavaScript) - **RECOMMENDED**
**Features:**
- Professional Tailwind-inspired styling
- Advanced animations and transitions
- Responsive design for all devices
- Modern UI/UX with glass-morphism effects
- Enter key navigation between fields
- Real-time validation with notifications

**Requirements:**
- Modern web browser (Chrome, Firefox, Safari, Edge)

**Usage:**
1. Open `index.html` in your web browser
2. Or serve the files through a local web server

### Desktop Version (Python/Tkinter)
**Requirements:**
- Python 3.6 or higher
- Required packages:
  - tkinter (usually comes with Python)
  - matplotlib
  - numpy (included with matplotlib)

**Installation:**
1. Install required packages:
   ```
   pip install matplotlib
   ```

2. Run the application:
   ```
   python home_load_analyzer_app.py
   ```

## Usage

### Web Version (Primary):
1. Open `index.html` in your web browser
2. Enter appliance details in the input fields
3. Press Enter to navigate between fields efficiently
4. Click "Add Appliance" to add the appliance to the list
5. Repeat until all appliances are added
6. Click "Analyze" to see comprehensive results and visualizations
7. Use "Clear" to reset the application

### Desktop Version:
1. Enter appliance details in the input fields:
   - Appliance Name: Name of the appliance
   - Power Rating: Power consumption in watts
   - Quantity: Number of appliances of this type
   - Daily Usage: Hours the appliance runs per day

2. Click "Add Appliance" or press Enter to add the appliance to the list

3. Repeat until all appliances are added

4. Click "Finish & Analyze" to see:
   - Summary statistics (total, max, min, average energy)
   - Visual chart of energy consumption
   - Color-coded identification of highest/lowest consumers

5. Use "Clear All" to start over with a new analysis

## Key Improvements

- **Professional UI/UX**: Modern design with glass-morphism, animations, and smooth transitions
- **Enhanced User Experience**: Enter-key navigation, real-time feedback, and polished interactions
- **Advanced Visualizations**: Interactive charts with color-coded results
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Performance Optimized**: Efficient code structure and smooth animations
- **Industry Standard**: Professional appearance suitable for engineering applications

## Input Validation

- Appliance name must not be empty
- Power, quantity, and daily usage must be positive numbers
- Daily usage cannot exceed 24 hours
- All numeric inputs must be valid numbers

## Notes

- All applications save data only during the session
- Maximum energy-consuming appliances are highlighted in red
- Minimum energy-consuming appliances are highlighted in green
- The chart automatically updates when you click "Analyze"
- The web version is recommended for its professional appearance and advanced features