import requests
import json

# URL endpoint login
url = "http://localhost:8000/api/auth/login"

# Data login
payload = {
    "email": "admin@eventnow.com",
    "password": "admin123"
}

# Header
headers = {
    "Content-Type": "application/json"
}

try:
    # Kirim request POST
    response = requests.post(url, json=payload, headers=headers)
    
    # Tampilkan response
    print("Status Code:", response.status_code)
    print("Response:", response.json())
    
except requests.exceptions.RequestException as e:
    print("Error:", e)
