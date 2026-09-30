import json
import os
import sys

# Setup paths
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'src')))

from generation.matrix import generate_opportunity_matrix
from database.client import get_insights_collection, get_raw_collection
from datetime import datetime

os.makedirs('frontend/src/data', exist_ok=True)

print("Generating matrix...")
matrix = generate_opportunity_matrix()
with open('frontend/src/data/matrix.json', 'w') as f:
    json.dump({"matrix": matrix}, f, indent=2)

print("Generating feed...")
raw_collection = get_raw_collection()
insights_collection = get_insights_collection()
feed = []
insight_map = {insight.get("feedback_id"): insight for insight in insights_collection.data if insight.get("feedback_id")}
sorted_raw_data = sorted(
    raw_collection.data, 
    key=lambda doc: 0 if insight_map.get(doc["id"], {}).get("failure_state") == "Temporal Confusion" else 1
)

for doc in sorted_raw_data[:50]:
    insight = insight_map.get(doc["id"], {})
    score = doc.get("metadata", {}).get("score", 5)
    sentiment = "Negative" if score <= 3 else ("Positive" if score == 5 else "Neutral")
    source = doc.get("source", "unknown")
    if source == "app_store": source = "App Store"
    elif source == "play_store": source = "Play Store"
    elif source == "reddit": source = "Reddit"
    else: source = "Google Community"
    
    raw_date = doc.get("timestamp", "")
    try:
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

with open('frontend/src/data/feed.json', 'w') as f:
    json.dump({"feed": feed}, f, indent=2)

print("Done! Data exported to frontend/src/data/")
