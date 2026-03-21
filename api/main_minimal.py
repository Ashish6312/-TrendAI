from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import os

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

# Test endpoints that frontend is calling
@app.post("/api/users/sync")
async def sync_user():
    return {"status": "ok", "message": "User sync endpoint working"}

@app.get("/api/users/{email}")
async def get_user_info(email: str):
    return {
        "id": 1,
        "email": email,
        "name": "Test User",
        "image_url": None,
        "message": "User endpoint working"
    }

@app.get("/api/users/{email}/profile")
async def get_user_profile(email: str):
    return {
        "user": {
            "id": 1,
            "email": email,
            "name": "Test User"
        },
        "analysis_count": 0,
        "subscription": None,
        "recent_payments": [],
        "message": "Profile endpoint working"
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
        "message": "Subscription endpoint working"
    }

@app.post("/api/users/login-session")
async def create_login_session():
    return {"status": "ok", "session_id": 1, "message": "Login session endpoint working"}

@app.get("/api/deployment/test")
async def deployment_test():
    return {
        "status": "success",
        "message": "Deployment test successful",
        "version": "2.3",
        "timestamp": datetime.now().isoformat(),
        "minimal_mode": True
    }

# Vercel handler
handler = app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)