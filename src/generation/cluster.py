import sys
import os
import pandas as pd
from sentence_transformers import SentenceTransformer
import hdbscan

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.client import get_insights_collection

class InsightClusterer:
    def __init__(self):
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')

    def cluster_insights(self):
        collection = get_insights_collection()
        
        data = []
        for doc in collection.data:
            if doc.get("is_validated"):
                deficit = doc.get("metadata_deficit", [""])[0]
                if deficit and deficit != "Unknown":
                    data.append({
                        "id": doc["id"],
                        "failure_state": doc.get("failure_state"),
                        "text_to_cluster": deficit
                    })
                
        if len(data) < 5:
            print("Not enough validated data to perform meaningful clustering.")
            return []
            
        df = pd.DataFrame(data)
        
        print("Generating embeddings...")
        embeddings = self.embedder.encode(df['text_to_cluster'].tolist())
        
        print("Running HDBSCAN clustering...")
        clusterer = hdbscan.HDBSCAN(min_cluster_size=2, metric='euclidean')
        df['cluster_id'] = clusterer.fit_predict(embeddings)
        
        for index, row in df.iterrows():
            for doc in collection.data:
                if doc["id"] == row['id']:
                    doc["cluster_id"] = int(row['cluster_id'])
                    break
            
        collection.save_all()
        print(f"Clustering complete. Identified {df['cluster_id'].nunique()} clusters.")
        return df

if __name__ == "__main__":
    clusterer = InsightClusterer()
    clusterer.cluster_insights()
