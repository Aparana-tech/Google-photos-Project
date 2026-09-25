import React from 'react';
import './SentimentDistribution.css';

const SentimentDistribution = ({ topFailureState = "System Frustration" }) => {
  return (
    <div className="sentiment-container panel">
      <div className="sentiment-header">
        <h3 className="section-title">Sentiment Distribution</h3>
        <p className="section-subtitle">How users feel about their overall experience</p>
      </div>

      <div className="sentiment-bars">
        <div className="sentiment-row">
          <div className="sentiment-label-row">
            <span className="sentiment-label text-green">Positive</span>
            <span className="sentiment-value">12%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill bg-green" style={{ width: '12%' }}></div>
          </div>
          <p className="sentiment-desc">Driven by successful location matching and backup reliability.</p>
        </div>

        <div className="sentiment-row">
          <div className="sentiment-label-row">
            <span className="sentiment-label text-yellow">Neutral</span>
            <span className="sentiment-value">28%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill bg-yellow" style={{ width: '28%' }}></div>
          </div>
          <p className="sentiment-desc">Driven by general browsing intent and album management.</p>
        </div>

        <div className="sentiment-row">
          <div className="sentiment-label-row">
            <span className="sentiment-label text-red">Negative</span>
            <span className="sentiment-value">60%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill bg-red" style={{ width: '60%' }}></div>
          </div>
          <p className="sentiment-desc"><strong>(52% driven by {topFailureState})</strong> and remaining by timeline confusion.</p>
        </div>
      </div>
    </div>
  );
};

export default SentimentDistribution;
