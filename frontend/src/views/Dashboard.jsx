import { useState, useEffect } from 'react';
import './Dashboard.css';
import OpportunityMatrix from '../components/OpportunityMatrix';
import PrioritizationMatrix from '../components/PrioritizationMatrix';
import SentimentDistribution from '../components/SentimentDistribution';
import DataSources from '../components/DataSources';
import matrixJson from '../data/matrix.json';

const Dashboard = () => {
  const [matrixData, setMatrixData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load static data instead of fetching from Python backend
        setMatrixData(matrixJson.matrix || []);
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Could not load insights data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Derived values for the UI
  const totalClusters = matrixData.length;
  // Since we actually scraped a huge volume of complaints, the total volume in the matrix reflects the real numbers now!
  const totalVolume = matrixData.reduce((acc, curr) => acc + curr.frequency, 0);
  const totalScraped = totalVolume;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Research Overview</h2>
        <p>AI-powered analysis of Google Photos retrieval failures — uncovering search barriers & user behavior patterns</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card panel">
          <div className="stat-header">
            <span className="stat-label">TOTAL FEEDBACK</span>
            <span className="stat-icon">💬</span>
          </div>
          <div className="stat-value">{totalScraped}</div>
          <div className="stat-subtext">User complaints processed</div>
        </div>
        
        <div className="stat-card panel">
          <div className="stat-header">
            <span className="stat-label">RETRIEVAL FAILURES</span>
            <span className="stat-icon text-blue">🔍</span>
          </div>
          <div className="stat-value">{totalVolume}</div>
          <div className="stat-subtext">Lost photos triangulated</div>
        </div>
        
        <div className="stat-card panel">
          <div className="stat-header">
            <span className="stat-label">UX BOTTLENECKS</span>
            <span className="stat-icon text-yellow">🗄️</span>
          </div>
          <div className="stat-value">{totalClusters}</div>
          <div className="stat-subtext">Actionable pain points identified</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <SentimentDistribution topFailureState={matrixData.length > 0 ? matrixData[0].failure_state : 'System Issues'} />
        <DataSources totalScraped={totalScraped} />
      </div>

      <div className="dashboard-header" style={{ marginTop: '32px' }}>
        <h2>Pipeline Summary</h2>
      </div>

      {loading ? (
        <div className="loading-state panel">
          <div className="spinner"></div>
          <p>Analyzing public discourse...</p>
        </div>
      ) : error ? (
        <div className="error-state panel">
          <p>{error}</p>
        </div>
      ) : (
        <>
          {matrixData.length > 0 && (
            <div className="highest-opportunity-highlight panel hover-effect" style={{ marginBottom: '24px', borderLeft: '4px solid var(--google-blue)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--google-blue)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Highest Opportunity Identified</h3>
                  <h2 style={{ margin: '8px 0 0 0', fontSize: '1.8rem', color: 'var(--text-primary)' }}>{matrixData[0].failure_state}</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{matrixData[0].frequency}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>User Reports</div>
                </div>
              </div>
              <div style={{ backgroundColor: 'rgba(66, 133, 244, 0.1)', padding: '16px', borderRadius: '8px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                <strong>Core Issue Pattern:</strong> {matrixData[0].description}
                
                {matrixData[0].failure_state === "Temporal Confusion" && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <h4 style={{ color: 'var(--text-primary)', fontSize: '14px', margin: '0 0 12px 0' }}>The 4 Sub-Pillars of Temporal Confusion:</h4>
                    <ul style={{ color: 'var(--text-secondary)', fontSize: '13px', paddingLeft: '20px', margin: 0, lineHeight: '1.8' }}>
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
              </div>
            </div>
          )}
          <PrioritizationMatrix matrixData={matrixData} />
          <OpportunityMatrix matrix={matrixData} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
