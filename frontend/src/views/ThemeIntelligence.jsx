import React, { useState, useEffect } from 'react';
import './ThemeIntelligence.css';

const OPPORTUNITIES = {
  "Temporal Confusion": {
    action: "Implement Event-Based Semantic Timeline",
    details: "Allow users to search using relative time ('last winter') and event anchors ('during Diwali') instead of requiring exact chronological dates."
  },
  "Spatial Disorientation": {
    action: "Implement Contextual Landmark Mapping",
    details: "Allow searches for implicit locations ('that small cafe') by correlating visual terrain and weather patterns without strict GPS geotags."
  },
  "Context Loss": {
    action: "Deploy Multi-Modal Keyword Extraction",
    details: "Extract generic visual descriptions ('red jacket', 'medicine bottle') to create fallback semantic search paths when exact keywords are forgotten."
  },
  "System Frustration": {
    action: "Automated Album Curation (Chapters)",
    details: "Eliminate manual folder organization by having the AI automatically group photos into 'Life Chapters' or 'Trips'."
  }
};

const ThemeIntelligence = () => {
  const [matrixData, setMatrixData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/insights/matrix');
        const json = await res.json();
        setMatrixData(json.matrix || []);
      } catch (err) {
        console.error("Failed to fetch matrix data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatrix();
  }, []);

  if (loading) {
    return <div className="theme-loading">Loading NLP Intelligence Data...</div>;
  }

  const topTheme = matrixData[0];
  const topOpportunity = topTheme ? OPPORTUNITIES[topTheme.failure_state] || OPPORTUNITIES["Temporal Confusion"] : null;

  return (
    <div className="theme-page">
      <div className="theme-header">
        <h2 className="page-title">Theme Intelligence Core</h2>
        <p className="page-subtitle">Deep dive into semantic failure states and actionable product opportunities</p>
      </div>

      {/* Hero Insight Banner */}
      {topTheme && topOpportunity && (
        <div className="hero-banner panel">
          <div className="hero-content">
            <span className="hero-badge text-yellow">Highest Impact Opportunity</span>
            <h3 className="hero-title">{topTheme.failure_state}</h3>
            <p className="hero-desc">{topTheme.description}</p>
            
            {topTheme.failure_state === "Temporal Confusion" && (
              <div className="temporal-breakdown" style={{ marginBottom: '20px' }}>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '14px', marginBottom: '8px' }}>The 4 Sub-Pillars of Temporal Confusion:</h4>
                <ul style={{ color: 'var(--text-secondary)', fontSize: '13px', paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li style={{ color: '#00e676', fontWeight: 'bold' }}>
                    <span style={{ marginRight: '6px' }}>🎯</span>
                    1. Event Anchoring (Life Chapters): <span style={{ fontWeight: 'normal', color: 'var(--text-primary)' }}>"During my Goa trip..." (Primary Opportunity)</span>
                  </li>
                  <li style={{ color: '#00e676', fontWeight: 'bold' }}>
                    <span style={{ marginRight: '6px' }}>🎯</span>
                    2. Relative Time: <span style={{ fontWeight: 'normal', color: 'var(--text-primary)' }}>"Sometime last winter..." (Secondary Opportunity)</span>
                  </li>
                  <li><strong>3. Exact Dates/Years:</strong> "Was it in 2018 or 2019?"</li>
                  <li><strong>4. Sequence of Events:</strong> "Did this happen before or after the wedding?"</li>
                </ul>
              </div>
            )}
            
            <div className="opportunity-box">
              <h4>Recommended Product Action: {topOpportunity.action}</h4>
              <p>{topOpportunity.details}</p>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-circle">
              <span className="stat-num">{topTheme.frequency}</span>
              <span className="stat-label">User Reports</span>
            </div>
          </div>
        </div>
      )}

      {/* Cluster Deep Dive Grid */}
      <h3 className="section-title">All Semantic Clusters</h3>
      <div className="cluster-grid">
        {matrixData.map((cluster, idx) => {
          const opt = OPPORTUNITIES[cluster.failure_state];
          return (
            <div key={idx} className="cluster-card panel">
              <div className="cluster-header">
                <span className="cluster-name">{cluster.failure_state}</span>
                <span className="cluster-freq">{cluster.frequency} reports</span>
              </div>
              <p className="cluster-desc">{cluster.description}</p>
              
              {opt && (
                <div className="mini-opportunity">
                  <span className="opt-icon">💡</span> {opt.action}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeIntelligence;
