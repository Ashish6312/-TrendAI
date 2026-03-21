from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timedelta
import os
import traceback
import logging
import bcrypt
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="TrendAI Business Intelligence API", version="2.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for optional imports
db_available = False
models_available = False
recommendations_available = False
integrated_intelligence = None

# Try to import database components
try:
    from database import get_db, init_database, check_db_connection
    init_database()
    db_status = check_db_connection()
    db_available = db_status
    logger.info(f"✅ Database connection: {'SUCCESS' if db_status else 'FAILED'}")
except Exception as e:
    logger.error(f"⚠️ Database initialization failed: {e}")
    db_available = False

# Try to import models
try:
    import models
    models_available = True
    logger.info("✅ Models imported successfully")
except Exception as e:
    logger.error(f"⚠️ Models import failed: {e}")
    models_available = False

# Try to import recommendation engines
try:
    from simple_recommendations import generate_dynamic_recommendations, generate_ai_business_plan, generate_ai_roadmap
    recommendations_available = True
    logger.info("✅ Simple recommendations imported successfully")
except Exception as e:
    logger.error(f"⚠️ Simple recommendations import failed: {e}")
    recommendations_available = False

# Try to import integrated intelligence
try:
    from integrated_business_intelligence import integrated_intelligence
    logger.info("✅ Integrated intelligence imported successfully")
except Exception as e:
    logger.error(f"⚠️ Integrated intelligence import failed: {e}")
    integrated_intelligence = None

# Pydantic models
class UserSignUp(BaseModel):
    email: str
    name: str
    password: str

class UserSignIn(BaseModel):
    email: str
    password: str

class RecommendationRequest(BaseModel):
    area: str
    user_email: str
    language: str = "English"
    phase: str = "discovery"

class BusinessPlanRequest(BaseModel):
    business_title: str
    area: str
    language: str = "English"

class RoadmapRequest(BaseModel):
    title: str
    area: str
    language: str = "English"

# Database dependency
def get_db_session():
    """Get database session with error handling"""
    if not db_available:
        raise HTTPException(status_code=503, detail="Database not available")
    try:
        from database import SessionLocal
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Database session error: {e}")
        raise HTTPException(status_code=503, detail="Database connection failed")

# Authentication endpoints
@app.post("/api/auth/signup")
def sign_up(user_data: UserSignUp, db: Session = Depends(get_db_session)):
    try:
        if not models_available:
            raise HTTPException(status_code=503, detail="User management not available")
        
        # Check if user exists
        existing_user = db.query(models.User).filter(models.User.email == user_data.email.lower()).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")
        
        # Hash password
        password_hash = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create user
        new_user = models.User(
            email=user_data.email.lower(),
            name=user_data.name,
            password_hash=password_hash,
            auth_provider="email",
            email_verified=False,
            created_at=datetime.now()
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return {
            "message": "User created successfully",
            "user": {
                "email": new_user.email,
                "name": new_user.name,
                "created_at": new_user.created_at.isoformat()
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Signup error: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/auth/signin")
def sign_in(user_data: UserSignIn, db: Session = Depends(get_db_session)):
    try:
        if not models_available:
            raise HTTPException(status_code=503, detail="User management not available")
        
        # Find user
        user = db.query(models.User).filter(models.User.email == user_data.email.lower()).first()
        if not user or not user.password_hash:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Verify password
        if not bcrypt.checkpw(user_data.password.encode('utf-8'), user.password_hash.encode('utf-8')):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Update login info
        user.last_login = datetime.now()
        user.login_count = (user.login_count or 0) + 1
        db.commit()
        
        return {
            "message": "Login successful",
            "user": {
                "email": user.email,
                "name": user.name,
                "last_login": user.last_login.isoformat()
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Signin error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
@app.get("/")
def read_root():
    try:
        return {
            "message": "TrendAI Business Intelligence API",
            "status": "healthy",
            "version": "2.0",
            "timestamp": datetime.now().isoformat(),
            "system_status": {
                "database": "connected" if db_available else "disconnected",
                "models": "available" if models_available else "unavailable",
                "recommendations": "available" if recommendations_available else "unavailable",
                "integrated_intelligence": "available" if integrated_intelligence else "unavailable"
            },
            "environment_check": {
                "database_url": bool(os.getenv("DATABASE_URL")),
                "pollination_key": bool(os.getenv("POLLINATION_API_KEY")),
                "serpapi_key": bool(os.getenv("SERPAPI_API_KEY")),
                "gemini_key": bool(os.getenv("GEMINI_API_KEY"))
            }
        }
    except Exception as e:
        logger.error(f"Root endpoint error: {e}")
        return {
            "message": "API running with limited functionality",
            "status": "partial",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

# Health check endpoint
@app.get("/health")
def health_check():
    try:
        health_status = {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "components": {
                "database": "ok" if db_available else "error",
                "models": "ok" if models_available else "error",
                "recommendations": "ok" if recommendations_available else "error",
                "integrated_intelligence": "ok" if integrated_intelligence else "error"
            }
        }
        
        if db_available:
            try:
                db_check = check_db_connection()
                health_status["database_test"] = "passed" if db_check else "failed"
            except Exception as e:
                health_status["database_test"] = f"error: {str(e)}"
        
        return health_status
    except Exception as e:
        logger.error(f"Health check error: {e}")
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

# Recommendations endpoint with database saving
@app.post("/api/recommendations")
def get_recommendations(request: RecommendationRequest, db: Session = Depends(get_db_session)):
    try:
        logger.info(f"Recommendation request for: {request.area}")
        
        # Check cache first if database is available
        if db_available and models_available:
            try:
                # Look for recent cache (within 24 hours)
                recent_cache = db.query(models.SearchHistory).filter(
                    models.SearchHistory.user_email == request.user_email,
                    models.SearchHistory.area == request.area,
                    models.SearchHistory.created_at >= datetime.now() - timedelta(hours=24)
                ).first()
                
                if recent_cache:
                    logger.info("✅ Using cached recommendations")
                    return {
                        "analysis": json.loads(recent_cache.analysis) if recent_cache.analysis else {},
                        "recommendations": recent_cache.recommendations or [],
                        "cached": True,
                        "timestamp": recent_cache.created_at.isoformat()
                    }
            except Exception as e:
                logger.error(f"Cache check failed: {e}")
        
        # Generate new recommendations
        result = None
        
        # Try integrated intelligence first
        if integrated_intelligence:
            try:
                result = integrated_intelligence.generate_data_driven_recommendations(
                    request.area, request.user_email, request.language, request.phase
                )
                logger.info("✅ Used integrated intelligence")
            except Exception as e:
                logger.error(f"Integrated intelligence failed: {e}")
        
        # Fallback to simple recommendations
        if not result and recommendations_available:
            try:
                result = generate_dynamic_recommendations(
                    request.area, request.user_email, request.language
                )
                logger.info("✅ Used simple recommendations fallback")
            except Exception as e:
                logger.error(f"Simple recommendations failed: {e}")
        
        # Ultimate fallback
        if not result:
            result = {
                "analysis": {
                    "executive_summary": f"Business analysis for {request.area} shows potential opportunities in the local market.",
                    "market_overview": f"The {request.area} region presents various business opportunities for entrepreneurs.",
                    "confidence_score": "75%",
                    "key_facts": [
                        f"Growing market in {request.area}",
                        "Diverse business opportunities available",
                        "Local demand for innovative services"
                    ]
                },
                "recommendations": [
                    {
                        "title": "Local Service Business",
                        "description": f"Start a service-based business targeting the {request.area} market with focus on local needs.",
                        "profitability_score": 75,
                        "funding_required": "₹10L",
                        "estimated_revenue": "₹3L/month",
                        "roi_percentage": 120,
                        "competition_level": "Medium",
                        "market_size": "Growing",
                        "key_success_factors": ["Local market knowledge", "Quality service delivery"]
                    }
                ],
                "location_data": {
                    "city": request.area.split(',')[0].strip(),
                    "currency_symbol": "₹"
                },
                "timestamp": datetime.now().isoformat(),
                "system_status": "Fallback mode - limited functionality"
            }
        
        # Save to database if available
        if db_available and models_available and result:
            try:
                db_record = models.SearchHistory(
                    user_email=request.user_email,
                    area=request.area,
                    analysis=json.dumps(result.get("analysis", {})),
                    recommendations=result.get("recommendations", []),
                    created_at=datetime.now()
                )
                db.add(db_record)
                db.commit()
                logger.info("✅ Saved recommendations to database")
            except Exception as e:
                logger.error(f"Failed to save to database: {e}")
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Recommendations endpoint error: {e}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# History endpoint
@app.get("/api/history/{email}")
def get_history(email: str, db: Session = Depends(get_db_session)):
    try:
        if not models_available:
            return {"history": [], "message": "History not available"}
        
        history = db.query(models.SearchHistory).filter(
            models.SearchHistory.user_email == email
        ).order_by(models.SearchHistory.created_at.desc()).limit(10).all()
        
        return {
            "history": [
                {
                    "id": h.id,
                    "area": h.area,
                    "created_at": h.created_at.isoformat(),
                    "recommendations_count": len(h.recommendations) if h.recommendations else 0
                }
                for h in history
            ]
        }
        
    except Exception as e:
        logger.error(f"History endpoint error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Business plan endpoint
@app.post("/api/business-plan")
def get_business_plan(request: BusinessPlanRequest):
    try:
        if recommendations_available:
            try:
                result = generate_ai_business_plan(request.business_title, request.area, request.language)
                if result:
                    return result
            except Exception as e:
                logger.error(f"AI business plan failed: {e}")
        
        # Fallback business plan
        return {
            "business_overview": f"Comprehensive business plan for {request.business_title} in {request.area}",
            "market_analysis": f"Market analysis shows opportunities for {request.business_title} in the {request.area} region",
            "success_score": 80,
            "risk_level": "Medium",
            "financial_projections": {
                "month_1": {"revenue": "₹2L", "expenses": "₹1.5L", "profit": "₹0.5L"},
                "month_2": {"revenue": "₹2.5L", "expenses": "₹1.5L", "profit": "₹1L"},
                "month_3": {"revenue": "₹3L", "expenses": "₹1.8L", "profit": "₹1.2L"},
                "month_4": {"revenue": "₹3.5L", "expenses": "₹2L", "profit": "₹1.5L"},
                "month_5": {"revenue": "₹4L", "expenses": "₹2.2L", "profit": "₹1.8L"},
                "month_6": {"revenue": "₹4.5L", "expenses": "₹2.5L", "profit": "₹2L"}
            },
            "marketing_strategy": f"Focus on local market penetration in {request.area} with digital and traditional marketing mix",
            "operational_plan": "Establish operations with focus on quality and customer satisfaction",
            "monthly_milestones": [
                "Month 1: Setup and initial operations",
                "Month 2: Customer acquisition focus",
                "Month 3: Process optimization",
                "Month 4: Market expansion",
                "Month 5: Team scaling",
                "Month 6: Growth consolidation"
            ]
        }
        
    except Exception as e:
        logger.error(f"Business plan endpoint error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Roadmap endpoint
@app.post("/api/roadmap")
def get_roadmap(request: RoadmapRequest):
    try:
        if recommendations_available:
            try:
                result = generate_ai_roadmap(request.title, request.area, request.language)
                if result:
                    return result
            except Exception as e:
                logger.error(f"AI roadmap failed: {e}")
        
        # Fallback roadmap
        return {
            "steps": [
                {
                    "step_number": 1,
                    "step_title": "Market Research & Validation",
                    "step_description": f"Conduct thorough market research for {request.title} in {request.area}"
                },
                {
                    "step_number": 2,
                    "step_title": "Business Planning",
                    "step_description": "Develop comprehensive business plan and financial projections"
                },
                {
                    "step_number": 3,
                    "step_title": "Setup & Launch",
                    "step_description": "Establish operations and launch the business"
                },
                {
                    "step_number": 4,
                    "step_title": "Growth & Scaling",
                    "step_description": "Focus on customer acquisition and business growth"
                }
            ],
            "timeline": "6 Months Plan",
            "team_needed": "2-3 core team members",
            "execution_tips": [
                f"Focus on local market needs in {request.area}",
                "Start small and scale gradually",
                "Maintain quality and customer satisfaction"
            ]
        }
        
    except Exception as e:
        logger.error(f"Roadmap endpoint error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Test endpoint
@app.get("/test")
def test_endpoint():
    return {
        "test": "success",
        "message": "API is working correctly",
        "timestamp": datetime.now().isoformat(),
        "all_systems": {
            "database": db_available,
            "models": models_available,
            "recommendations": recommendations_available,
            "integrated_intelligence": integrated_intelligence is not None
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)