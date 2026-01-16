import http.server
import socketserver
import os
from functools import partial

# Change to the project directory
os.chdir("C:/Windows/system32/PROJECT _2 _LOAD_ANALYZER")

PORT = 8080
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Professional Home Load Analyzer running at http://localhost:{PORT}")
    print("Features:")
    print("   - Responsive design for all devices")
    print("   - Real-time energy calculations")
    print("   - Professional dashboard with analytics")
    print("   - Interactive charts and visualizations")
    print("   - Modern glass-morphism UI")
    print("   - Smooth animations and transitions")
    print("\nAccess the application at: http://localhost:8080")
    print("Press Ctrl+C to stop the server")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nServer stopped. Goodbye!")