import os
import sys
import uuid
import datetime
from serpapi import GoogleSearch

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.client import get_raw_collection

def scrape_app_store():
    print("Scraping App Store reviews via SerpApi for Google Photos...")
    
    # User's SerpApi Key
    API_KEY = "o7cMT1wPmbRyL4ZaLwNJMop9"
    
    params = {
      "engine": "apple_app_store",
      "app_id": "962194608", # Google Photos iOS App ID
      "country": "us",
      "sort": "recent",
      "api_key": API_KEY
    }

    try:
        search = GoogleSearch(params)
        results = search.get_dict()
        reviews = results.get("reviews", [])
    except Exception as e:
        print(f"Error fetching from SerpApi: {e}")
        return

    collection = get_raw_collection()
    inserted_count = 0

    for review in reviews:
        score = review.get("rating", 5)
        
        # Only ingest negative reviews (1, 2, or 3 stars)
        if score <= 3:
            content = review.get("text", "")
            title = review.get("title", "")
            
            doc = {
                "id": str(uuid.uuid4()),
                "source": "app_store",
                "content": f"Title: {title}\n\n{content}",
                "timestamp": str(review.get("date", datetime.datetime.now())),
                "metadata": {
                    "score": score,
                    "reviewId": review.get("id", str(uuid.uuid4()))
                },
                "normalized": False,
                "classified": False
            }
            
            exists = collection.find_one("metadata.reviewId", doc["metadata"]["reviewId"])
            if not exists:
                collection.insert_one(doc)
                inserted_count += 1

    print(f"App Store scraping complete. Inserted {inserted_count} negative reviews into data/raw_feedback.json")

if __name__ == "__main__":
    scrape_app_store()
