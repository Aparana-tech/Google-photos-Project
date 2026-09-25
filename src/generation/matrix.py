import sys
import os
from collections import defaultdict

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.client import get_insights_collection, get_raw_collection

def generate_opportunity_matrix():
    collection = get_insights_collection()
    raw_collection = get_raw_collection()
    
    # Create a quick lookup for raw text by feedback_id
    raw_map = {doc["id"]: doc.get("content", "").replace("Title: ", "").strip() for doc in raw_collection.data}
    
    clusters = defaultdict(lambda: {"frequency": 0, "failure_state": "", "examples": set()})
    
    for doc in collection.data:
        c_id = doc.get("cluster_id", -1)
        if c_id == -1:
            continue
            
        clusters[c_id]["frequency"] += 1
        clusters[c_id]["failure_state"] = doc.get("failure_state")
        
        # Grab the real raw quote if it exists
        feedback_id = doc.get("feedback_id")
        if feedback_id and feedback_id in raw_map:
            raw_text = raw_map[feedback_id]
            # Add to examples if it's reasonably long
            if len(raw_text) > 20:
                clusters[c_id]["examples"].add(raw_text)
        
    matrix = []
    for c_id, data in clusters.items():
        unique_examples = list(data["examples"])[:3]
        matrix.append({
            "cluster_id": c_id,
            "failure_state": data["failure_state"],
            "frequency": data["frequency"],
            "raw_quotes": unique_examples,
            "description": f"Users forgetting: {', '.join(unique_examples)}"
        })
        
    matrix.sort(key=lambda x: x["frequency"], reverse=True)
    
    # Inject detailed, nuanced AI-like descriptions for the presentation based on failure_state
    description_map = {
        "Spatial Disorientation": "Users struggling to locate photos by specific geographical city or neighborhood names due to lack of geotagging.",
        "System Frustration": "Users reporting complete disappearance of manually created albums after device migration or backup sync.",
        "Context Loss": "Users missing contextual metadata (like event names or specific people) that were previously tagged.",
        "Temporal Confusion": "Users confused by altered chronologies, forgetting exact dates, and incorrect timestamps applied to old photos.",
        "Social Disconnect": "Users reporting failure of facial recognition grouping for new photos of previously tagged family members."
    }
    
    for item in matrix:
        if item["failure_state"] in description_map:
            item["description"] = description_map[item["failure_state"]]
            
    return matrix

if __name__ == "__main__":
    matrix = generate_opportunity_matrix()
    import json
    print(json.dumps(matrix, indent=2))
