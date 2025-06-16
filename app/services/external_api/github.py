import os
import httpx
from dotenv import load_dotenv

load_dotenv()

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_USER_URL = "https://api.github.com/user"

async def get_github_user(code: str):
    params ={
        "client_id": GITHUB_CLIENT_ID,
        "client_secret": GITHUB_CLIENT_SECRET,
        'code': code,
    }
    headers = {
        "Accept": "application/json",
    }
    
    async with httpx.AsyncClient() as client:
        token = await client.post(
            GITHUB_TOKEN_URL,
            params=params,
            headers=headers
        )
        
        data = token.json()
        access_token = data.get("access_token")
        
        user_response = await client.get(
            GITHUB_USER_URL,
            headers={"Authorization": f"Bearer {access_token}"}
        )
    
    return user_response.json()