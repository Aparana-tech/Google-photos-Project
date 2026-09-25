import sys
import os
import re

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.client import get_raw_collection

def normalize_data():
    collection = get_raw_collection()
    normalized_count = 0
    
    for doc in collection.data:
        if not doc.get("normalized", False):
            original_content = doc.get("content", "")
            
            clean_text = re.sub(r'<[^>]+>', '', original_content)
            clean_text = re.sub(r'\s+', ' ', clean_text).strip()
            
            doc["content"] = clean_text
            doc["normalized"] = True
            normalized_count += 1
            
    collection.save_all()
    print(f"Normalization complete. Normalized {normalized_count} documents in data/raw_feedback.json.")

if __name__ == "__main__":
    print("Starting data normalization...")
    normalize_data()
