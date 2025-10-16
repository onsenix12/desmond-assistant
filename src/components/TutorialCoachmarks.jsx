import React from 'react';

const TutorialCoachmarks = ({ stepIndex, steps, onNext, onSkip }) => {
  if (!steps || steps.length === 0) return null;
  const step = steps[Math.min(stepIndex, steps.length - 1)];

  const [rect, setRect] = React.useState(null);
  const [cardSize, setCardSize] = React.useState({ width: 0, height: 0 });
  const cardRef = React.useRef(null);

  const measure = React.useCallback(() => {
    if (!step.selector) return setRect(null);
    const el = document.querySelector(step.selector);
    if (!el) return setRect(null);
    const r = el.getBoundingClientRect();

    // Align to the visual viewport so fixed overlay matches on mobile browsers
    const vv = typeof window !== 'undefined' && window.visualViewport ? window.visualViewport : null;
    const offsetLeft = vv ? vv.offsetLeft : 0;
    const offsetTop = vv ? vv.offsetTop : 0;
    const scale = vv ? vv.scale || 1 : 1;

    // Translate layout-viewport rect into visual-viewport coordinates and account for zoom scale
    const top = (r.top - offsetTop) * scale;
    const left = (r.left - offsetLeft) * scale;
    const width = r.width * scale;
    const height = r.height * scale;

    setRect({ top, left, width, height });
  }, [step.selector]);

  React.useEffect(() => {
    // Scroll target into view on mobile, then measure
    if (step.selector) {
      const el = document.querySelector(step.selector);
      if (el && el.scrollIntoView) {
        try {
          el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        } catch (e) {
          try { el.scrollIntoView(); } catch {}
        }
      }
    }

    // Initial measure on next frame to avoid layout thrash
    const rafId = requestAnimationFrame(measure);

    // Window events
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('scroll', measure, { capture: true, passive: true });

    // Visual viewport events (mobile address bar, zoom, etc.)
    const vv = typeof window !== 'undefined' && window.visualViewport ? window.visualViewport : null;
    if (vv) {
      vv.addEventListener('resize', measure, { passive: true });
      vv.addEventListener('scroll', measure, { passive: true });
    }

    // Observe element size/position changes
    let ro = null;
    if (step.selector) {
      const el = document.querySelector(step.selector);
      if (el && typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(() => measure());
        try { ro.observe(el); } catch {}
      }
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
      if (vv) {
        vv.removeEventListener('resize', measure);
        vv.removeEventListener('scroll', measure);
      }
      if (ro) {
        try { ro.disconnect(); } catch {}
      }
    };
  }, [measure, step.selector]);

  // Measure card size whenever it renders or content changes
  React.useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setCardSize({ width: r.width, height: r.height });
    };
    update();
    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(update);
      try { ro.observe(el); } catch {}
    }
    const vv = typeof window !== 'undefined' && window.visualViewport ? window.visualViewport : null;
    if (vv) {
      vv.addEventListener('resize', update, { passive: true });
      vv.addEventListener('scroll', update, { passive: true });
    }
    return () => {
      if (ro) try { ro.disconnect(); } catch {}
      if (vv) {
        vv.removeEventListener('resize', update);
        vv.removeEventListener('scroll', update);
      }
    };
  }, [stepIndex]);

  const placement = step.placement || 'bottom';
  const offset = 12;

  const cardPos = () => {
    if (!rect) return { style: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }, effPlacement: placement };

    const vv = typeof window !== 'undefined' && window.visualViewport ? window.visualViewport : null;
    const viewportWidth = vv ? vv.width : window.innerWidth;
    const viewportHeight = vv ? vv.height : window.innerHeight;
    const padding = 12;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let top; let left; let transform; let effPlacement = placement;

    // Base positions by requested placement
    if (placement === 'top') {
      top = rect.top - offset; left = centerX; transform = 'translate(-50%, -100%)';
    } else if (placement === 'left') {
      top = centerY; left = rect.left - offset; transform = 'translate(-100%, -50%)';
    } else if (placement === 'right') {
      top = centerY; left = rect.left + rect.width + offset; transform = 'translate(0,-50%)';
    } else { // bottom
      top = rect.top + rect.height + offset; left = centerX; transform = 'translate(-50%, 0)';
    }

    // Smart flip to keep inside viewport based on current card size
    const halfCardW = cardSize.width / 2;
    const cardH = cardSize.height;

    if (placement === 'top') {
      if (top - cardH < padding) { // flip to bottom
        top = rect.top + rect.height + offset; transform = 'translate(-50%, 0)'; effPlacement = 'bottom';
      }
    } else if (placement === 'bottom') {
      if (top + cardH > viewportHeight - padding) { // flip to top
        top = rect.top - offset; transform = 'translate(-50%, -100%)'; effPlacement = 'top';
      }
    } else if (placement === 'left') {
      if (left - cardSize.width < padding) { // flip to right
        left = rect.left + rect.width + offset; transform = 'translate(0,-50%)'; effPlacement = 'right';
      }
    } else if (placement === 'right') {
      if (left + cardSize.width > viewportWidth - padding) { // flip to left
        left = rect.left - offset; transform = 'translate(-100%, -50%)'; effPlacement = 'left';
      }
    }

    // Horizontal centering protection when using translateX(-50%)
    if (transform.includes('translate(-50%')) {
      if (left - halfCardW < padding) left = halfCardW + padding;
      if (left + halfCardW > viewportWidth - padding) left = viewportWidth - halfCardW - padding;
    }

    // Vertical centering protection when using translateY(-50%)
    if (transform.includes(', -50%)') || transform.includes(',-50%)')) {
      const halfCardH = cardH / 2;
      if (top - halfCardH < padding) top = halfCardH + padding;
      if (top + halfCardH > viewportHeight - padding) top = viewportHeight - halfCardH - padding;
    }

    return { style: { top, left, transform }, effPlacement };
  };

  const { style: computedCardStyle, effPlacement } = cardPos();

  const handleNext = (e) => { e.preventDefault(); e.stopPropagation(); onNext && onNext(); };
  const handleSkip = (e) => { e.preventDefault(); e.stopPropagation(); onSkip && onSkip(); };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Highlight box with big box-shadow to create spotlight */}
      {rect && (
        <div
          className="absolute rounded-xl border-2"
          style={{
            top: Math.max(8, rect.top - 8),
            left: Math.max(8, rect.left - 8),
            width: rect.width + 16,
            height: rect.height + 16,
            borderColor: '#119BFE',
            boxShadow: '0 0 0 20000px rgba(0,0,0,0.55)',
          }}
        />
      )}

      {/* Callout card */}
      <div
        ref={cardRef}
        className="absolute bg-white w-[min(90vw,360px)] rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
        style={computedCardStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-title"
      >
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 id="tutorial-title" className="font-bold text-gray-900 text-sm sm:text-base">{step.title}</h3>
          <button type="button" onClick={handleSkip} className="text-gray-500 hover:text-gray-700 text-sm active:scale-[0.98]">Skip</button>
        </div>
        <div className="px-4 py-3 max-h-[80vh] overflow-y-auto">
          <p className="text-sm text-gray-700 leading-relaxed">{step.body}</p>
          {step.tip && (
            <div className="mt-2 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3">💡 {step.tip}</div>
          )}
        </div>
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-xs text-gray-500">Step {stepIndex + 1} of {steps.length}</div>
          <button type="button" onClick={handleNext} className="px-3 py-2 rounded-lg text-white bg-[#119BFE] hover:brightness-95 active:scale-[0.98] shadow-sm font-semibold text-sm">
            {stepIndex + 1 === steps.length ? 'Done' : 'Next'}
          </button>
        </div>
      </div>

      {/* Pointer (small triangle) */}
      {rect && (
        <div
          className="absolute w-0 h-0 pointer-events-none"
          style={{
            ...(effPlacement === 'top' && { top: (rect.top - offset) + 'px', left: (rect.left + rect.width / 2) + 'px', transform: 'translate(-50%, -100%)' }),
            ...(effPlacement === 'bottom' && { top: (rect.top + rect.height + offset) + 'px', left: (rect.left + rect.width / 2) + 'px', transform: 'translate(-50%, 0)' }),
            ...(effPlacement === 'left' && { top: (rect.top + rect.height / 2) + 'px', left: (rect.left - offset) + 'px', transform: 'translate(-100%, -50%)' }),
            ...(effPlacement === 'right' && { top: (rect.top + rect.height / 2) + 'px', left: (rect.left + rect.width + offset) + 'px', transform: 'translate(0, -50%)' })
          }}
        >
          <div
            className="w-0 h-0"
            style={{
              borderLeft: effPlacement === 'bottom' || effPlacement === 'top' ? '8px solid transparent' : undefined,
              borderRight: effPlacement === 'bottom' || effPlacement === 'top' ? '8px solid transparent' : undefined,
              borderTop: effPlacement === 'bottom' ? '10px solid white' : undefined,
              borderBottom: effPlacement === 'top' ? '10px solid white' : undefined,
              borderTopColor: effPlacement === 'bottom' ? 'white' : undefined,
              borderBottomColor: effPlacement === 'top' ? 'white' : undefined,
              borderTopWidth: effPlacement === 'bottom' ? 10 : undefined,
              borderBottomWidth: effPlacement === 'top' ? 10 : undefined,
              borderLeftWidth: effPlacement === 'left' ? 10 : (effPlacement === 'right' ? 0 : 8),
              borderRightWidth: effPlacement === 'right' ? 10 : (effPlacement === 'left' ? 0 : 8),
              borderLeftColor: effPlacement === 'right' ? 'white' : 'transparent',
              borderRightColor: effPlacement === 'left' ? 'white' : 'transparent',
              boxShadow: '0 1px 2px rgba(0,0,0,0.15)'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TutorialCoachmarks;


