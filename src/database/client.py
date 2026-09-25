import json
import os

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data")
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

RAW_FEEDBACK_FILE = os.path.join(DATA_DIR, "raw_feedback.json")
INSIGHTS_FILE = os.path.join(DATA_DIR, "processed_insights.json")

def load_data(filepath):
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r') as f:
        try:
            return json.load(f)
        except:
            return []

def save_data(filepath, data):
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2, default=str)

class JSONCollection:
    def __init__(self, filepath):
        self.filepath = filepath
        self.data = load_data(filepath)

    def insert_one(self, doc):
        self.data.append(doc)
        save_data(self.filepath, self.data)
        
    def find_one(self, key, value):
        for item in self.data:
            if key in item and item[key] == value:
                return item
            # handle nested keys like metadata.reviewId
            if "." in key:
                parts = key.split(".")
                if parts[0] in item and parts[1] in item[parts[0]]:
                    if item[parts[0]][parts[1]] == value:
                        return item
        return None

    def save_all(self):
        save_data(self.filepath, self.data)

def get_raw_collection():
    return JSONCollection(RAW_FEEDBACK_FILE)

def get_insights_collection():
    return JSONCollection(INSIGHTS_FILE)
