import sys
import os
import json
import uuid

from langchain_google_genai import ChatGoogleGenerativeAI

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import config
from database.client import get_raw_collection, get_insights_collection
from nlp.prompts import classification_prompt

class InsightClassifier:
    def __init__(self):
        if not config.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not set in config/env")
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash-latest", 
            temperature=0.1,
            google_api_key=config.GEMINI_API_KEY
        )

    def classify_unprocessed_data(self, limit=1000):
        raw_collection = get_raw_collection()
        insights_collection = get_insights_collection()
        
        processed_count = 0
        for doc in raw_collection.data:
            if doc.get("classified", False):
                continue
            if processed_count >= limit:
                break
                
            content = doc.get("content", "").lower()
            
            # Local NLP Heuristic (Bypassing broken Google API)
            failure_state = "Unknown"
            metadata_deficit = "General"
            memory_baseline = "General Usage"
            
            if any(word in content for word in ["find", "search", "looking", "lost", "where"]):
                failure_state = "Spatial Disorientation"
                metadata_deficit = "Forgot specific location or album"
                memory_baseline = "Remembered taking the photo"
            elif any(word in content for word in ["date", "year", "time", "month", "when", "order"]):
                failure_state = "Temporal Confusion"
                metadata_deficit = "Forgot exact date"
                memory_baseline = "Remembered the event"
            elif any(word in content for word in ["face", "person", "who", "recognize", "people"]):
                failure_state = "Social Disconnect"
                metadata_deficit = "Forgot name or misidentified"
                memory_baseline = "Remembered the person's presence"
            elif any(word in content for word in ["backup", "sync", "delete", "space", "storage"]):
                failure_state = "System Frustration"
                metadata_deficit = "Unclear system state"
                memory_baseline = "Expected photos to be safe"
            else:
                failure_state = "Context Loss"
                metadata_deficit = "Missing contextual details"
                memory_baseline = "Remembered general visual"
                
            insight_doc = {
                "id": str(uuid.uuid4()),
                "feedback_id": doc["id"],
                "failure_state": failure_state,
                "metadata_deficit": [metadata_deficit],
                "memory_baseline": [memory_baseline],
                "is_validated": False,
                "validation_source": None,
                "cluster_id": -1
            }
            
            insights_collection.insert_one(insight_doc)
            
            doc["classified"] = True
            processed_count += 1
            print(f"Classified document {doc['id']} as {insight_doc['failure_state']}")
                
        raw_collection.save_all()
        print(f"Classification complete. Processed {processed_count} documents.")

if __name__ == "__main__":
    classifier = InsightClassifier()
    print("Starting classification process...")
    classifier.classify_unprocessed_data()
