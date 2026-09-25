# Google Photos AI Discovery Engine Detailed Implementation Plan

This document outlines the detailed step-by-step technical implementation plan for the AI-powered discovery engine, based on the `Problemstatement.md` and `architecture.md` documents.

## User Review Required
> [!IMPORTANT]
> - Please review the proposed technology stack (Python, MongoDB, FastAPI, LangChain, Google Gemini API) to ensure it aligns with your environment.
> - The plan includes setting up FastAPI endpoints to serve the matrix data. Do you also want a simple React frontend to visualize this (similar to the Nykaa dashboard), or just the backend API for now?

## Proposed Architecture & Data Schemas

### 1. Database Schema (MongoDB)
**`raw_feedback` Collection:**
- `id`: string (UUID)
- `source`: string (e.g., 'play_store', 'reddit')
- `content`: string (raw text)
- `timestamp`: datetime
- `metadata`: dict (e.g., upvotes, author)

**`processed_insights` Collection:**
- `id`: string (UUID)
- `feedback_id`: string (refers to `raw_feedback.id`)
- `failure_state`: enum ('Temporal Confusion', 'Spatial Ambiguity', 'Sensory Mismatch')
- `metadata_deficit`: list of strings
- `memory_baseline`: list of strings
- `is_validated`: boolean
- `validation_source`: string

### 2. Technology Stack
- **Backend:** Python 3.10+, FastAPI for API endpoints.
- **NLP/LLM:** Google Gemini API via LangChain for classification and validation.
- **Database:** MongoDB (using Motor for async operations).
- **Data Processing:** Pandas, Scikit-learn (HDBSCAN for clustering).

## Proposed Changes

### Phase 1: Project Setup and Data Ingestion
This phase sets up the core repository, database connections, and implements the data ingestion pipelines.

#### [NEW] `src/config.py`
- Setup environment variables loading (`MONGO_URI`, `GEMINI_API_KEY`).

#### [NEW] `src/database/client.py`
- Async MongoDB client connection using `motor`.

#### [NEW] `src/ingestion/play_store.py`
- Scraper utilizing `google-play-scraper` to pull reviews mentioning keywords like "search", "find", "can't remember".

#### [NEW] `src/ingestion/reddit_api.py`
- API client using `praw` targeting `r/googlephotos` and filtering for search-related issues.

#### [NEW] `src/ingestion/normalizer.py`
- Standardizes timestamps and structures the data to match the `raw_feedback` schema before DB insertion.

### Phase 2: NLP & Processing Layer
This phase implements the first LLM classification engine.

#### [NEW] `src/nlp/prompts.py`
- Detailed LangChain prompt templates defining "Temporal Confusion", "Spatial Ambiguity", and "Sensory Mismatch".

#### [NEW] `src/nlp/classifier.py`
- `InsightClassifier` class. Fetches unclassified data from MongoDB, batches it, and calls the Gemini API to categorize the failure states and extract the `metadata_deficit` and `memory_baseline`.

### Phase 3: Insight Validation Layer
This phase implements the dual-model verification and cross-source triangulation.

#### [NEW] `src/validation/evaluator.py`
- `ModelEvaluator` class (Tier 2 LLM). Re-reads the classification output and verifies it strictly against the raw content to prevent hallucination. Updates the `is_validated` flag in the DB.

#### [NEW] `src/validation/triangulation.py`
- Algorithmic check grouping validated insights by `failure_state` and verifying if they appear across multiple sources.

### Phase 4: Insight Generation Layer & API
This phase implements the clustering and serves the data.

#### [NEW] `src/generation/cluster.py`
- Extracts all validated `metadata_deficit` and `memory_baseline` fields.
- Uses `SentenceTransformers` for embeddings and `HDBSCAN` to cluster similar query patterns.

#### [NEW] `src/generation/matrix.py`
- Calculates frequency (cluster size) and severity to generate the final Opportunity Matrix.

#### [NEW] `src/api/routes.py`
- FastAPI routes (`GET /api/insights/matrix`, `GET /api/insights/raw`) to serve the processed data.

## Verification Plan

### Automated Tests
- Run `pytest src/tests/` focusing on data normalization logic and prompt formatting.

### Manual Verification
- Execute `python src/ingestion/play_store.py --limit 100` and check MongoDB.
- Run the classifier pipeline and manually inspect 20 classified documents for accuracy.
- Query the FastAPI endpoint `GET /api/insights/matrix` to ensure the final output is correctly formatted JSON.
