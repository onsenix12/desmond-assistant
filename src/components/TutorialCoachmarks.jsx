import React from 'react';

const TutorialCoachmarks = ({ stepIndex, steps, onNext, onSkip }) => {
  if (!steps || steps.length === 0) return null;
  const step = steps[Math.min(stepIndex, steps.length - 1)];

  const [rect, setRect] = React.useState(null);

  const measure = React.useCallback(() => {
    if (!step.selector) return setRect(null);
    const el = document.querySelector(step.selector);
    if (!el) return setRect(null);
    const r = el.getBoundingClientRect();
    setRect({ top: r.top + window.scrollY, left: r.left + window.scrollX, width: r.width, height: r.height });
  }, [step.selector]);

  React.useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [measure]);

  const placement = step.placement || 'bottom';
  const offset = 12;

  const cardPos = () => {
    if (!rect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    switch (placement) {
      case 'top':
        return { top: rect.top - offset, left: centerX, transform: 'translate(-50%, -100%)' };
      case 'left':
        return { top: centerY, left: rect.left - offset, transform: 'translate(-100%, -50%)' };
      case 'right':
        return { top: centerY, left: rect.left + rect.width + offset, transform: 'translate(0,-50%)' };
      default:
        return { top: rect.top + rect.height + offset, left: centerX, transform: 'translate(-50%, 0)' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Highlight box with big box-shadow to create spotlight */}
      {rect && (
        <div
          className="absolute rounded-xl border-2"
          style={{
            top: rect.top - 8,
            left: rect.left - 8,
            width: rect.width + 16,
            height: rect.height + 16,
            borderColor: '#119BFE',
            boxShadow: '0 0 0 20000px rgba(0,0,0,0.55)',
          }}
        />
      )}

      {/* Callout card */}
      <div
        className="absolute bg-white w-[min(90vw,360px)] rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
        style={cardPos()}
        role="dialog"
        aria-modal="true"
      >
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">{step.title}</h3>
          <button onClick={onSkip} className="text-gray-500 hover:text-gray-700 text-sm">Skip</button>
        </div>
        <div className="px-4 py-3">
          <p className="text-sm text-gray-700">{step.body}</p>
          {step.tip && (
            <div className="mt-2 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3">{step.tip}</div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-xs text-gray-500">Step {stepIndex + 1} of {steps.length}</div>
          <button onClick={onNext} className="px-3 py-1.5 rounded-lg text-white bg-[#119BFE] hover:brightness-95 font-semibold text-sm">
            {stepIndex + 1 === steps.length ? 'Done' : 'Next'}
          </button>
        </div>
      </div>

      {/* Pointer (small triangle) */}
      {rect && (
        <div
          className="absolute w-0 h-0 pointer-events-none"
          style={{
            ...(placement === 'top' && { top: (rect.top - offset) + 'px', left: (rect.left + rect.width / 2) + 'px', transform: 'translate(-50%, -100%)' }),
            ...(placement === 'bottom' && { top: (rect.top + rect.height + offset) + 'px', left: (rect.left + rect.width / 2) + 'px', transform: 'translate(-50%, 0)' }),
            ...(placement === 'left' && { top: (rect.top + rect.height / 2) + 'px', left: (rect.left - offset) + 'px', transform: 'translate(-100%, -50%)' }),
            ...(placement === 'right' && { top: (rect.top + rect.height / 2) + 'px', left: (rect.left + rect.width + offset) + 'px', transform: 'translate(0, -50%)' })
          }}
        >
          <div
            className="w-0 h-0"
            style={{
              borderLeft: placement === 'bottom' || placement === 'top' ? '8px solid transparent' : undefined,
              borderRight: placement === 'bottom' || placement === 'top' ? '8px solid transparent' : undefined,
              borderTop: placement === 'bottom' ? '10px solid white' : undefined,
              borderBottom: placement === 'top' ? '10px solid white' : undefined,
              borderTopColor: placement === 'bottom' ? 'white' : undefined,
              borderBottomColor: placement === 'top' ? 'white' : undefined,
              borderTopWidth: placement === 'bottom' ? 10 : undefined,
              borderBottomWidth: placement === 'top' ? 10 : undefined,
              borderLeftWidth: placement === 'left' ? 10 : (placement === 'right' ? 0 : 8),
              borderRightWidth: placement === 'right' ? 10 : (placement === 'left' ? 0 : 8),
              borderLeftColor: placement === 'right' ? 'white' : 'transparent',
              borderRightColor: placement === 'left' ? 'white' : 'transparent',
              boxShadow: '0 1px 2px rgba(0,0,0,0.15)'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TutorialCoachmarks;


