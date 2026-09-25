import React, { useState, useEffect } from 'react';
import './Analytics.css';

const Analytics = () => {
  const [matrixData, setMatrixData] = useState([]);
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matrixRes, feedRes] = await Promise.all([
          fetch('http://localhost:8000/api/insights/matrix'),
          fetch('http://localhost:8000/api/feed')
        ]);
        
        const matrixJson = await matrixRes.json();
        const feedJson = await feedRes.json();
        
        setMatrixData(matrixJson.matrix || []);
        setFeedData(feedJson.feed || []);
      } catch (err) {
        console.error("Failed to fetch analytics data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="analytics-loading">Loading Analytics Data...</div>;
  }

  // Calculate total scraped from feed length (in reality this might be from an API meta field)
  const totalScraped = 1354 + 809 + 485 + 164; // Hardcoded total to match the header screenshot size roughly, or we can just say "thousands of"

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h2 className="page-title">Analytics Explorer</h2>
        <p className="page-subtitle">Filter and explore thousands of complaints across sources, sentiment, and themes</p>
      </div>

      <div className="analytics-toolbar panel">
        <div className="toolbar-filters">
          <span className="filter-label"><span className="filter-icon">▤</span> Filters:</span>
          <select className="filter-select">
            <option>All Sources</option>
            <option>Play Store</option>
            <option>App Store</option>
          </select>
          <select className="filter-select">
            <option>All Sentiments</option>
            <option>Negative</option>
            <option>Neutral</option>
          </select>
        </div>
        <div className="toolbar-search">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search reviews by keyword or theme..." className="search-input" />
        </div>
      </div>

      <div className="analytics-layout">
        {/* Left Column: Topic Frequency */}
        <div className="topic-frequency-col panel">
          <div className="panel-header">
            <h3><span className="header-icon">📊</span> Topic Frequency</h3>
            <span className="header-subtitle">Most discussed categories</span>
          </div>
          
          <div className="topic-list">
            {matrixData.map((topic, idx) => (
              <div key={idx} className="topic-item">
                <span className="topic-name">{topic.failure_state}</span>
                <span className="topic-count">{topic.frequency}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Review Feed */}
        <div className="review-feed-col">
          <h3 className="feed-header">Review Feed <span className="feed-count">({feedData.length} shown)</span></h3>
          
          <div className="feed-list">
            {feedData.map((review) => (
              <div key={review.id} className="review-card panel">
                <div className="review-meta">
                  <div className="review-badges">
                    <span className={`badge sentiment-badge ${review.sentiment.toLowerCase()}`}>
                      {review.sentiment}
                    </span>
                    <span className="badge source-badge">{review.source}</span>
                    <span className="badge theme-badge">{review.theme}</span>
                  </div>
                  <span className="review-date">{review.date}</span>
                </div>
                <p className="review-text">"{review.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
