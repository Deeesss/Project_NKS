from http.server import HTTPServer, SimpleHTTPRequestHandler

# Nastavte hostiteľskú IP adresu a port, na ktorom má server bežať
host_ip = '192.168.30.100'
port = 8000

# Vytvorenie HTTP serveru
httpd = HTTPServer((host_ip, port), SimpleHTTPRequestHandler)

print(f"Server beží na http://{host_ip}:{port}")

# Spustenie servera, bude bežať kým ho ručne nezastavíte
httpd.serve_forever()