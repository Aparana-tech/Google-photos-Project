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
        </ul>

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
        {currentView === 'overview' && <Dashboard />}
        {currentView === 'analytics' && <Analytics />}
        {currentView === 'theme_intelligence' && <ThemeIntelligence />}
      </main>

      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

export default App;
