import http.server
import socketserver
import webbrowser
import os

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Servidor rodando em http://localhost:{PORT}")
    webbrowser.open(f'http://localhost:{PORT}/index.html')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor encerrado.")
        httpd.shutdown()
