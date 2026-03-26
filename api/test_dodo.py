import os
import httpx
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("DODO_PAYMENTS_API_KEY")
print(f"API Key: {api_key[:10]}...")

url = "https://test.dodopayments.com/checkouts"
if api_key.startswith("dp_live"):
    url = "https://live.dodopayments.com/checkouts"

payload = {
    "product_cart": [{"product_id": "prod_starter", "quantity": 1}],
    "customer": {"email": "test@example.com", "name": "Test User"},
    "return_url": "http://localhost:3000/acquisition-tiers"
}

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}"
}

try:
    response = httpx.post(url, json=payload, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")