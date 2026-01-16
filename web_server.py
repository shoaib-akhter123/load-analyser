import http.server
import socketserver
import webbrowser
import os

PORT = 8000
DIRECTORY = "C:\\Windows\\system32\\PROJECT _2 _LOAD_ANALYZER"

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def main():
    print(f"Serving Home Load Analyzer web app at http://localhost:{PORT}")
    print(f"Directory: {DIRECTORY}")
    print("Press Ctrl+C to stop the server")

    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        # Open the web browser
        webbrowser.open(f"http://localhost:{PORT}/index.html")
        print(f"Opening web browser...")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == "__main__":
    main()