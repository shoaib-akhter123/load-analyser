"""
Home Load Analyzer - Enhanced Version Available

This is the original command-line version of the Home Load Analyzer.
For a more user-friendly experience with GUI, data visualization, and improved features,
please use the enhanced application:

Run: python home_load_analyzer_app.py

Features of the enhanced version:
- Graphical user interface
- Real-time data validation
- Visual charts and graphs
- Color-coded analysis results
- Easy appliance management
"""

print("\t-------------------------------------Home Load Analyzer-------------------------------------------- \n"
 "\t-------------------------Enter appliance details to calculate power consumption--------------------")
print("\n⚠️  This is the original command-line version.")
print("💡 For a better experience, run: python home_load_analyzer_app.py\n")

applainces=[]
user_op= "YES"
while(user_op =="YES"):
             app_name = input(" Enter Applaince Name ")
             app_power=float(input(" Enter Power Rating in WATTS  of Applaince  :    "))
             app_quntity=float(input(" Enter Applaince Quantity  :   "))
             app_daily_usage=float(input("Enter hours That Daily Applaince Works  :   "))
             daily_energy =( ((app_power)/(1000))*app_daily_usage)*(app_quntity)
             applaince = {
              "name":app_name,
              "power":app_power,
              "quantity":app_quntity,
              "hours":app_daily_usage,
              "energy":daily_energy
             }
             applainces.append(applaince)
             user_op=input(" Add Another Applaince ? (yes/no)").upper()
max_energy = applainces[0]["energy"]
min_energy = applainces[0]["energy"]
max_name = applainces[0]["name"]
min_name = applainces[0]["name"]
for applaince in applainces:
    current_energy =applaince["energy"]
    current_name =applaince["name"]
    if(current_energy > max_energy):
                 max_energy = current_energy
                 max_name = current_name
    else:
        pass
    if(current_energy < min_energy):
                 min_energy =current_energy
                 min_name=current_name
    else:
        pass
total_energy=0
for applaince in applainces:
    total_energy += applaince["energy"]
print("maximum energy is consumed by :",max_name,":",max_energy," KWH")
print("minimum energy is consumed by :",min_name,":",min_energy," KWH")
print("so total energy consumped by whole home appliances :",total_energy," units")
     

    
        

                              
        
