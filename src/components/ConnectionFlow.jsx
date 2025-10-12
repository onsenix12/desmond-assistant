import React, { useState } from 'react';
import { Calendar, MessageCircle, Mail, FileText, CheckCircle2, Loader2 } from 'lucide-react';

const ConnectionFlow = ({ onComplete }) => {
  const [connections, setConnections] = useState({
    google: { status: 'not_connected', loading: false },
    whatsapp: { status: 'not_connected', loading: false },
    outlook: { status: 'not_connected', loading: false },
    notes: { status: 'not_connected', loading: false },
  });

  const [showContinue, setShowContinue] = useState(false);

  const apps = [
    {
      id: 'google',
      name: 'Google Calendar',
      icon: Calendar,
      color: 'blue',
      description: 'Work meetings, family events, study schedule',
      benefit: 'See all your commitments in one place',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'green',
      description: 'Family coordination, group plans',
      benefit: 'Auto-detect scheduling requests from family chat',
    },
    {
      id: 'outlook',
      name: 'Outlook Calendar',
      icon: Mail,
      color: 'purple',
      description: 'Work emails, SAF official calendar',
      benefit: 'Sync work commitments automatically',
    },
    {
      id: 'notes',
      name: 'Upload Notes',
      icon: FileText,
      color: 'orange',
      description: 'Physical diary, to-do lists, handwritten tasks',
      benefit: 'Digitize your offline planning',
    },
  ];

  const handleConnect = (appId) => {
    // Set loading state
    setConnections(prev => ({
      ...prev,
      [appId]: { status: 'connecting', loading: true }
    }));

    // Simulate connection process
    setTimeout(() => {
      setConnections(prev => ({
        ...prev,
        [appId]: { status: 'connected', loading: false }
      }));

      // Check if at least one app is connected to show continue button
      const anyConnected = Object.values({
        ...connections,
        [appId]: { status: 'connected', loading: false }
      }).some(conn => conn.status === 'connected');

      if (anyConnected) {
        setShowContinue(true);
      }
    }, 2000);
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-600 hover:bg-blue-700 text-white',
      green: 'bg-green-600 hover:bg-green-700 text-white',
      purple: 'bg-purple-600 hover:bg-purple-700 text-white',
      orange: 'bg-orange-600 hover:bg-orange-700 text-white',
    };
    return colors[color] || 'bg-gray-600 hover:bg-gray-700 text-white';
  };

  const getIconColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
    };
    return colors[color] || 'bg-gray-100 text-gray-600';
  };

  const connectedCount = Object.values(connections).filter(c => c.status === 'connected').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 sm:px-8 py-8 sm:py-12 text-white">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-3 sm:mb-4">
              <div className="inline-block p-3 sm:p-4 bg-white/20 rounded-full">
                <Calendar size={32} className="sm:w-12 sm:h-12" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">
              Welcome to Time Tetris
            </h1>
            <p className="text-base sm:text-xl text-blue-100 mb-2">
              Connect your apps to unlock smart scheduling, conflict prevention, and stress-free planning
            </p>
            <p className="text-xs sm:text-sm text-blue-200">
              Connect at least one app to get started • All data stored locally
            </p>
          </div>
        </div>

        {/* Connection Cards */}
        <div className="px-4 sm:px-8 py-6 sm:py-10">
          {connectedCount > 0 && (
            <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 sm:gap-3">
                <CheckCircle2 size={20} className="text-green-600 sm:w-6 sm:h-6" />
                <div>
                  <p className="font-semibold text-green-800 text-sm sm:text-base">
                    Great! {connectedCount} app{connectedCount > 1 ? 's' : ''} connected
                  </p>
                  <p className="text-xs sm:text-sm text-green-700">
                    Your calendar is getting smarter. Connect more for better insights.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {apps.map((app) => {
              const Icon = app.icon;
              const connection = connections[app.id];
              const isConnected = connection.status === 'connected';
              const isConnecting = connection.loading;

              return (
                <div
                  key={app.id}
                  className={`border-2 rounded-xl p-4 sm:p-6 transition-all ${
                    isConnected
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300 active:border-gray-400'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`p-2 sm:p-3 rounded-lg ${getIconColorClasses(app.color)}`}>
                      <Icon size={20} className="sm:w-7 sm:h-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg mb-1">{app.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                        {app.description}
                      </p>
                      <div className="flex items-start gap-2 mb-3 sm:mb-4">
                        <span className="text-xs mt-0.5">💡</span>
                        <p className="text-xs text-gray-700 italic">
                          {app.benefit}
                        </p>
                      </div>
                      
                      {isConnected ? (
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle2 size={16} className="sm:w-5 sm:h-5" />
                          <span className="font-semibold text-sm sm:text-base">Connected</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleConnect(app.id)}
                          disabled={isConnecting}
                          className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all touch-manipulation text-sm ${
                            isConnecting
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : getColorClasses(app.color)
                          }`}
                        >
                          {isConnecting ? (
                            <span className="flex items-center gap-2">
                              <Loader2 size={14} className="animate-spin sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">Connecting...</span>
                              <span className="sm:hidden">...</span>
                            </span>
                          ) : (
                            <>
                              <span className="hidden sm:inline">Connect {app.name}</span>
                              <span className="sm:hidden">Connect</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Skip / Continue Buttons */}
          <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => onComplete(connections)}
              className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 active:bg-gray-100 transition-all touch-manipulation text-sm sm:text-base"
            >
              Skip for now
            </button>
            
            {showContinue && (
              <button
                onClick={() => onComplete(connections)}
                className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 active:from-blue-800 active:to-indigo-900 transition-all shadow-lg touch-manipulation text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Continue to Dashboard →</span>
                <span className="sm:hidden">Continue →</span>
              </button>
            )}
          </div>

          {/* Privacy Note */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs text-gray-500">
              🔒 All data stored locally in your browser. No external servers. Disconnect anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionFlow;
