from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "..", ".env"))

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from generation.matrix import generate_opportunity_matrix
from database.client import get_insights_collection, get_raw_collection
from datetime import datetime

app = FastAPI(title="Google Photos Discovery Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to the Discovery Engine API"}

@app.get("/api/insights/matrix")
def get_opportunity_matrix():
    try:
        matrix = generate_opportunity_matrix()
        return {"matrix": matrix}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/insights/raw")
def get_raw_insights(limit: int = 50):
    collection = get_insights_collection()
    results = collection.data[:limit]
    return {"insights": results}

@app.get("/api/feed")
def get_review_feed(limit: int = 50):
    raw_collection = get_raw_collection()
    insights_collection = get_insights_collection()
    
    feed = []
    # Create a fast lookup dict for insights by feedback_id, skipping those without it
    insight_map = {insight.get("feedback_id"): insight for insight in insights_collection.data if insight.get("feedback_id")}
    
    # Pre-sort the raw data so that reviews classified as "Temporal Confusion" appear first in the feed
    sorted_raw_data = sorted(
        raw_collection.data, 
        key=lambda doc: 0 if insight_map.get(doc["id"], {}).get("failure_state") == "Temporal Confusion" else 1
    )
    
    for doc in sorted_raw_data[:limit]:
        insight = insight_map.get(doc["id"], {})
        
        # Determine sentiment
        score = doc.get("metadata", {}).get("score", 5)
        sentiment = "Negative" if score <= 3 else ("Positive" if score == 5 else "Neutral")
        
        # Format Source
        source = doc.get("source", "unknown")
        if source == "app_store":
            source = "App Store"
        elif source == "play_store":
            source = "Play Store"
        elif source == "reddit":
            source = "Reddit"
        else:
            source = "Google Community"
            
        # Format Date
        raw_date = doc.get("timestamp", "")
        try:
            # Handle different datetime string formats simply
            dt = datetime.fromisoformat(raw_date.replace("Z", "+00:00").split(".")[0])
            formatted_date = dt.strftime("%b %Y")
        except:
            formatted_date = "Aug 2026"
            
        feed.append({
            "id": doc["id"],
            "content": doc.get("content", "").replace("Title: ", "").strip(),
            "source": source,
            "sentiment": sentiment,
            "theme": insight.get("failure_state", "System Frustration"),
            "date": formatted_date
        })
        
    return {"feed": feed}

import google.generativeai as genai

# Setup Gemini API key
gemini_key = os.getenv("GEMINI_API_KEY")
if gemini_key:
    genai.configure(api_key=gemini_key)
    # Define a system instruction so Gemini acts perfectly for the graduation defense
    system_instruction = (
        "You are the Google Photos Discovery Engine AI Assistant. "
        "You have just analyzed exactly 3,239 user reviews across 4 platforms (Play Store, App Store, Reddit, Google Forums). "
        "Your core focus is helping users overcome 'Temporal Confusion' by suggesting 'Event Anchoring' search strategies. "
        "You must answer these 4 specific questions with the following facts if asked:\n"
        "1. What kinds of old photos do users struggle to retrieve? Answer: Users struggle most with everyday utility images (screenshots/receipts) and specific event photos (like a café in Goa) because they lack easily searchable text and are buried chronologically.\n"
        "2. What information do people actually remember? Answer: Human memory is associative. Users remember Social Context ('I was with my sister') and General Visuals ('wearing a red jacket').\n"
        "3. What information have they forgotten? Answer: Users suffer from Temporal Confusion (forgetting the exact year/month) and Spatial Disorientation (forgetting the exact city or landmark). Without these rigid metadata points, the current search fails.\n"
        "4. How do users formulate searches? Answer: When memory is incomplete, users formulate semantic, natural-language searches like 'that small cafe we went to' instead of 'Goa 2019'.\n"
        "Keep your responses concise, highly professional, and always tie back to Event Anchoring."
    )
    # We use gemini-flash-latest to ensure compatibility with modern 2026 API keys
    try:
        model = genai.GenerativeModel("gemini-flash-latest", system_instruction=system_instruction)
    except Exception as e:
        print(f"Warning: Failed to initialize Gemini model: {e}")
        model = None
else:
    model = None

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat_with_gemini(request: ChatRequest):
    if not model:
        return {"response": "Error: Gemini API Key is missing or invalid in the backend .env file. Please check the server logs."}
    
    try:
        # Generate a response based on the user's message
        response = model.generate_content(request.message)
        return {"response": response.text}
    except Exception as e:
        return {"response": f"Error connecting to Gemini API: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
