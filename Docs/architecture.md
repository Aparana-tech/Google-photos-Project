# System Architecture: AI-Powered Discovery Engine

This document details the architecture for the AI-powered discovery engine, designed to analyze public discourse and user feedback regarding Google Photos retrieval experiences, as outlined in the core problem statement.

## 1. High-Level Architecture

The system is designed as a scalable, multi-layered data processing pipeline. It moves unstructured public data through ingestion, natural language processing, validation, and finally, insight generation.

```mermaid
graph TD
    subgraph Data Sources
        PS[Play Store]
        AS[App Store]
        RD[Reddit]
        SM[Social Media]
        YT[YouTube]
    end

    subgraph 1. Data Ingestion Layer
        API[API Connectors / Scrapers]
        Norm[Data Normalizer]
        RawDB[(Raw Text Staging)]
    end

    subgraph 2. NLP & Processing Layer
        PreProc[Text Preprocessing]
        LLMClass[LLM Classification Engine]
    end

    subgraph 3. Insight Validation Layer
        Ext[Tier 1: Extractive LLM]
        Eval[Tier 2: Evaluator LLM]
        Cross[Cross-Source Triangulation]
    end

    subgraph 4. Insight Generation Layer
        Cluster[Clustering Engine]
        Matrix[Opportunity Matrix Generator]
        Dash[(Insight Repository)]
    end

    Data Sources --> API
    API --> Norm
    Norm --> RawDB
    RawDB --> PreProc
    PreProc --> LLMClass
    LLMClass --> Ext
    Ext --> Eval
    Eval --> Cross
    Cross --> Cluster
    Cluster --> Matrix
    Matrix --> Dash
```

## 2. Layer Details

### 2.1 Data Ingestion Layer
**Purpose:** To aggregate unstructured text from diverse public sources to ensure a wide representation of user experiences.
*   **Connectors:** Specific API integrations for structured platforms (Reddit, YouTube, App Stores) and scrapers for public forums.
*   **Data Normalization:** Standardization of incoming data (e.g., standardizing timestamps, mapping platform tags, stripping HTML) into a unified schema.
*   **Storage:** A high-throughput staging database (e.g., a NoSQL database like MongoDB or Elasticsearch) to store raw unstructured text before processing.

### 2.2 NLP & Processing Layer
**Purpose:** To parse and classify raw text into defined memory retrieval failure states.
*   **Text Preprocessing:** Tokenization, noise removal (spam filtering), and language detection/translation.
*   **LLM Classification Engine:** Utilizes Large Language Models to categorize text into specific failure states based on the core problem statement:
    *   **Temporal Confusion:** (e.g., "I know it was summer, but not the year.")
    *   **Spatial Ambiguity:** (e.g., "It was a beach, but I don't remember which state.")
    *   **Sensory Mismatch:** (e.g., "I searched for a red car, but it was actually maroon.")
*   **Feature Extraction:** Extracts the specific "Metadata Deficits" (what is forgotten) and the "Memory Retention Baseline" (what is remembered).

### 2.3 Insight Validation Layer (Quality Control)
**Purpose:** To verify and validate extracted insights to prevent hallucinations and ensure enterprise-grade reliability.
*   **Dual-Model Verification Pipeline:**
    *   **Tier 1 (Extractive Model):** Strictly extracts raw user frustration quotes and claims regarding their "Query Formulation Process".
    *   **Tier 2 (Evaluator Model):** Validates that Tier 1's synthesis correctly categorizes the "forgotten" vs. "remembered" data points without hallucinating intent or drawing conclusions not present in the source text.
*   **Cross-Source Triangulation Node:** An algorithmic check that validates a "Subject Matter Friction" only if the behavioral pattern is observed across multiple, independent platforms (e.g., corroborating a Reddit complaint with similar Play Store reviews).

### 2.4 Insight Generation Layer
**Purpose:** To aggregate validated data and generate actionable, evidence-backed product opportunities for the Core Experience team.
*   **Clustering Engine:** Groups similar, validated retrieval problems using embeddings and clustering algorithms (e.g., HDBSCAN or K-Means) to find statistically significant pain points.
*   **Opportunity Matrix Generator:** Maps the clustered problems against frequency (volume of complaints) and severity (level of user frustration) to prioritize actionable interventions.
*   **Output / Reporting:** Generates the "Evidence-Backed Opportunity Mapping"—a structured dataset or dashboard that informs the product roadmap (e.g., justifying the need for conversational search agents or associative filtering UIs).

## 3. Expected Data Flow Execution
1.  **Ingest:** The system continuously pulls raw data from public sources into the staging environment.
2.  **Process:** Batches of text are fed to the NLP layer, where initial categorizations of memory breakdown are tagged.
3.  **Validate:** The dual-LLM setup verifies the tags against the raw quotes, and the triangulation node filters out isolated anomalies.
4.  **Synthesize:** The surviving, high-confidence data points are clustered to reveal the core structural problems in human memory retrieval.
5.  **Output:** The prioritized matrix is updated for product leadership review.
