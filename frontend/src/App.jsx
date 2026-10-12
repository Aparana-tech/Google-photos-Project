import { useState } from 'react';
import './App.css';
import Dashboard from './views/Dashboard';
import Analytics from './views/Analytics';
import ThemeIntelligence from './views/ThemeIntelligence';
import Chatbot from './components/Chatbot';

function App() {
  const [currentView, setCurrentView] = useState('overview');
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo-text">Google Photos</h1>
          <div className="logo-sub">Discovery Engine</div>
        </div>
        
        <ul className="nav-menu">
          <li 
            className={`nav-item ${currentView === 'overview' ? 'active' : ''}`}
            onClick={() => setCurrentView('overview')}
          >
            <span className="nav-icon">📊</span>
            Overview
          </li>
          <li 
            className={`nav-item ${currentView === 'analytics' ? 'active' : ''}`}
            onClick={() => setCurrentView('analytics')}
          >
            <span className="nav-icon">📈</span>
            Analytics
          </li>
          <li 
            className={`nav-item ${currentView === 'theme_intelligence' ? 'active' : ''}`}
            onClick={() => setCurrentView('theme_intelligence')}
          >
            <span className="nav-icon">🧠</span>
            Theme Intelligence
          </li>
          <li 
            className={`nav-item ${currentView === 'mvp' ? 'active' : ''}`}
            onClick={() => setCurrentView('mvp')}
          >
            <span className="nav-icon">✨</span>
            Event Anchoring MVP
          </li>
        </ul>

        {/* Dedicated Quick Launch button for MVP */}
        <div style={{ padding: '0 16px 16px' }}>
          <a
            href="https://google-photos-feature-mvp-production.up.railway.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.25) 0%, rgba(52, 168, 83, 0.25) 100%)',
              border: '1px solid rgba(66, 133, 244, 0.4)',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🚀</span>
              <span>Launch Live MVP</span>
            </span>
            <span style={{ fontSize: '12px', opacity: 0.8 }}>↗</span>
          </a>
        </div>

        <div className="ask-btn-container">
          <button className="ask-btn" onClick={() => setIsChatOpen(true)}>
            <span className="icon">💬</span>
            Ask Me Questions
            <span className="arrow">›</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="main-content">
        {currentView === 'overview' && <Dashboard onOpenMvp={() => setCurrentView('mvp')} />}
        {currentView === 'analytics' && <Analytics />}
        {currentView === 'theme_intelligence' && <ThemeIntelligence />}
        {currentView === 'mvp' && (
          <div style={{ height: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column', padding: '0 8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.5rem' }}>✨ Event Anchoring MVP Prototype</h2>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Interactive prototype addressing the #1 retrieval failure mode (Temporal Confusion)
                </p>
              </div>
              <a 
                href="https://google-photos-feature-mvp-production.up.railway.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  background: 'var(--google-blue)',
                  color: '#ffffff',
                  padding: '8px 18px',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '13px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(66, 133, 244, 0.3)'
                }}
              >
                <span>Open in Full Browser Window</span>
                <span>↗</span>
              </a>
            </div>
            <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', background: '#1e1e1e', minHeight: '650px' }}>
              <iframe 
                src="https://google-photos-feature-mvp-production.up.railway.app/"
                title="Google Photos Event Anchoring MVP"
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        )}
      </main>

      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

export default App;
