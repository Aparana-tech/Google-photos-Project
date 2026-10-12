import { useState, useEffect } from 'react';
import './Dashboard.css';
import OpportunityMatrix from '../components/OpportunityMatrix';
import PrioritizationMatrix from '../components/PrioritizationMatrix';
import SentimentDistribution from '../components/SentimentDistribution';
import DataSources from '../components/DataSources';
import matrixJson from '../data/matrix.json';

const Dashboard = ({ onOpenMvp }) => {
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

      {/* Prominent Top Banner for the Deployed MVP */}
      <div className="panel" style={{
        background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.16) 0%, rgba(52, 168, 83, 0.12) 100%)',
        border: '1px solid rgba(66, 133, 244, 0.4)',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '30px' }}>🚀</div>
          <div>
            <div style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Event Anchoring MVP Prototype is Live</span>
              <span style={{ fontSize: '11px', background: 'var(--google-blue)', color: '#ffffff', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                INTERACTIVE DEMO
              </span>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
              Addressing the #1 UX Bottleneck (<strong>Temporal Confusion</strong>, 52% of user failures). Test the life chapter anchor search!
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {onOpenMvp && (
            <button
              onClick={onOpenMvp}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--text-primary)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '9px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
            >
              Preview Here
            </button>
          )}
          <a
            href="https://google-photos-feature-mvp-production.up.railway.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'var(--google-blue)',
              color: '#ffffff',
              padding: '9px 20px',
              borderRadius: '20px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '13px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(66, 133, 244, 0.35)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span>Launch Live MVP ↗</span>
          </a>
        </div>
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
                
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                  <a href="https://google-photos-feature-mvp-production.up.railway.app/" target="_blank" rel="noopener noreferrer" style={{
                    display: 'inline-block',
                    backgroundColor: 'var(--google-blue)',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '24px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    ✨ Launch Event Anchoring MVP Prototype
                  </a>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    Click to view the interactive UI solution
                  </p>
                </div>
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
