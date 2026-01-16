import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import numpy as np
import re

class HomeLoadAnalyzerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Home Load Analyzer")
        self.root.geometry("1000x800")
        self.root.configure(bg='#f0f0f0')

        # Initialize appliances list
        self.appliances = []

        # Create the main frame
        self.main_frame = ttk.Frame(root, padding="10")
        self.main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))

        # Configure grid weights for responsive design
        root.columnconfigure(0, weight=1)
        root.rowconfigure(0, weight=1)
        self.main_frame.columnconfigure(1, weight=1)

        self.create_widgets()

    def create_widgets(self):
        # Title
        title_label = ttk.Label(self.main_frame, text="🏠 Home Load Analyzer",
                               font=('Arial', 18, 'bold'))
        title_label.grid(row=0, column=0, columnspan=3, pady=(0, 20))

        # Input frame
        input_frame = ttk.LabelFrame(self.main_frame, text="Add New Appliance", padding="10")
        input_frame.grid(row=1, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 20))
        input_frame.columnconfigure(1, weight=1)

        # Appliance name
        ttk.Label(input_frame, text="Appliance Name:").grid(row=0, column=0, sticky=tk.W, padx=(0, 5))
        self.name_var = tk.StringVar()
        self.name_entry = ttk.Entry(input_frame, textvariable=self.name_var, width=20)
        self.name_entry.grid(row=0, column=1, sticky=(tk.W, tk.E), padx=(0, 10))

        # Power rating
        ttk.Label(input_frame, text="Power Rating (Watts):").grid(row=0, column=2, sticky=tk.W, padx=(0, 5))
        self.power_var = tk.StringVar()
        self.power_entry = ttk.Entry(input_frame, textvariable=self.power_var, width=15)
        self.power_entry.grid(row=0, column=3, sticky=(tk.W, tk.E), padx=(0, 10))

        # Quantity
        ttk.Label(input_frame, text="Quantity:").grid(row=0, column=4, sticky=tk.W, padx=(0, 5))
        self.quantity_var = tk.StringVar()
        self.quantity_entry = ttk.Entry(input_frame, textvariable=self.quantity_var, width=10)
        self.quantity_entry.grid(row=0, column=5, sticky=(tk.W, tk.E), padx=(0, 10))

        # Daily usage
        ttk.Label(input_frame, text="Daily Usage (Hours):").grid(row=0, column=6, sticky=tk.W, padx=(0, 5))
        self.hours_var = tk.StringVar()
        self.hours_entry = ttk.Entry(input_frame, textvariable=self.hours_var, width=10)
        self.hours_entry.grid(row=0, column=7, sticky=(tk.W, tk.E))

        # Buttons frame
        button_frame = ttk.Frame(self.main_frame)
        button_frame.grid(row=2, column=0, columnspan=3, pady=(0, 20))

        self.add_button = ttk.Button(button_frame, text="➕ Add Appliance", command=self.add_appliance)
        self.add_button.pack(side=tk.LEFT, padx=(0, 10))

        self.finish_button = ttk.Button(button_frame, text="✅ Finish & Analyze", command=self.analyze_data)
        self.finish_button.pack(side=tk.LEFT, padx=(0, 10))

        self.clear_button = ttk.Button(button_frame, text="🗑️ Clear All", command=self.clear_all)
        self.clear_button.pack(side=tk.LEFT)

        # Appliances list frame
        list_frame = ttk.LabelFrame(self.main_frame, text="Added Appliances", padding="10")
        list_frame.grid(row=3, column=0, columnspan=3, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(0, 20))
        list_frame.columnconfigure(0, weight=1)
        list_frame.rowconfigure(0, weight=1)
        self.main_frame.rowconfigure(3, weight=1)

        # Create treeview for appliances
        columns = ('Name', 'Power (W)', 'Quantity', 'Hours', 'Energy (kWh)')
        self.tree = ttk.Treeview(list_frame, columns=columns, show='headings', height=8)

        # Define headings
        for col in columns:
            self.tree.heading(col, text=col)
            self.tree.column(col, width=120, anchor=tk.CENTER)

        # Scrollbars
        scrollbar_y = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, command=self.tree.yview)
        scrollbar_x = ttk.Scrollbar(list_frame, orient=tk.HORIZONTAL, command=self.tree.xview)
        self.tree.configure(yscrollcommand=scrollbar_y.set, xscrollcommand=scrollbar_x.set)

        # Grid the treeview and scrollbars
        self.tree.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        scrollbar_y.grid(row=0, column=1, sticky=(tk.N, tk.S))
        scrollbar_x.grid(row=1, column=0, sticky=(tk.W, tk.E))

        # Summary frame
        self.summary_frame = ttk.LabelFrame(self.main_frame, text="📊 Analysis Results", padding="10")
        self.summary_frame.grid(row=4, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 20))
        self.summary_frame.columnconfigure(0, weight=1)

        # Summary text widget
        self.summary_text = scrolledtext.ScrolledText(self.summary_frame, height=8, width=80, wrap=tk.WORD)
        self.summary_text.grid(row=0, column=0, sticky=(tk.W, tk.E))

        # Chart frame
        self.chart_frame = ttk.LabelFrame(self.main_frame, text="📈 Energy Consumption Chart", padding="10")
        self.chart_frame.grid(row=5, column=0, columnspan=3, sticky=(tk.W, tk.E, tk.N, tk.S))
        self.chart_frame.columnconfigure(0, weight=1)
        self.chart_frame.rowconfigure(0, weight=1)
        self.main_frame.rowconfigure(5, weight=2)

        # Create matplotlib figure
        self.fig, self.ax = plt.subplots(figsize=(10, 4))
        self.canvas = FigureCanvasTkAgg(self.fig, master=self.chart_frame)
        self.canvas.get_tk_widget().grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))

        # Bind Enter key to add appliance
        self.name_entry.bind('<Return>', lambda event: self.add_appliance())
        self.power_entry.bind('<Return>', lambda event: self.add_appliance())
        self.quantity_entry.bind('<Return>', lambda event: self.add_appliance())
        self.hours_entry.bind('<Return>', lambda event: self.add_appliance())

    def validate_input(self, name, power, quantity, hours):
        """Validate user input"""
        errors = []

        # Validate appliance name
        if not name.strip():
            errors.append("Appliance name cannot be empty")
        elif len(name.strip()) > 50:
            errors.append("Appliance name is too long (max 50 characters)")

        # Validate power rating
        try:
            power_val = float(power)
            if power_val <= 0:
                errors.append("Power rating must be a positive number")
        except ValueError:
            errors.append("Power rating must be a valid number")

        # Validate quantity
        try:
            qty_val = float(quantity)
            if qty_val <= 0:
                errors.append("Quantity must be a positive number")
        except ValueError:
            errors.append("Quantity must be a valid number")

        # Validate daily usage
        try:
            hours_val = float(hours)
            if hours_val <= 0:
                errors.append("Daily usage must be a positive number")
            elif hours_val > 24:
                errors.append("Daily usage cannot exceed 24 hours")
        except ValueError:
            errors.append("Daily usage must be a valid number")

        return errors

    def add_appliance(self):
        """Add appliance to the list after validation"""
        name = self.name_var.get().strip()
        power = self.power_var.get().strip()
        quantity = self.quantity_var.get().strip()
        hours = self.hours_var.get().strip()

        # Validate inputs
        errors = self.validate_input(name, power, quantity, hours)

        if errors:
            messagebox.showerror("Input Error", "\n".join(errors))
            return

        # Convert to appropriate types
        power_val = float(power)
        quantity_val = float(quantity)
        hours_val = float(hours)

        # Calculate energy consumption (kWh)
        energy = ((power_val / 1000) * hours_val) * quantity_val

        # Create appliance dictionary
        appliance = {
            "name": name,
            "power": power_val,
            "quantity": quantity_val,
            "hours": hours_val,
            "energy": energy
        }

        # Add to list
        self.appliances.append(appliance)

        # Add to treeview
        self.tree.insert('', 'end', values=(
            appliance['name'],
            appliance['power'],
            appliance['quantity'],
            appliance['hours'],
            f"{appliance['energy']:.2f}"
        ))

        # Clear input fields
        self.name_var.set('')
        self.power_var.set('')
        self.quantity_var.set('')
        self.hours_var.set('')

        # Focus back on name field
        self.name_entry.focus()

    def clear_all(self):
        """Clear all appliances and reset the app"""
        self.appliances.clear()
        for item in self.tree.get_children():
            self.tree.delete(item)
        self.summary_text.delete(1.0, tk.END)
        self.ax.clear()
        self.canvas.draw()

    def analyze_data(self):
        """Analyze the collected data and display results"""
        if not self.appliances:
            messagebox.showwarning("No Data", "Please add at least one appliance before analyzing.")
            return

        # Calculate statistics
        total_energy = sum(app['energy'] for app in self.appliances)

        # Find max and min energy consumers
        max_energy_appliance = max(self.appliances, key=lambda x: x['energy'])
        min_energy_appliance = min(self.appliances, key=lambda x: x['energy'])

        avg_energy = total_energy / len(self.appliances) if self.appliances else 0

        # Prepare summary text
        summary = f"""
📊 ANALYSIS RESULTS
=====================

Total Energy Consumed: {total_energy:.2f} kWh/day

Most Energy-Consuming Appliance:
  • {max_energy_appliance['name']} ({max_energy_appliance['energy']:.2f} kWh/day)

Least Energy-Consuming Appliance:
  • {min_energy_appliance['name']} ({min_energy_appliance['energy']:.2f} kWh/day)

Average Energy per Appliance: {avg_energy:.2f} kWh/day

Number of Appliances: {len(self.appliances)}
        """.strip()

        # Update summary text
        self.summary_text.delete(1.0, tk.END)
        self.summary_text.insert(tk.END, summary)

        # Create visualization
        self.create_visualization(max_energy_appliance, min_energy_appliance)

    def create_visualization(self, max_app, min_app):
        """Create a bar chart visualization of energy consumption"""
        self.ax.clear()

        if not self.appliances:
            self.ax.text(0.5, 0.5, 'No data to display', horizontalalignment='center',
                        verticalalignment='center', transform=self.ax.transAxes, fontsize=14)
            self.ax.set_xlim(0, 1)
            self.ax.set_ylim(0, 1)
            self.canvas.draw()
            return

        # Extract data for plotting
        names = [app['name'] for app in self.appliances]
        energies = [app['energy'] for app in self.appliances]

        # Create colors: highlight max and min
        colors = []
        for app in self.appliances:
            if app == max_app:
                colors.append('#FF6B6B')  # Red for max
            elif app == min_app:
                colors.append('#4ECDC4')  # Teal for min
            else:
                colors.append('#45B7D1')  # Blue for others

        # Create bar chart
        bars = self.ax.bar(names, energies, color=colors)

        # Add value labels on bars
        for bar, energy in zip(bars, energies):
            height = bar.get_height()
            self.ax.text(bar.get_x() + bar.get_width()/2., height,
                        f'{energy:.2f}',
                        ha='center', va='bottom', fontsize=9)

        # Rotate x-axis labels for better readability
        self.ax.tick_params(axis='x', rotation=45, labelsize=8)
        self.ax.set_ylabel('Energy Consumption (kWh/day)')
        self.ax.set_title('Energy Consumption by Appliance', fontsize=14, fontweight='bold')

        # Adjust layout to prevent label cutoff
        self.fig.tight_layout()

        # Draw the canvas
        self.canvas.draw()

def main():
    root = tk.Tk()
    app = HomeLoadAnalyzerApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()