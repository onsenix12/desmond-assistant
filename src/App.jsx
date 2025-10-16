import React, { useState, useEffect } from 'react';
import ConnectionFlow from './components/ConnectionFlow';
import CalendarDashboard from './components/CalendarDashboard';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  // Check if user has completed setup
  const [appState, setAppState] = useState('loading'); // 'loading', 'connection', 'dashboard'
  const [connectedApps, setConnectedApps] = useState({});

  useEffect(() => {
    // Check localStorage for existing setup
    const savedSetup = localStorage.getItem('desmond_setup_complete');
    const savedApps = localStorage.getItem('desmond_connected_apps');

    if (savedSetup === 'true' && savedApps) {
      try {
        setConnectedApps(JSON.parse(savedApps));
        setAppState('dashboard');
      } catch (e) {
        setAppState('connection');
      }
    } else {
      setAppState('connection');
    }
  }, []);

  const handleConnectionComplete = (connections) => {
    setConnectedApps(connections);
    
    // Save to localStorage
    localStorage.setItem('desmond_setup_complete', 'true');
    localStorage.setItem('desmond_connected_apps', JSON.stringify(connections));
    // Ensure tutorial starts for new setups and show welcome banner
    try {
      localStorage.removeItem('tt_tutorial_done');
      localStorage.setItem('tt_show_welcome', 'true');
    } catch {}
    
    // Transition to dashboard
    setAppState('dashboard');
  };

  const handleResetSetup = () => {
    // Clear localStorage
    localStorage.removeItem('desmond_setup_complete');
    localStorage.removeItem('desmond_connected_apps');
    
    // Reset state
    setConnectedApps({});
    setAppState('connection');
  };

  // Loading state
  if (appState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-semibold">Loading Time Tetris...</p>
        </div>
      </div>
    );
  }

  // Connection flow
  if (appState === 'connection') {
    return (
      <ErrorBoundary>
        <ConnectionFlow onComplete={handleConnectionComplete} />
      </ErrorBoundary>
    );
  }

  // Main dashboard
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <CalendarDashboard 
          connectedApps={connectedApps}
          onResetSetup={handleResetSetup}
        />
        
        {/* Hidden reset button for demo purposes */}
        <button
          onClick={handleResetSetup}
          className="fixed bottom-4 right-4 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-20 hover:opacity-100 transition-opacity z-50"
          title="Reset demo (for testing)"
        >
          Reset Demo
        </button>
      </div>
    </ErrorBoundary>
  );
}

export default App;
