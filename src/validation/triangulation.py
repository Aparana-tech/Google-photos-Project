import sys
import os
from collections import defaultdict

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.client import get_raw_collection, get_insights_collection

def triangulate_insights():
    raw_collection = get_raw_collection()
    insights_collection = get_insights_collection()
    
    pattern_sources = defaultdict(set)
    insight_mappings = defaultdict(list)
    
    for insight in insights_collection.data:
        if insight.get("is_validated"):
            original_id = insight.get("original_id") or insight.get("id")
            raw_doc = raw_collection.find_one("id", original_id)
            if not raw_doc:
                continue
                
            source = raw_doc.get("source", "unknown")
            failure_state = insight.get("failure_state")
            deficit = insight.get("metadata_deficit", [""])[0].lower().strip()
            
            key = (failure_state, deficit)
            pattern_sources[key].add(source)
            insight_mappings[key].append(insight)
        
    triangulated_count = 0
    for key, sources in pattern_sources.items():
        if len(sources) > 1:
            insights = insight_mappings[key]
            for ins in insights:
                ins["validation_source"] = "llm_evaluator_and_triangulated"
                triangulated_count += 1
            print(f"Triangulated pattern: {key} found across {sources}")
            
    insights_collection.save_all()
    print(f"Triangulation complete. {triangulated_count} insights successfully cross-referenced.")

if __name__ == "__main__":
    print("Starting cross-source triangulation...")
    triangulate_insights()
