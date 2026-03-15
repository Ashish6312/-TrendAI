import os
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import bcrypt
import requests
from duckduckgo_search import DDGS
from textblob import TextBlob
import numpy as np

from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from database import engine, get_db, check_db_connection
import models

load_dotenv()

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Business Recommendation API", description="API for AI Business Recommendation Tool")

# Configure CORS
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://trendai-ui.onrender.com",
    "https://ahish6312-trendai.onrender.com", # Potential production URL
    frontend_url,
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request, call_next):
    # This middleware ensures that even on errors, we try to add CORS headers
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        from fastapi.responses import JSONResponse
        print(f"Global Exception: {e}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal Server Error", "message": str(e)},
            headers={
                "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*"
            }
        )

POLLINATION_API_KEY = os.getenv("POLLINATION_API_KEY")

class UserSync(BaseModel):
    email: str
    name: str
    image_url: str | None = None

class LoginSession(BaseModel):
    user_email: str
    session_token: str
    provider: str = "google"
    ip_address: str | None = None
    user_agent: str | None = None
    device_info: dict | None = None
    location_info: dict | None = None
    login_method: str = "oauth"

class UserSignUp(BaseModel):
    email: str
    password: str
    name: str

class UserSignIn(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    name: str
    bio: str | None = None
    phone: str | None = None
    image_url: str | None = None
    company: str | None = None
    location: str | None = None
    website: str | None = None
    industry: str | None = None

class SubscriptionCreate(BaseModel):
    user_email: str
    plan_name: str
    plan_display_name: str
    billing_cycle: str
    price: float
    currency: str = "USD"
    max_analyses: int = 5
    features: dict
    razorpay_subscription_id: str | None = None
    razorpay_customer_id: str | None = None

class SubscriptionUpdate(BaseModel):
    status: str | None = None
    subscription_end: str | None = None
    max_analyses: int | None = None
    features: dict | None = None

class PaymentCreate(BaseModel):
    user_email: str
    subscription_id: int | None = None
    razorpay_payment_id: str
    razorpay_order_id: str
    amount: float
    currency: str = "USD"
    status: str
    payment_method: str | None = None
    plan_name: str
    billing_cycle: str
    failure_reason: str | None = None

class PaymentUpdate(BaseModel):
    status: str | None = None
    failure_reason: str | None = None
    refund_amount: float | None = None

class NotificationCreate(BaseModel):
    user_email: str
    type: str
    title: str
    message: str
    priority: str = "medium"
    action_url: str | None = None
    metadata: dict | None = None

class NotificationUpdate(BaseModel):
    read: bool | None = None

class RecommendationRequest(BaseModel):
    area: str
    user_email: str | None = None
    language: str | None = "English"

class RoadmapRequest(BaseModel):
    area: str
    title: str
    description: str
    language: str | None = "English"

class BusinessSearchRequest(BaseModel):
    query: str
    location: str | None = "Global"
    language: str | None = "English"

class ReviewCreate(BaseModel):
    user_id: str
    rating: int
    review_text: str
    review_tags: list[str]

@app.get("/")
def read_root():
    return {"message": "Welcome to the Business Recommendation API"}

@app.get("/health")
def health_check():
    """Health check endpoint for monitoring"""
    try:
        db_status = check_db_connection()
        return {
            "status": "healthy" if db_status else "unhealthy",
            "database": "connected" if db_status else "disconnected",
            "timestamp": "2024-03-15T10:00:00Z"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "error",
            "error": str(e),
            "timestamp": "2024-03-15T10:00:00Z"
        }

@app.post("/api/recommendations")
def get_recommendations(request: RecommendationRequest, db: Session = Depends(get_db)):
    # 1. Fetch live search results via DuckDuckGo
    live_reddit_data = []
    live_web_data = []
    try:
        ddgs = DDGS()
        # Use a localized short-name (just the city) to avoid breaking DuckDuckGo search queries
        short_area = request.area.split(',')[0].strip()
        
        # Broad Search Reddit specifically for business discussions in this region
        reddit_query = f"site:reddit.com local business {short_area}"
        for r in ddgs.text(reddit_query, max_results=5):
            live_reddit_data.append(r.get('body', ''))
            
        # General local business news/trends
        web_query = f"new business opening profitable trends {short_area}"
        for w in ddgs.text(web_query, max_results=5):
            live_web_data.append(w.get('body', ''))
    except Exception as e:
        print(f"Error fetching live data: {e}")
        
    reddit_context = " ".join(live_reddit_data) if live_reddit_data else "No live reddit data found."
    web_context = " ".join(live_web_data) if live_web_data else "No live web data found."
    
    print("\n[LIVE DATA LOGS]")
    print(f"> Reddit Scraped: {len(live_reddit_data)} comments")
    print(f"> Web Scraped: {len(live_web_data)} articles")
    print("----------------\n")
    
    prompt = (
        f"Analyze '{request.area}' based on the following real-time data I scraped from the internet:\n\n"
        f"Live Reddit Comments/Posts about this area: {reddit_context}\n\n"
        f"Live Google Search results about this area: {web_context}\n\n"
        f"Using this live regional data and your baseline knowledge, what are the best, most profitable business opportunities specifically for {request.area}? "
        f"Give a detailed analysis of current local demands and recommend the top 3 businesses. "
        f"CRITICAL: YOUR ENTIRE RESPONSE (EVERY FIELD IN THE JSON) MUST BE IN {request.language}. "
        f"Return strictly a JSON object with two keys: 'analysis' (a string summarizing the market) and 'recommendations' (a list of 3 objects, each with 'title', 'description', 'profitability_score' as an integer 1-100, 'funding_required' as a string like '$10k-$50k', 'survival_rate' as a string like '80% 5-year survival', and 'estimated_profit' as a string like '$40k/year')."
    )
    
    try:
        headers = {"Authorization": f"Bearer {POLLINATION_API_KEY}"} if POLLINATION_API_KEY else {}
        response = requests.post(
            "https://text.pollinations.ai/openai",
            json={
                "messages": [
                    {"role": "system", "content": "You are a professional business strategist and market analyst. Always respond perfectly matching the requested JSON schema."},
                    {"role": "user", "content": prompt}
                ],
                "jsonMode": True,
                "model": "openai",
                "temperature": 0.1,
                "seed": 42
            },
            headers=headers,
            timeout=30
        )
        response.raise_for_status()
        data = response.json()
        
        content_str = data.get("choices", [{}])[0].get("message", {}).get("content", "{}")
        import json
        parsed_content = json.loads(content_str)
        
        analysis_text = parsed_content.get("analysis", f"Analysis for {request.area} completed successfully.")
        recs = parsed_content.get("recommendations", [])
        
    except Exception as e:
        print(f"Error fetching from Pollination AI: {e}")
        # Fallback to mock data if the API fails
        analysis_text = f"Analysis for {request.area}: Information could not be fetched. The current market shows a high demand for sustainable living products. (Fallback Mode)"
        recs = [
            {
                "title": "Organic Farm-to-Table Restaurant",
                "description": "High search volume on Google for organic food in this area. Reddit discussions highlight a lack of healthy dining options.",
                "profitability_score": 92,
                "funding_required": "$50k - $150k",
                "survival_rate": "75% 5-year survival",
                "estimated_profit": "$80k - $120k / year"
            },
            {
                "title": "Eco-friendly Home Cleaning Service",
                "description": "Increasing queries about sustainable services.",
                "profitability_score": 85,
                "funding_required": "$2k - $10k",
                "survival_rate": "85% 5-year survival",
                "estimated_profit": "$40k - $70k / year"
            },
            {
                "title": "Specialty Coffee Shop with Co-working Space",
                "description": "High demand from remote workers looking for a good environment, often mentioned in local subreddits.",
                "profitability_score": 88,
                "funding_required": "$30k - $80k",
                "survival_rate": "65% 5-year survival",
                "estimated_profit": "$60k - $90k / year"
            }
        ]
    
    # Save search history and recommendations to Neon DB
    db_record = models.SearchHistory(
        user_email=request.user_email,
        area=request.area,
        analysis=analysis_text,
        recommendations=recs
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    return {
        "id": db_record.id,
        "area": db_record.area,
        "analysis": db_record.analysis,
        "recommendations": db_record.recommendations,
        "logs": {
            "reddit": live_reddit_data,
            "web": live_web_data
        }
    }

@app.get("/api/utils/location")
def get_location_info(request: Request):
    """Get location info based on client IP"""
    client_ip = request.client.host
    # Mapping for local testing
    if client_ip in ["127.0.0.1", "localhost", "::1"]:
        try:
            ip_res = requests.get("https://api.ipify.org?format=json", timeout=2)
            if ip_res.status_code == 200:
                client_ip = ip_res.json().get("ip", "1.1.1.1")
        except:
            client_ip = "1.1.1.1"

    services = [
        f"https://ipwho.is/{client_ip}",
        f"https://ipapi.co/{client_ip}/json/",
        f"https://ipinfo.io/{client_ip}/json"
    ]

    for service in services:
        try:
            res = requests.get(service, timeout=3)
            if res.status_code == 200:
                data = res.json()
                if "ipwho.is" in service:
                    return {
                        "country": data.get("country"),
                        "city": data.get("city"),
                        "region": data.get("region"),
                        "timezone": data.get("timezone", {}).get("id"),
                        "ip": data.get("ip")
                    }
                elif "ipapi.co" in service:
                    return {
                        "country": data.get("country_name"),
                        "city": data.get("city"),
                        "region": data.get("region"),
                        "timezone": data.get("timezone"),
                        "ip": data.get("ip")
                    }
                else: # ipinfo.io
                    return {
                        "country": data.get("country"),
                        "city": data.get("city"),
                        "region": data.get("region"),
                        "timezone": data.get("timezone"),
                        "ip": data.get("ip")
                    }
        except Exception as e:
            print(f"Location service {service} failed: {e}")
            continue
            
    return {"country": "Unknown", "city": "Unknown", "ip": client_ip}

# --- END SYSTEM UTILS ---
# --- AI Review & Scoring Utils ---

def analyze_sentiment(text: str) -> float:
    """Returns sentiment score from -1 (negative) to 1 (positive)"""
    analysis = TextBlob(text)
    return analysis.sentiment.polarity

def calculate_business_score(ai_score: float, avg_rating: float, sentiment_score: float) -> float:
    """
    Final Score = (0.5 * AI prediction score) + (0.3 * average rating * 20) + (0.2 * sentiment score * 50 + 50)
    Normalized to 0-100
    """
    # Normalize avg_rating (1-5) to 0-100: (rating-1)/4 * 100 or just rating * 20
    rating_normalized = avg_rating * 20
    # Normalize sentiment (-1 to 1) to 0-100: (sentiment + 1) * 50
    sentiment_normalized = (sentiment_score + 1) * 50
    
    final_score = (0.5 * ai_score) + (0.3 * rating_normalized) + (0.2 * sentiment_normalized)
    return round(final_score, 2)

def find_existing_businesses(query: str, location: str):
    """Scrapes DuckDuckGo for existing businesses in the area to provide connection context"""
    existing_biz = []
    try:
        ddgs = DDGS()
        # Search for official sites or listings
        search_query = f"{query} in {location} official website contact"
        results = ddgs.text(search_query, max_results=4)
        for r in results:
            existing_biz.append({
                "title": r.get('title', 'Existing Business'),
                "description": r.get('body', 'Detailed information via web extraction.'),
                "link": r.get('href', '#')
            })
    except Exception as e:
        print(f"Scraping error for existing businesses: {e}")
    return existing_biz

# --- Endpoints for Business Search & Reviews ---

@app.post("/api/recommendations")
def get_recommendations(request: RecommendationRequest, db: Session = Depends(get_db)):
    # 1. Fetch live search results via DuckDuckGo
    live_reddit_data = []
    live_web_data = []
    try:
        ddgs = DDGS()
        short_area = request.area.split(',')[0].strip()
        
        reddit_query = f"site:reddit.com local business {short_area}"
        for r in ddgs.text(reddit_query, max_results=5):
            live_reddit_data.append(r.get('body', ''))
            
        web_query = f"new business opening profitable trends {short_area}"
        for w in ddgs.text(web_query, max_results=5):
            live_web_data.append(w.get('body', ''))
    except Exception as e:
        print(f"Error fetching live data: {e}")
        
    reddit_context = " ".join(live_reddit_data) if live_reddit_data else "No live reddit data found."
    web_context = " ".join(live_web_data) if live_web_data else "No live web data found."
    
    prompt = (
        f"Analyze '{request.area}' based on the following real-time data I scraped from the internet:\n\n"
        f"Live Reddit Comments/Posts about this area: {reddit_context}\n\n"
        f"Live Google Search results about this area: {web_context}\n\n"
        f"Using this live regional data and your baseline knowledge, what are the best, most profitable business opportunities specifically for {request.area}? "
        f"Give a detailed analysis of current local demands and recommend the top 3 businesses. "
        f"CRITICAL: YOUR ENTIRE RESPONSE (EVERY FIELD IN THE JSON) MUST BE IN {request.language}. "
        f"Return strictly a JSON object with two keys: 'analysis' (a string summarizing the market) and 'recommendations' (a list of 3 objects, each with 'title', 'description', 'profitability_score' as an integer 1-100, 'funding_required' as a string like '$10k-$50k', 'survival_rate' as a string like '80% 5-year survival', and 'estimated_profit' as a string like '$40k/year')."
    )
    
    try:
        headers = {"Authorization": f"Bearer {POLLINATION_API_KEY}"} if POLLINATION_API_KEY else {}
        response = requests.post(
            "https://text.pollinations.ai/openai",
            json={
                "messages": [
                    {"role": "system", "content": "You are a professional business strategist and market analyst. Always respond perfectly matching the requested JSON schema."},
                    {"role": "user", "content": prompt}
                ],
                "jsonMode": True,
                "model": "openai",
                "temperature": 0.1,
                "seed": 42
            },
            headers=headers,
            timeout=30
        )
        data = response.json()
        content_str = data.get("choices", [{}])[0].get("message", {}).get("content", "{}")
        import json
        parsed_content = json.loads(content_str)
        recs = parsed_content.get("recommendations", [])
        
        # Enrich recommendations with existing businesses in that area
        for rec in recs:
            rec["existing_businesses"] = find_existing_businesses(rec["title"], request.area)
            
    except Exception as e:
        print(f"Error fetching from Pollination AI: {e}")
        recs = [
            {
                "title": "Organic Farm-to-Table Restaurant",
                "description": "High search volume on Google for organic food in this area.",
                "profitability_score": 92,
                "funding_required": "$50k - $150k",
                "survival_rate": "75% 5-year survival",
                "estimated_profit": "$80k - $120k / year",
                "existing_businesses": find_existing_businesses("Organic Restaurant", request.area)
            }
        ]
    
    db_record = models.SearchHistory(
        user_email=request.user_email,
        area=request.area,
        analysis=parsed_content.get("analysis", ""),
        recommendations=recs
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    return {
        "id": db_record.id,
        "area": db_record.area,
        "analysis": db_record.analysis,
        "recommendations": db_record.recommendations,
        "logs": {"reddit": live_reddit_data, "web": live_web_data}
    }

@app.post("/api/business/search")
def search_business_idea(request: BusinessSearchRequest, db: Session = Depends(get_db)):
    # 1. Fetch live search results via DuckDuckGo
    live_reddit_data = []
    live_web_data = []
    location_query = request.location if (request.location and request.location.lower() != "global") else "worldwide"
    try:
        ddgs = DDGS()
        reddit_query = f"site:reddit.com local business {request.query} {location_query}"
        for r in ddgs.text(reddit_query, max_results=3):
            live_reddit_data.append(r.get('body', ''))
            
        web_query = f"new business opening profitable trends {request.query} {location_query}"
        for w in ddgs.text(web_query, max_results=3):
            live_web_data.append(w.get('body', ''))
    except Exception as e:
        print(f"Error fetching live data: {e}")
        
    reddit_context = " ".join(live_reddit_data) if live_reddit_data else "No live reddit data found."
    web_context = " ".join(live_web_data) if live_web_data else "No live web data found."

    prompt = (
        f"Analyze this business idea: '{request.query}' for the location '{request.location}'. "
        f"Based on the following real-time data I scraped from the internet:\n\n"
        f"Live Reddit Comments/Posts: {reddit_context}\n\n"
        f"Live Google Search results: {web_context}\n\n"
        f"Provide detailed market analysis and return a JSON object with: "
        f"'business_name', 'category', 'startup_cost' (string like '₹3L'), 'estimated_revenue' (string like '₹1.5L/mo'), "
        f"'estimated_profit' (string like '₹50K/mo'), 'demand_score' (float 0-10), 'competition_level' (Low/Medium/High), "
        f"'risk_score' (string like 'Low'), 'ai_recommendation_text' (A paragraph explaining why)."
        f"CRITICAL: RESPONSE MUST BE IN {request.language}."
    )
    
    try:
        headers = {"Authorization": f"Bearer {POLLINATION_API_KEY}"} if POLLINATION_API_KEY else {}
        response = requests.post(
            "https://text.pollinations.ai/openai",
            json={
                "messages": [
                    {"role": "system", "content": "You are a business consultant. Return JSON."},
                    {"role": "user", "content": prompt}
                ],
                "jsonMode": True,
                "model": "openai"
            },
            headers=headers,
            timeout=30
        )
        data = response.json()
        import json
        content_str = data.get("choices", [{}])[0].get("message", {}).get("content", "{}")
        content = json.loads(content_str)
        
        # Enrich with existing mentors/businesses
        mentors = find_existing_businesses(request.query, request.location)
        
        # Save business record
        new_biz = models.BusinessRecommendation(
            business_name=content.get("business_name", request.query),
            category=content.get("category", "Uncategorized"),
            location=request.location,
            startup_cost=content.get("startup_cost", "N/A"),
            estimated_revenue=content.get("estimated_revenue", "N/A"),
            estimated_profit=content.get("estimated_profit", "N/A"),
            demand_score=content.get("demand_score", 0),
            competition_level=content.get("competition_level", "Unknown"),
            risk_score=content.get("risk_score", "Unknown"),
            ai_recommendation="Recommended"
        )
        db.add(new_biz)
        db.commit()
        db.refresh(new_biz)
        
        return {
            "business": new_biz,
            "mentors": mentors,
            "logs": {"reddit": live_reddit_data, "web": live_web_data}
        }
    except Exception as e:
        print(f"Search error: {e}")
        raise HTTPException(status_code=500, detail="Search failed")

@app.post("/api/business/{biz_id}/review")
def add_review(biz_id: int, review: ReviewCreate, db: Session = Depends(get_db)):
    sentiment_score = analyze_sentiment(review.review_text)
    
    new_review = models.BusinessReview(
        business_id=biz_id,
        user_id=review.user_id,
        rating=review.rating,
        review_text=review.review_text,
        review_tags=",".join(review.review_tags),
        sentiment_score=sentiment_score
    )
    db.add(new_review)
    db.commit()
    return {"status": "success", "sentiment": sentiment_score}

@app.get("/api/business/{biz_id}")
def get_business_details(biz_id: int, db: Session = Depends(get_db)):
    biz = db.query(models.BusinessRecommendation).filter(models.BusinessRecommendation.id == biz_id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")
    
    reviews = db.query(models.BusinessReview).filter(models.BusinessReview.business_id == biz_id).all()
    
    avg_rating = sum(r.rating for r in reviews) / len(reviews) if reviews else 0
    avg_sentiment = sum(r.sentiment_score for r in reviews) / len(reviews) if reviews else 0
    
    # Keyword Extraction
    from collections import Counter
    import re
    all_text = " ".join([r.review_text for r in reviews]).lower()
    keywords = Counter(re.findall(r'\w+', all_text)).most_common(5)
    keyword_list = [k[0] for k in keywords if len(k[0]) > 3]

    # AI Score from prediction (mocked as demand_score * 10 for simplicity)
    ai_score = biz.demand_score * 10
    
    final_score = calculate_business_score(ai_score, avg_rating, avg_sentiment)
    
    return {
        "business": biz,
        "reviews": reviews,
        "stats": {
            "average_rating": avg_rating,
            "review_count": len(reviews),
            "sentiment_summary": "Positive" if avg_sentiment > 0.1 else "Negative" if avg_sentiment < -0.1 else "Neutral",
            "business_score": final_score,
            "top_keywords": keyword_list
        }
    }

@app.get("/api/history/{email}")
def get_history(email: str, db: Session = Depends(get_db)):
    history = db.query(models.SearchHistory).filter(models.SearchHistory.user_email == email).order_by(models.SearchHistory.created_at.desc()).all()
    return history


@app.get("/api/auth/test")
def test_auth():
    """Test endpoint to verify auth endpoints are working"""
    return {"status": "ok", "message": "Auth endpoints are working"}

@app.post("/api/auth/signup")
def sign_up(user_data: UserSignUp, db: Session = Depends(get_db)):
    """Sign up with email and password"""
    print(f"Sign up attempt for: {user_data.email}")
    
    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    # Validate password strength
    if len(user_data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long")
    
    # Hash password
    password_hash = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Create new user
    db_user = models.User(
        email=user_data.email,
        name=user_data.name,
        password_hash=password_hash,
        auth_provider="email",
        login_count=1,
        last_login=func.now()
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    print(f"User created successfully: {user_data.email}")
    return {
        "id": db_user.id,
        "email": db_user.email,
        "name": db_user.name,
        "image_url": db_user.image_url
    }

@app.post("/api/auth/signin")
def sign_in(user_data: UserSignIn, db: Session = Depends(get_db)):
    """Sign in with email and password"""
    print(f"Sign in attempt for: {user_data.email}")
    
    # Find user
    db_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Check if user has a password (might be OAuth only)
    if not db_user.password_hash:
        raise HTTPException(status_code=401, detail="This account uses social login. Please sign in with Google.")
    
    # Verify password
    if not bcrypt.checkpw(user_data.password.encode('utf-8'), db_user.password_hash.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Update login info
    db_user.login_count = (db_user.login_count or 0) + 1
    db_user.last_login = func.now()
    db.commit()
    
    print(f"User signed in successfully: {user_data.email}")
    return {
        "id": db_user.id,
        "email": db_user.email,
        "name": db_user.name,
        "image_url": db_user.image_url
    }

@app.post("/api/users/sync")
def sync_user(user: UserSync, db: Session = Depends(get_db)):
    email_normalized = user.email.lower().strip()
    print(f"Syncing user: {email_normalized}")
    db_user = db.query(models.User).filter(func.lower(models.User.email) == email_normalized).first()
    if not db_user:
        db_user = models.User(
            email=email_normalized, 
            name=user.name, 
            image_url=user.image_url,
            auth_provider="google",  # OAuth users
            login_count=1,
            last_login=func.now()
        )
        db.add(db_user)
        db.commit()
        print(f"Created new OAuth user: {email_normalized}")
    else:
        # Update login info
        db_user.login_count = (db_user.login_count or 0) + 1
        db_user.last_login = func.now()
        if user.image_url and not db_user.image_url:
            db_user.image_url = user.image_url
        if user.name and not db_user.name:
            db_user.name = user.name
        db.commit()
        print(f"Updated existing user: {email_normalized}, login count: {db_user.login_count}")
    return {"status": "ok", "user_id": db_user.id}

@app.post("/api/users/login-session")
def create_login_session(session: LoginSession, db: Session = Depends(get_db)):
    """Create a new login session record"""
    print(f"Creating login session for user: {session.user_email}")
    
    try:
        # End any existing active sessions for this user
        existing_sessions = db.query(models.UserSession).filter(
            models.UserSession.user_email == session.user_email,
            models.UserSession.is_active == True
        ).all()
        
        for existing_session in existing_sessions:
            existing_session.is_active = False
            existing_session.session_end = func.now()
        
        # Create new session
        db_session = models.UserSession(
            user_email=session.user_email,
            session_token=session.session_token,
            provider=session.provider,
            ip_address=session.ip_address,
            user_agent=session.user_agent,
            device_info=session.device_info,
            location_info=session.location_info,
            login_method=session.login_method
        )
        
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
        
        print(f"Created login session: {db_session.id}")
        return {"status": "ok", "session_id": db_session.id}
    except Exception as e:
        print(f"Failed to create login session (ignoring missing table): {e}")
        db.rollback()
        return {"status": "ok", "session_id": -1}

@app.get("/api/users/{email}/sessions")
def get_user_sessions(email: str, limit: int = 10, db: Session = Depends(get_db)):
    """Get user's login sessions"""
    sessions = db.query(models.UserSession).filter(
        models.UserSession.user_email == email
    ).order_by(models.UserSession.created_at.desc()).limit(limit).all()
    
    return sessions

@app.put("/api/users/session/{session_id}/end")
def end_session(session_id: int, db: Session = Depends(get_db)):
    """End a user session"""
    session = db.query(models.UserSession).filter(models.UserSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.is_active = False
    session.session_end = func.now()
    db.commit()
    
    return {"status": "ok"}

@app.get("/api/admin/sessions")
def get_all_sessions(limit: int = 50, db: Session = Depends(get_db)):
    """Get all login sessions (admin endpoint)"""
    sessions = db.query(models.UserSession).order_by(
        models.UserSession.created_at.desc()
    ).limit(limit).all()
    
    return sessions

@app.get("/api/admin/users/stats")
def get_user_stats(db: Session = Depends(get_db)):
    """Get user statistics (admin endpoint)"""
    total_users = db.query(models.User).count()
    total_sessions = db.query(models.UserSession).count()
    active_sessions = db.query(models.UserSession).filter(models.UserSession.is_active == True).count()
    
    # Get users with most logins
    top_users = db.query(models.User).order_by(models.User.login_count.desc()).limit(10).all()
    
    return {
        "total_users": total_users,
        "total_sessions": total_sessions,
        "active_sessions": active_sessions,
        "top_users": [{"email": user.email, "login_count": user.login_count, "last_login": user.last_login} for user in top_users]
    }

@app.get("/api/users/{email}")
def get_user_profile(email: str, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(func.lower(models.User.email) == email.lower()).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.put("/api/users/{email}")
def update_user_profile(email: str, user_update: UserUpdate, db: Session = Depends(get_db)):
    email_normalized = email.lower().strip()
    print(f"Updating profile for user: {email_normalized}")
    print(f"Update data: {user_update.dict()}")
    
    db_user = db.query(models.User).filter(func.lower(models.User.email) == email_normalized).first()
    if not db_user:
        print(f"User not found: {email_normalized}")
        raise HTTPException(status_code=404, detail="User not found")
    
    # Enhanced validation
    if not user_update.name or len(user_update.name.strip()) < 2:
        raise HTTPException(status_code=400, detail="Name must be at least 2 characters long")
    
    # Validate phone number format if provided
    if user_update.phone and user_update.phone.strip():
        import re
        phone_clean = re.sub(r'[\s\-\(\)]', '', user_update.phone)
        if not re.match(r'^[\+]?[1-9][\d]{0,15}$', phone_clean):
            raise HTTPException(status_code=400, detail="Invalid phone number format")
    
    # Validate website URL if provided
    if user_update.website and user_update.website.strip():
        if not user_update.website.startswith(('http://', 'https://')):
            user_update.website = f"https://{user_update.website.strip()}"
    
    # Update user fields
    db_user.name = user_update.name.strip()
    db_user.bio = user_update.bio.strip() if user_update.bio else None
    db_user.phone = user_update.phone.strip() if user_update.phone else None
    db_user.image_url = user_update.image_url
    db_user.company = user_update.company.strip() if user_update.company else None
    db_user.location = user_update.location.strip() if user_update.location else None
    db_user.website = user_update.website.strip() if user_update.website else None
    db_user.industry = user_update.industry.strip() if user_update.industry else None
    
    try:
        db.commit()
        db.refresh(db_user)
        print(f"Profile updated successfully for user: {email}")
        return db_user
    except Exception as e:
        print(f"Database error: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

class LocationValidationRequest(BaseModel):
    location: str
    coordinates: dict | None = None  # {"lat": float, "lng": float}

class LocationValidationResponse(BaseModel):
    is_valid: bool
    formatted_location: str | None = None
    country: str | None = None
    city: str | None = None
    coordinates: dict | None = None
    confidence_score: float | None = None

@app.post("/api/validate-location")
def validate_location(request: LocationValidationRequest):
    """Validate and format location data"""
    try:
        # If coordinates are provided, use reverse geocoding
        if request.coordinates and 'lat' in request.coordinates and 'lng' in request.coordinates:
            lat = request.coordinates['lat']
            lng = request.coordinates['lng']
            
            # Validate coordinate ranges
            if not (-90 <= lat <= 90) or not (-180 <= lng <= 180):
                return LocationValidationResponse(
                    is_valid=False,
                    formatted_location=None,
                    confidence_score=0.0
                )
            
            # Use a simple validation - in production, you'd use a geocoding service
            return LocationValidationResponse(
                is_valid=True,
                formatted_location=request.location,
                coordinates=request.coordinates,
                confidence_score=0.95  # High confidence for GPS coordinates
            )
        
        # Basic location string validation
        location = request.location.strip()
        if len(location) < 2:
            return LocationValidationResponse(
                is_valid=False,
                formatted_location=None,
                confidence_score=0.0
            )
        
        # Simple validation - check if it contains at least city/country pattern
        parts = [part.strip() for part in location.split(',')]
        if len(parts) >= 2:
            city = parts[0]
            country = parts[-1]
            
            return LocationValidationResponse(
                is_valid=True,
                formatted_location=location,
                city=city,
                country=country,
                confidence_score=0.8
            )
        else:
            return LocationValidationResponse(
                is_valid=True,
                formatted_location=location,
                confidence_score=0.6  # Lower confidence for single location
            )
            
    except Exception as e:
        print(f"Location validation error: {e}")
        return LocationValidationResponse(
            is_valid=False,
            formatted_location=None,
            confidence_score=0.0
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

# Notification endpoints
@app.post("/api/notifications")
def create_notification(notification: NotificationCreate, db: Session = Depends(get_db)):
    """Create a new notification"""
    db_notification = models.Notification(
        user_email=notification.user_email.lower(),
        type=notification.type,
        title=notification.title,
        message=notification.message,
        priority=notification.priority,
        action_url=notification.action_url,
        notification_metadata=notification.metadata
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

@app.get("/api/notifications/{user_email}")
def get_user_notifications(user_email: str, limit: int = 50, db: Session = Depends(get_db)):
    """Get notifications for a user"""
    notifications = db.query(models.Notification).filter(
        func.lower(models.Notification.user_email) == user_email.lower()
    ).order_by(models.Notification.created_at.desc()).limit(limit).all()
    return notifications

@app.put("/api/notifications/{notification_id}")
def update_notification(notification_id: int, update: NotificationUpdate, db: Session = Depends(get_db)):
    """Update notification (mark as read/unread)"""
    db_notification = db.query(models.Notification).filter(
        models.Notification.id == notification_id
    ).first()
    
    if not db_notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    if update.read is not None:
        db_notification.read = update.read
    
    db.commit()
    db.refresh(db_notification)
    return db_notification

@app.put("/api/notifications/{user_email}/mark-all-read")
def mark_all_notifications_read(user_email: str, db: Session = Depends(get_db)):
    """Mark all notifications as read for a user"""
    db.query(models.Notification).filter(
        func.lower(models.Notification.user_email) == user_email.lower(),
        models.Notification.read == False
    ).update({"read": True})
    db.commit()
    return {"message": "All notifications marked as read"}

@app.delete("/api/notifications/{notification_id}")
def delete_notification(notification_id: int, db: Session = Depends(get_db)):
    """Delete a notification"""
    db_notification = db.query(models.Notification).filter(
        models.Notification.id == notification_id
    ).first()
    
    if not db_notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    db.delete(db_notification)
    db.commit()
    return {"message": "Notification deleted"}

class BatchNotificationRequest(BaseModel):
    user_email: str
    notifications: list[dict]

@app.post("/api/notifications/batch")
def create_batch_notifications(request: BatchNotificationRequest, db: Session = Depends(get_db)):
    """Create multiple notifications in a single request to reduce API calls"""
    created_notifications = []
    email_normalized = request.user_email.lower()
    
    for notification_data in request.notifications:
        # Check for duplicates based on type, title, and recent timestamp (within last 5 minutes)
        five_minutes_ago = models.func.now() - models.text("INTERVAL '5 minutes'")
        existing = db.query(models.Notification).filter(
            func.lower(models.Notification.user_email) == email_normalized,
            models.Notification.type == notification_data.get('type'),
            models.Notification.title == notification_data.get('title'),
            models.Notification.created_at > five_minutes_ago
        ).first()
        
        if existing:
            continue  # Skip duplicate
        
        db_notification = models.Notification(
            user_email=email_normalized,
            type=notification_data.get('type', 'system'),
            title=notification_data.get('title', 'Notification'),
            message=notification_data.get('message', ''),
            priority=notification_data.get('priority', 'medium'),
            action_url=notification_data.get('actionUrl'),
            notification_metadata=notification_data.get('metadata', {})
        )
        db.add(db_notification)
        created_notifications.append(db_notification)
    
    if created_notifications:
        db.commit()
        for notification in created_notifications:
            db.refresh(notification)
    
    return {
        "message": f"Created {len(created_notifications)} notifications",
        "created_count": len(created_notifications),
        "skipped_count": len(request.notifications) - len(created_notifications)
    }

@app.get("/api/notifications/{user_email}/unread-count")
def get_unread_count(user_email: str, db: Session = Depends(get_db)):
    """Get unread notification count for a user"""
    count = db.query(models.Notification).filter(
        func.lower(models.Notification.user_email) == user_email.lower(),
        models.Notification.read == False
    ).count()
    return {"unread_count": count}

@app.post("/api/roadmap")
def get_roadmap(request: RoadmapRequest):
    prompt = (
        f"A user wants to start a '{request.title}' in the area: '{request.area}'. "
        f"Context about this business: {request.description}. "
        f"Provide a step-by-step actionable roadmap/guide on exactly how to open and successfully run this business here to achieve high profitability. "
        f"CRITICAL: THE ENTIRE GUIDE MUST BE WRITTEN IN {request.language}. "
        f"Return strictly a JSON object with a 'steps' key containing a list of objects, each with 'step_number' (int), 'step_title' (string), and 'step_description' (string)."
    )
    
    try:
        headers = {"Authorization": f"Bearer {POLLINATION_API_KEY}"} if POLLINATION_API_KEY else {}
        response = requests.post(
            "https://text.pollinations.ai/openai",
            json={
                "messages": [
                    {"role": "system", "content": "You are a professional business consultant. Always respond perfectly matching the requested JSON schema."},
                    {"role": "user", "content": prompt}
                ],
                "jsonMode": True,
                "model": "openai",
                "temperature": 0.2,
                "seed": 42
            },
            headers=headers,
            timeout=30
        )
        response.raise_for_status()
        data = response.json()
        
        content_str = data.get("choices", [{}])[0].get("message", {}).get("content", "{}")
        import json
        parsed_content = json.loads(content_str)
        
        steps = parsed_content.get("steps", [])
        return {"steps": steps}
    except Exception as e:
        print(f"Error fetching roadmap from Pollination AI: {e}")
        return {"steps": [
            {"step_number": 1, "step_title": "Market Research", "step_description": "Conduct thorough competitor analysis in the region."},
            {"step_number": 2, "step_title": "Secure Funding", "step_description": "Apply for local MSME schemes or secure independent private loans."},
            {"step_number": 3, "step_title": "Launch Operations", "step_description": "Setup location, establish supply chains, and begin marketing."}
        ]}



# Subscription Management Endpoints
@app.post("/api/subscriptions")
def create_subscription(subscription: SubscriptionCreate, db: Session = Depends(get_db)):
    email_normalized = subscription.user_email.lower().strip()
    # Check if user already has an active subscription
    existing = db.query(models.UserSubscription).filter(
        func.lower(models.UserSubscription.user_email) == email_normalized,
        models.UserSubscription.status == "active"
    ).first()
    
    if existing:
        # Update existing subscription instead of creating new
        existing.plan_name = subscription.plan_name
        existing.plan_display_name = subscription.plan_display_name
        existing.billing_cycle = subscription.billing_cycle
        existing.price = subscription.price
        existing.currency = subscription.currency
        existing.max_analyses = subscription.max_analyses
        existing.features = subscription.features
        existing.razorpay_subscription_id = subscription.razorpay_subscription_id
        existing.razorpay_customer_id = subscription.razorpay_customer_id
        db.commit()
        db.refresh(existing)
        return existing
    
    # Create new subscription
    db_subscription = models.UserSubscription(
        user_email=email_normalized,
        plan_name=subscription.plan_name,
        plan_display_name=subscription.plan_display_name,
        billing_cycle=subscription.billing_cycle,
        price=subscription.price,
        currency=subscription.currency,
        max_analyses=subscription.max_analyses,
        features=subscription.features,
        razorpay_subscription_id=subscription.razorpay_subscription_id,
        razorpay_customer_id=subscription.razorpay_customer_id
    )
    db.add(db_subscription)
    db.commit()
    db.refresh(db_subscription)
    return db_subscription

@app.get("/api/subscriptions/{user_email}")
def get_user_subscription(user_email: str, db: Session = Depends(get_db)):
    email_normalized = user_email.lower().strip()
    subscription = db.query(models.UserSubscription).filter(
        func.lower(models.UserSubscription.user_email) == email_normalized,
        models.UserSubscription.status == "active"
    ).first()
    
    if not subscription:
        # Return default free plan
        return {
            "plan_name": "free",
            "plan_display_name": "Market Explorer",
            "billing_cycle": "monthly",
            "price": 0,
            "currency": "USD",
            "status": "active",
            "max_analyses": 5,
            "features": {
                "advancedFeatures": False,
                "prioritySupport": False,
                "exportToPdf": False,
                "apiAccess": False
            }
        }
    
    return subscription

@app.put("/api/subscriptions/{subscription_id}")
def update_subscription(subscription_id: int, update: SubscriptionUpdate, db: Session = Depends(get_db)):
    """Update subscription status or details"""
    subscription = db.query(models.UserSubscription).filter(
        models.UserSubscription.id == subscription_id
    ).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    if update.status:
        subscription.status = update.status
    if update.subscription_end:
        subscription.subscription_end = update.subscription_end
    if update.max_analyses is not None:
        subscription.max_analyses = update.max_analyses
    if update.features:
        subscription.features = update.features
    
    db.commit()
    db.refresh(subscription)
    return subscription

@app.delete("/api/subscriptions/{subscription_id}")
def cancel_subscription(subscription_id: int, db: Session = Depends(get_db)):
    """Cancel a subscription"""
    subscription = db.query(models.UserSubscription).filter(
        models.UserSubscription.id == subscription_id
    ).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    subscription.status = "cancelled"
    subscription.subscription_end = models.func.now()
    db.commit()
    
    return {"message": "Subscription cancelled successfully"}

# Payment History Endpoints
@app.post("/api/payments")
def create_payment_record(payment: PaymentCreate, db: Session = Depends(get_db)):
    """Create a payment record"""
    email_normalized = payment.user_email.lower().strip()
    db_payment = models.PaymentHistory(
        user_email=email_normalized,
        subscription_id=payment.subscription_id,
        razorpay_payment_id=payment.razorpay_payment_id,
        razorpay_order_id=payment.razorpay_order_id,
        amount=payment.amount,
        currency=payment.currency,
        status=payment.status,
        payment_method=payment.payment_method,
        plan_name=payment.plan_name,
        billing_cycle=payment.billing_cycle,
        failure_reason=payment.failure_reason
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

@app.get("/api/payments/{user_email}")
def get_payment_history(user_email: str, limit: int = 50, db: Session = Depends(get_db)):
    """Get payment history for a user"""
    payments = db.query(models.PaymentHistory).filter(
        func.lower(models.PaymentHistory.user_email) == user_email.lower()
    ).order_by(models.PaymentHistory.payment_date.desc()).limit(limit).all()
    return payments

@app.put("/api/payments/{payment_id}")
def update_payment(payment_id: int, update: PaymentUpdate, db: Session = Depends(get_db)):
    """Update payment status"""
    payment = db.query(models.PaymentHistory).filter(
        models.PaymentHistory.id == payment_id
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    if update.status:
        payment.status = update.status
    if update.failure_reason:
        payment.failure_reason = update.failure_reason
    if update.refund_amount:
        payment.refund_amount = update.refund_amount
        payment.refund_date = models.func.now()
    
    db.commit()
    db.refresh(payment)
    return payment

# Enhanced user profile with subscription info
@app.get("/api/users/{email}/profile")
def get_user_profile_with_subscription(email: str, db: Session = Depends(get_db)):
    """Get complete user profile with subscription and payment info"""
    email_normalized = email.lower().strip()
    user = db.query(models.User).filter(func.lower(models.User.email) == email_normalized).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get current subscription
    subscription = db.query(models.UserSubscription).filter(
        func.lower(models.UserSubscription.user_email) == email_normalized,
        models.UserSubscription.status == "active"
    ).first()
    
    # Get recent payments
    payments = db.query(models.PaymentHistory).filter(
        func.lower(models.PaymentHistory.user_email) == email_normalized
    ).order_by(models.PaymentHistory.payment_date.desc()).limit(10).all()
    
    # Get analysis count
    analysis_count = db.query(models.SearchHistory).filter(
        func.lower(models.SearchHistory.user_email) == email_normalized
    ).count()
    
    return {
        "user": user,
        "subscription": subscription,
        "recent_payments": payments,
        "analysis_count": analysis_count
    }

# Helper function to create notifications for business events
def create_business_notification(db: Session, user_email: str, event_type: str, **kwargs):
    """Helper function to create notifications for various business events"""
    notifications_map = {
        "analysis_complete": {
            "type": "analysis",
            "title": "Market Analysis Complete",
            "message": f"Your analysis for {kwargs.get('location', 'your area')} is ready with new insights",
            "priority": "high",
            "action_url": "/dashboard"
        },
        "payment_success": {
            "type": "payment",
            "title": "Payment Successful",
            "message": f"Your {kwargs.get('plan_name', 'subscription')} has been activated successfully",
            "priority": "high",
            "action_url": "/dashboard"
        },
        "market_opportunity": {
            "type": "market",
            "title": "New Market Opportunity",
            "message": f"High-potential opportunity detected: {kwargs.get('business_type', 'Business')} in {kwargs.get('location', 'your area')}",
            "priority": "medium",
            "action_url": "/dashboard"
        },
        "subscription_expiry": {
            "type": "alert",
            "title": "Subscription Expiring Soon",
            "message": f"Your subscription expires in {kwargs.get('days', 7)} days. Renew to continue accessing premium features",
            "priority": "urgent",
            "action_url": "/acquisition-tiers"
        }
    }
    
    if event_type in notifications_map:
        notification_data = notifications_map[event_type]
        db_notification = models.Notification(
            user_email=user_email,
            type=notification_data["type"],
            title=notification_data["title"],
            message=notification_data["message"],
            priority=notification_data["priority"],
            action_url=notification_data["action_url"],
            notification_metadata=kwargs
        )
        db.add(db_notification)
        db.commit()
        return db_notification
    return None
