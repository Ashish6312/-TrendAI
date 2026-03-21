from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import os
from typing import Optional, Dict, Any

# Initialize FastAPI app
app = FastAPI(title="TrendAI Business Intelligence API", version="2.3")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class UserSync(BaseModel):
    email: str
    name: Optional[str] = None
    image_url: Optional[str] = None

class LoginSession(BaseModel):
    user_email: str
    session_token: str
    provider: str = "google"
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    device_info: Optional[Dict] = None
    location_info: Optional[Dict] = None
    login_method: str = "oauth"

@app.get("/")
async def root():
    return {
        "status": "online", 
        "message": "TrendAI Business Intelligence API is active", 
        "version": "2.3",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "environment": {
            "database_url": bool(os.getenv("DATABASE_URL")),
            "pollination_key": bool(os.getenv("POLLINATION_API_KEY")),
            "serpapi_key": bool(os.getenv("SERPAPI_API_KEY")),
            "gemini_key": bool(os.getenv("GEMINI_API_KEY"))
        }
    }

@app.get("/api/health")
async def api_health():
    return {"status": "ok", "timestamp": str(datetime.now())}

# Handle favicon.ico
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    from fastapi.responses import Response
    return Response(status_code=204)

# User endpoints that frontend is calling
@app.post("/api/users/sync")
async def sync_user(user_data: UserSync):
    return {
        "status": "ok", 
        "message": "User sync successful",
        "user_id": 1,
        "email": user_data.email,
        "name": user_data.name
    }

@app.get("/api/users/{email}")
async def get_user_info(email: str):
    return {
        "id": 1,
        "email": email,
        "name": "Test User",
        "bio": None,
        "phone": None,
        "image_url": None,
        "company": None,
        "location": None,
        "website": None,
        "industry": None,
        "auth_provider": "google",
        "login_count": 1,
        "last_login": datetime.now().isoformat(),
        "created_at": datetime.now().isoformat()
    }

@app.get("/api/users/{email}/profile")
async def get_user_profile(email: str):
    return {
        "user": {
            "id": 1,
            "email": email,
            "name": "Test User",
            "bio": None,
            "phone": None,
            "image_url": None,
            "company": None,
            "location": None,
            "website": None,
            "industry": None,
            "auth_provider": "google",
            "login_count": 1,
            "last_login": datetime.now().isoformat(),
            "created_at": datetime.now().isoformat()
        },
        "analysis_count": 0,
        "subscription": {
            "id": 0,
            "user_email": email,
            "plan_name": "free",
            "plan_display_name": "Venture Strategist",
            "status": "active",
            "max_analyses": 5,
            "features": {}
        },
        "recent_payments": []
    }

@app.get("/api/users/{email}/location")
async def get_user_location(email: str):
    return {
        "location": None,
        "has_location": False
    }

@app.get("/api/subscriptions/{email}")
async def get_user_subscription(email: str):
    return {
        "id": 0,
        "user_email": email,
        "plan_name": "free",
        "plan_display_name": "Venture Strategist",
        "status": "active",
        "max_analyses": 5,
        "features": {},
        "billing_cycle": "monthly",
        "price": 0.0,
        "currency": "USD"
    }

@app.post("/api/users/login-session")
async def create_login_session(session: LoginSession):
    return {
        "status": "ok", 
        "session_id": 1, 
        "message": "Login session created successfully"
    }

@app.get("/api/history/{email}")
async def get_history(email: str):
    return []

@app.get("/api/deployment/test")
async def deployment_test():
    return {
        "status": "success",
        "message": "Deployment test successful",
        "version": "2.3",
        "timestamp": datetime.now().isoformat(),
        "minimal_mode": True
    }

# Auth endpoints
@app.post("/api/auth/signup")
async def sign_up():
    return {
        "id": 1,
        "email": "test@example.com",
        "name": "Test User",
        "image_url": None,
        "message": "Signup endpoint working (minimal mode)"
    }

@app.post("/api/auth/signin")
async def sign_in():
    return {
        "id": 1,
        "email": "test@example.com", 
        "name": "Test User",
        "image_url": None,
        "message": "Signin endpoint working (minimal mode)"
    }

# Vercel handler
handler = app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)