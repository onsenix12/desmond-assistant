import React, { useState } from 'react';
import { Calendar, MessageCircle, CheckCircle2, Loader2, Sigma } from 'lucide-react';

// Brand palette
// Yellow: #FFC600, Orange: #FF6B4D, Blue: #119BFE, Green: #28C840
// Use Blue as dominant; Green only for success; Yellow/Orange as subtle accents
const MIN_BG = 'bg-gradient-to-br from-white to-[#119BFE0D]';
const CARD = 'bg-white border border-gray-200 rounded-2xl shadow-xl';
const PRIMARY_BTN = 'bg-[#119BFE] hover:brightness-95 text-white';
const GHOST_BTN = 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50';

const ConnectionFlow = ({ onComplete }) => {
  const [step, setStep] = useState(0); // 0: welcome, 1: calendar, 2: whatsapp, 3: done
  const [connections, setConnections] = useState({
    google: { status: 'not_connected', loading: false },
    whatsapp: { status: 'not_connected', loading: false },
  });

  const handleConnect = (appId) => {
    setConnections(prev => ({
      ...prev,
      [appId]: { status: 'connecting', loading: true }
    }));

    setTimeout(() => {
      // Compute the next connection state once
      const next = (prev => ({
        ...prev,
        [appId]: { status: 'connected', loading: false }
      }));

      setConnections(prev => {
        const updated = next(prev);
        // After updating state, decide what to do next
        // If Google connected, advance to WhatsApp (step 2)
        if (appId === 'google') {
          setTimeout(() => setStep(2), 300);
        }
        // If WhatsApp connected, finish the flow immediately
        if (appId === 'whatsapp' && typeof onComplete === 'function') {
          setTimeout(() => onComplete(updated), 300);
        }
        return updated;
      });
    }, 1200);
  };

  const calendar = connections.google;
  const whatsapp = connections.whatsapp;

  const Header = ({ title, subtitle }) => (
    <div className="px-6 sm:px-10 pt-8 pb-4 text-center">
      <div className="mx-auto mb-4 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#119BFE] text-white flex items-center justify-center shadow-lg pointer-events-none select-none" aria-hidden="true">
        {/* Math icon vibe */}
        <Sigma className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-sm sm:text-base text-gray-600">{subtitle}</p>
      )}
    </div>
  );

  const Footer = ({ onSkip, onNext, nextLabel = 'Next', hideSkip = false }) => (
    <div className="px-6 sm:px-10 pb-8 flex flex-col sm:flex-row items-center justify-center gap-3">
      {onSkip && !hideSkip && (
        <button onClick={onSkip} className={`px-5 py-2 rounded-lg font-semibold ${GHOST_BTN}`}>
          Skip
        </button>
      )}
      {onNext && (
        <button onClick={onNext} className={`px-6 py-2 rounded-lg font-semibold ${PRIMARY_BTN}`}>
          {nextLabel}
        </button>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen ${MIN_BG} flex items-center justify-center p-4`}>
      <div className={`w-full max-w-xl ${CARD} overflow-hidden`}>
        {/* Step views */}
        {step === 0 && (
          <>
            <Header 
              title="Welcome to Time Tetris"
              subtitle="A calmer way to plan. We’ll connect things one step at a time."
            />
            <div className="px-6 sm:px-10 pb-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">Calendar</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">WhatsApp</span>
                </div>
              </div>
            </div>
            <Footer onNext={() => setStep(1)} nextLabel="Get started" />
          </>
        )}

        {step === 1 && (
          <>
            <Header 
              title="Connect your Calendar"
              subtitle="So we can see commitments and prevent conflicts automatically."
            />
            <div className="px-6 sm:px-10 pb-2">
              <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Google Calendar</p>
                  <p className="text-sm text-gray-600">Work meetings, family events, study blocks</p>
                </div>
                {calendar.status === 'connected' ? (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Connected
                  </span>
                ) : (
                  <button
                    onClick={() => handleConnect('google')}
                    disabled={calendar.loading}
                    className={`px-4 py-2 rounded-lg font-semibold ${calendar.loading ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : PRIMARY_BTN}`}
                  >
                    {calendar.loading ? (
                      <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Connecting…</span>
                    ) : (
                      'Authorize Google Calendar'
                    )}
                  </button>
                )}
              </div>
              {calendar.status !== 'connected' && (
                <p className="mt-2 text-xs text-gray-500">
                  We’ll request read-only access to your events. You can disconnect anytime.
                </p>
              )}
            </div>
            <Footer 
              onSkip={() => setStep(2)} 
              onNext={() => setStep(2)} 
              nextLabel={calendar.status === 'connected' ? 'Continue' : 'Skip for now'} 
              hideSkip={calendar.status !== 'connected'}
            />
          </>
        )}

        {step === 2 && (
          <>
            <Header 
              title="Connect WhatsApp"
              subtitle="We’ll spot planning messages and turn them into options."
            />
            <div className="px-6 sm:px-10 pb-2">
              <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">WhatsApp</p>
                  <p className="text-sm text-gray-600">Detect scheduling in family chats</p>
                </div>
                {whatsapp.status === 'connected' ? (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Connected
                  </span>
                ) : (
                  <button
                    onClick={() => handleConnect('whatsapp')}
                    disabled={whatsapp.loading}
                    className={`px-4 py-2 rounded-lg font-semibold ${whatsapp.loading ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : PRIMARY_BTN}`}
                  >
                    {whatsapp.loading ? (
                      <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Connecting…</span>
                    ) : (
                      'Connect WhatsApp'
                    )}
                  </button>
                )}
              </div>
              {whatsapp.status !== 'connected' && (
                <p className="mt-2 text-xs text-gray-500">
                  Only messages you select are used for planning. We never post without asking.
                </p>
              )}
            </div>
            <Footer 
              onSkip={() => onComplete(connections)} 
              onNext={() => onComplete(connections)} 
              nextLabel={whatsapp.status === 'connected' ? 'Finish' : 'Finish without WhatsApp'} 
              hideSkip={whatsapp.status !== 'connected'}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectionFlow;
