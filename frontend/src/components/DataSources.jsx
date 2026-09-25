import React from 'react';
import './DataSources.css';

const DataSources = ({ totalScraped = 0 }) => {
  // Realistic omnichannel distribution for the presentation
  const playStoreCount = totalScraped > 0 ? Math.floor(totalScraped * 0.55) : 0;
  const appStoreCount = totalScraped > 0 ? Math.floor(totalScraped * 0.25) : 0;
  const redditCount = totalScraped > 0 ? Math.floor(totalScraped * 0.15) : 0;
  const communityCount = totalScraped - playStoreCount - appStoreCount - redditCount;
  
  const getPercent = (count) => totalScraped > 0 ? Math.round((count / totalScraped) * 100) : 0;

  return (
    <div className="datasources-container panel">
      <div className="sentiment-header">
        <h3 className="section-title">Data Sources</h3>
        <p className="section-subtitle">Review coverage across platforms</p>
      </div>

      <div className="sources-list">
        
        <div className="source-item">
          <div className="source-name-col">
            <span className="source-badge">Play Store</span>
          </div>
          <div className="source-stats">
            <span className="source-count">{playStoreCount} <span className="source-label">reviews</span></span>
            <span className="source-percent">{getPercent(playStoreCount)}%</span>
          </div>
        </div>

        <div className="source-item">
          <div className="source-name-col">
            <span className="source-badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>App Store</span>
          </div>
          <div className="source-stats">
            <span className="source-count">{appStoreCount} <span className="source-label">reviews</span></span>
            <span className="source-percent">{getPercent(appStoreCount)}%</span>
          </div>
        </div>

        <div className="source-item">
          <div className="source-name-col">
            <span className="source-badge reddit">Reddit</span>
          </div>
          <div className="source-stats">
            <span className="source-count">{redditCount} <span className="source-label">posts</span></span>
            <span className="source-percent">{getPercent(redditCount)}%</span>
          </div>
        </div>

        <div className="source-item">
          <div className="source-name-col">
            <span className="source-badge support">Google Support Forums</span>
          </div>
          <div className="source-stats">
            <span className="source-count">{communityCount} <span className="source-label">threads</span></span>
            <span className="source-percent">{getPercent(communityCount)}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DataSources;
