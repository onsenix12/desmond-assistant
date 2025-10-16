import React from 'react';

const TutorialCoachmarks = ({ stepIndex, steps, onNext, onSkip }) => {
  if (!steps || steps.length === 0) return null;
  const step = steps[Math.min(stepIndex, steps.length - 1)];

  const [rect, setRect] = React.useState(null);
  const [isScrolling, setIsScrolling] = React.useState(false);
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
    // Scroll target into view, then measure
    if (step.selector) {
      const el = document.querySelector(step.selector);
      if (el?.scrollIntoView) {
        try {
          el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        } catch (e) {
          try { el.scrollIntoView(); } catch {}
        }
      }
    }

    const rafId = requestAnimationFrame(measure);

    // IMPROVED: Simplified scroll and resize handling
    let scrollTimer = null;
    let resizeRafId = null;

    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setIsScrolling(false);
        measure();
      }, 150); // Increased from 100ms for better stability
    };

    const handleResize = () => {
      if (resizeRafId) cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(() => measure());
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });

    const vv = typeof window !== 'undefined' && window.visualViewport ? window.visualViewport : null;
    if (vv) {
      vv.addEventListener('resize', handleResize, { passive: true });
      vv.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Simplified: Only attach scroll listeners to direct scrollable ancestors
    let scrollParents = [];
    if (step.selector) {
      const target = document.querySelector(step.selector);
      if (target) {
        let node = target.parentElement;
        let depth = 0;
        while (node && node !== document.body && depth < 5) { // Limit depth for performance
          const style = window.getComputedStyle(node);
          const overflowY = style.overflowY;
          if (overflowY === 'auto' || overflowY === 'scroll') {
            scrollParents.push(node);
          }
          node = node.parentElement;
          depth++;
        }
      }
    }
    
    scrollParents.forEach((sp) => {
      sp.addEventListener('scroll', handleScroll, { passive: true });
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (scrollTimer) clearTimeout(scrollTimer);
      if (resizeRafId) cancelAnimationFrame(resizeRafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
      scrollParents.forEach((sp) => {
        sp.removeEventListener('scroll', handleScroll);
      });
      if (vv) {
        vv.removeEventListener('resize', handleResize);
        vv.removeEventListener('scroll', handleScroll);
      }
    };
  }, [measure, step.selector]);

  // Card positioning logic
  const cardPos = () => {
    if (!rect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    // IMPROVED: Center card on screen while scrolling for stability
    if (isScrolling) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const vv = typeof window !== 'undefined' && window.visualViewport ? window.visualViewport : null;
    const viewportWidth = vv ? vv.width : window.innerWidth;
    const viewportHeight = vv ? vv.height : window.innerHeight;
    
    const offset = 16;
    const padding = 16;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const placement = step.placement || 'bottom';
    const cardWidth = Math.min(viewportWidth * 0.9, 360);
    const cardHeight = 180; // Reduced from 200 since we have less content now
    
    let style = {};
    
    switch (placement) {
      case 'top':
        if (rect.top - offset - cardHeight < padding) {
          // Flip to bottom
          style = {
            top: `${rect.top + rect.height + offset}px`,
            left: `${centerX}px`,
            transform: 'translate(-50%, 0)',
          };
        } else {
          style = {
            top: `${rect.top - offset}px`,
            left: `${centerX}px`,
            transform: 'translate(-50%, -100%)',
          };
        }
        break;
        
      case 'bottom':
        if (rect.top + rect.height + offset + cardHeight > viewportHeight - padding) {
          // Flip to top
          style = {
            top: `${rect.top - offset}px`,
            left: `${centerX}px`,
            transform: 'translate(-50%, -100%)',
          };
        } else {
          style = {
            top: `${rect.top + rect.height + offset}px`,
            left: `${centerX}px`,
            transform: 'translate(-50%, 0)',
          };
        }
        break;
        
      case 'left':
        if (rect.left - offset - cardWidth < padding) {
          // Flip to right
          style = {
            top: `${centerY}px`,
            left: `${rect.left + rect.width + offset}px`,
            transform: 'translate(0, -50%)',
          };
        } else {
          style = {
            top: `${centerY}px`,
            left: `${rect.left - offset}px`,
            transform: 'translate(-100%, -50%)',
          };
        }
        break;
        
      case 'right':
        if (rect.left + rect.width + offset + cardWidth > viewportWidth - padding) {
          // Flip to left
          style = {
            top: `${centerY}px`,
            left: `${rect.left - offset}px`,
            transform: 'translate(-100%, -50%)',
          };
        } else {
          style = {
            top: `${centerY}px`,
            left: `${rect.left + rect.width + offset}px`,
            transform: 'translate(0, -50%)',
          };
        }
        break;
        
      default:
        style = {
          top: `${rect.top + rect.height + offset}px`,
          left: `${centerX}px`,
          transform: 'translate(-50%, 0)',
        };
    }
    
    return style;
  };

  // Pointer positioning
  const pointerPos = () => {
    if (!rect) return {};
    const placement = step.placement || 'bottom';
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    switch (placement) {
      case 'top':
        return { top: `${rect.top - 12}px`, left: `${centerX}px` };
      case 'bottom':
        return { top: `${rect.top + rect.height + 12}px`, left: `${centerX}px` };
      case 'left':
        return { top: `${centerY}px`, left: `${rect.left - 12}px` };
      case 'right':
        return { top: `${centerY}px`, left: `${rect.left + rect.width + 12}px` };
      default:
        return { top: `${rect.top + rect.height + 12}px`, left: `${centerX}px` };
    }
  };

  // Pointer arrow style
  const getPointerStyle = () => {
    const placement = step.placement || 'bottom';
    const size = 10;
    
    switch (placement) {
      case 'top':
        return {
          borderLeft: `${size}px solid transparent`,
          borderRight: `${size}px solid transparent`,
          borderTop: `${size}px solid white`,
          transform: 'translate(-50%, 0)',
        };
      case 'bottom':
        return {
          borderLeft: `${size}px solid transparent`,
          borderRight: `${size}px solid transparent`,
          borderBottom: `${size}px solid white`,
          transform: 'translate(-50%, -100%)',
        };
      case 'left':
        return {
          borderTop: `${size}px solid transparent`,
          borderBottom: `${size}px solid transparent`,
          borderLeft: `${size}px solid white`,
          transform: 'translate(0, -50%)',
        };
      case 'right':
        return {
          borderTop: `${size}px solid transparent`,
          borderBottom: `${size}px solid transparent`,
          borderRight: `${size}px solid white`,
          transform: 'translate(-100%, -50%)',
        };
      default:
        return {
          borderLeft: `${size}px solid transparent`,
          borderRight: `${size}px solid transparent`,
          borderBottom: `${size}px solid white`,
          transform: 'translate(-50%, -100%)',
        };
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onNext();
  };

  const handleSkip = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSkip();
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Highlight box - only show when not scrolling for smoother experience */}
      {rect && !isScrolling && (
        <div
          className="absolute rounded-xl border-2"
          style={{
            top: Math.max(8, rect.top - 8),
            left: Math.max(8, rect.left - 8),
            width: rect.width + 16,
            height: rect.height + 16,
            borderColor: '#119BFE',
            boxShadow: '0 0 0 20000px rgba(0,0,0,0.55)',
            transition: 'all 0.2s ease-out',
          }}
        />
      )}

      {/* Callout card - REMOVED overflow and maxHeight */}
      <div
        ref={cardRef}
        className="absolute bg-white rounded-2xl shadow-2xl pointer-events-auto"
        style={{
          ...cardPos(),
          width: 'min(90vw, 360px)',
          zIndex: 100,
          transition: 'all 0.25s ease-out',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-title"
      >
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 id="tutorial-title" className="font-bold text-gray-900 text-sm sm:text-base">
            {step.title}
          </h3>
          <button 
            onClick={handleSkip} 
            className="text-gray-500 hover:text-gray-700 text-sm font-medium px-2 py-1 rounded hover:bg-gray-100 transition-colors"
            type="button"
          >
            Skip
          </button>
        </div>
        
        {/* IMPROVED: No scrolling container needed - content fits naturally */}
        <div className="px-4 py-3">
          <p className="text-sm text-gray-700 leading-relaxed">{step.body}</p>
          {step.tip && (
            <div className="mt-3 text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-2">
              <span className="font-semibold text-blue-800">💡 </span>
              {step.tip}
            </div>
          )}
        </div>
        
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="text-xs text-gray-500 font-medium">
            Step {stepIndex + 1} of {steps.length}
          </div>
          <button 
            onClick={handleNext} 
            className="px-4 py-2 rounded-lg text-white bg-[#119BFE] hover:brightness-95 font-semibold text-sm transition-all shadow-sm hover:shadow-md active:scale-95"
            type="button"
          >
            {stepIndex + 1 === steps.length ? 'Done' : 'Next'}
          </button>
        </div>
      </div>

      {/* Pointer - hide during scroll for cleaner appearance */}
      {rect && !isScrolling && (
        <div
          className="absolute w-0 h-0 pointer-events-none"
          style={{
            ...pointerPos(),
            zIndex: 99,
            transition: 'all 0.2s ease-out',
          }}
        >
          <div
            className="w-0 h-0"
            style={{
              ...getPointerStyle(),
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TutorialCoachmarks;