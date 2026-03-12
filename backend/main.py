import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import requests
from duckduckgo_search import DDGS

from sqlalchemy.orm import Session
from database import engine, get_db
import models

load_dotenv()

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Business Recommendation API", description="API for AI Business Recommendation Tool")

# Configure CORS
frontend_url = os.getenv("FRONTEND_URL", "https://trendai-ui.onrender.com").rstrip("/")
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://trendai-ui.onrender.com",
    frontend_url,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(set([o for o in origins if o])),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

POLLINATION_API_KEY = os.getenv("POLLINATION_API_KEY")

class UserSync(BaseModel):
    email: str
    name: str
    image_url: str | None = None

class UserUpdate(BaseModel):
    name: str
    bio: str | None = None
    phone: str | None = None
    image_url: str | None = None

class RecommendationRequest(BaseModel):
    area: str
    user_email: str | None = None
    language: str | None = "English"

class RoadmapRequest(BaseModel):
    area: str
    title: str
    description: str
    language: str | None = "English"

@app.get("/")
def read_root():
    return {"message": "Welcome to the Business Recommendation API"}

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

class UserSync(BaseModel):
    email: str
    name: str

@app.post("/api/users/sync")
def sync_user(user: UserSync, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user:
        db_user = models.User(email=user.email, name=user.name, image_url=user.image_url)
        db.add(db_user)
        db.commit()
    elif user.image_url and not db_user.image_url:
        db_user.image_url = user.image_url
        db.commit()
    return {"status": "ok"}

@app.get("/api/users/{email}")
def get_user_profile(email: str, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.put("/api/users/{email}")
def update_user_profile(email: str, user_update: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.name = user_update.name
    db_user.bio = user_update.bio
    db_user.phone = user_update.phone
    db_user.image_url = user_update.image_url
    
    db.commit()
    db.refresh(db_user)
    return db_user

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

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
