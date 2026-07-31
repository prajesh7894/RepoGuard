import httpx, os, asyncio, json
from dotenv import load_dotenv

load_dotenv('../.env')

async def main():
    api_key = os.environ.get('GEMINI_API_KEY')
    payload = {
        "contents": [{
            "role": "user",
            "parts": [{"text": "Hello"}]
        }]
    }
    async with httpx.AsyncClient() as client:
        r = await client.get(f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}")
        data = r.json()
        models = [m['name'] for m in data.get('models', []) if 'generateContent' in m.get('supportedGenerationMethods', [])]
        for name in models:
            resp = await client.post(f"https://generativelanguage.googleapis.com/v1beta/{name}:generateContent?key={api_key}", json=payload)
            print(f"{name}: {resp.status_code}")

asyncio.run(main())
