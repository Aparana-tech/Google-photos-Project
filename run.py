import subprocess
import sys

def run_script(script_path):
    print(f"\n{'='*50}\nRunning: {script_path}\n{'='*50}")
    result = subprocess.run([sys.executable, script_path])
    if result.returncode != 0:
        print(f"\n❌ Error running {script_path}. Stopping pipeline.")
        sys.exit(1)
    print("✅ Success!")

def main():
    print("🚀 Starting Google Photos Discovery Engine Pipeline...\n")
    
    # 1. Ingestion
    run_script("src/ingestion/play_store.py")
    run_script("src/ingestion/reddit_api.py")
    run_script("src/ingestion/google_community.py")
    run_script("src/ingestion/app_store.py")
    run_script("src/ingestion/normalizer.py")
    
    # 2. NLP Classification
    run_script("src/nlp/classifier.py")
    
    # 3. Validation
    run_script("src/validation/evaluator.py")
    run_script("src/validation/triangulation.py")
    
    # 4. Generation/Clustering
    run_script("src/generation/cluster.py")
    
    print("\n🎉 Pipeline Complete! The data is now ready.")
    print("To view the results, start the servers:")
    print("  1. Terminal 1: python src/api/routes.py")
    print("  2. Terminal 2: cd frontend && npm run dev")

if __name__ == "__main__":
    main()
