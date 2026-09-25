from google_play_scraper import Sort, reviews
import datetime
import uuid
import sys
import os
import ssl

# Fix for macOS Python SSL Certificate errors
ssl._create_default_https_context = ssl._create_unverified_context

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.client import get_raw_collection

KEYWORDS = ["search", "find", "can't remember", "forgot", "searching", "locating", "memory"]

def scrape_play_store(app_id="com.google.android.apps.photos", target_count=1354):
    print(f"Scraping up to {target_count} negative reviews for {app_id}...")
    
    # We will fetch a large batch and filter
    result, continuation_token = reviews(
        app_id,
        lang='en',
        country='us',
        sort=Sort.NEWEST,
        count=5000 # Fetch a large batch to filter down
    )

    collection = get_raw_collection()
    inserted_count = 0

    for review in result:
        if inserted_count >= target_count:
            break
            
        score = review.get('score', 5)
        
        # Ingest all 1, 2, and 3 star reviews as "complaints/feedback"
        if score <= 3:
            doc = {
                "id": str(uuid.uuid4()),
                "source": "play_store",
                "content": review.get('content'),
                "timestamp": str(review.get('at', datetime.datetime.now())),
                "metadata": {
                    "score": score,
                    "thumbsUpCount": review.get('thumbsUpCount'),
                    "reviewId": review.get('reviewId')
                },
                "normalized": False,
                "classified": False
            }
            
            exists = collection.find_one("metadata.reviewId", review.get('reviewId'))
            if not exists:
                collection.insert_one(doc)
                inserted_count += 1

    print(f"Scraping complete. Inserted {inserted_count} negative reviews into data/raw_feedback.json")

if __name__ == "__main__":
    scrape_play_store()
