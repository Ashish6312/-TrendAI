import requests
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

print(f"Testing Gemini Key: {api_key[:10]}...")

models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"]
versions = ["v1", "v1beta"]

for v in versions:
    print(f"\n--- Checking {v} ---")
    for m in models:
        url = f"https://generativelanguage.googleapis.com/{v}/models/{m}:generateContent?key={api_key}"
        payload = {"contents": [{"parts": [{"text": "Say hello world"}]}]}
        try:
            r = requests.post(url, json=payload, timeout=10)
            if r.status_code == 200:
                print(f"✅ {m} is AVAILABLE on {v}")
            else:
                print(f"❌ {m} failing on {v}: {r.status_code} - {r.text[:100]}")
        except Exception as e:
            print(f"⚠️ {m} error on {v}: {str(e)}")
