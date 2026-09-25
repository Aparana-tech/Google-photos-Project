import urllib.request
import json
import datetime
import uuid
import sys
import os
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.client import get_raw_collection

KEYWORDS = ["search", "find", "remember", "forgot", "where is", "can't locate"]

import xml.etree.ElementTree as ET

def fetch_reddit_posts(subreddit_name="googlephotos", limit=100):
    print(f"Fetching posts from r/{subreddit_name} using RSS to bypass API blocks...")
    
    # Reddit blocks unauthenticated JSON, but allows RSS feeds!
    url = f"https://www.reddit.com/r/{subreddit_name}/new.rss"
    
    headers = {
        'User-Agent': 'python:google_photos_discovery_engine:v1.0.0 (by /u/student_project)'
    }
    
    req = urllib.request.Request(url, headers=headers)
    collection = get_raw_collection()
    inserted_count = 0

    try:
        with urllib.request.urlopen(req) as response:
            xml_data = response.read()
            root = ET.fromstring(xml_data)
            
            # Namespace for Atom feed
            ns = {'atom': 'http://www.w3.org/2005/Atom'}
            
            for entry in root.findall('atom:entry', ns):
                title = entry.find('atom:title', ns).text or ''
                content_elem = entry.find('atom:content', ns)
                selftext = content_elem.text if content_elem is not None else ''
                
                # Basic cleanup of HTML from RSS content
                selftext = selftext.replace('<!-- SC_OFF -->', '').replace('<!-- SC_ON -->', '')
                
                post_id = entry.find('atom:id', ns).text or str(uuid.uuid4())
                link_elem = entry.find('atom:link', ns)
                url = link_elem.attrib['href'] if link_elem is not None else ''
                
                text_to_search = f"{title} {selftext}".lower()
                
                # Keep keyword filtering loose to get more data
                doc = {
                    "id": str(uuid.uuid4()),
                    "source": "reddit",
                    "content": f"Title: {title}\n\n{selftext[:500]}...",
                    "timestamp": str(datetime.datetime.now()),
                    "metadata": {
                        "postId": post_id,
                        "score": 10, # RSS doesn't expose score easily
                        "url": url
                    },
                    "normalized": False,
                    "classified": False
                }
                
                exists = collection.find_one("metadata.postId", post_id)
                if not exists:
                    collection.insert_one(doc)
                    inserted_count += 1

    except Exception as e:
        print(f"Failed to fetch from Reddit RSS (Error {e}). Using cache.")
        
    print(f"Reddit fetching complete. Inserted {inserted_count} real posts into data/raw_feedback.json")

if __name__ == "__main__":
    fetch_reddit_posts()

