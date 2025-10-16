import React from 'react';

const TutorialCoachmarks = ({ stepIndex, steps, onNext, onSkip }) => {
  if (!steps || steps.length === 0) return null;
  const step = steps[Math.min(stepIndex, steps.length - 1)];

  const [rect, setRect] = React.useState(null);
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
          el.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center', 
            inline: 'center' 
          }); 
        } catch (e) {
          try { el.scrollIntoView(); } catch {}
        }
      }
    }

    // Initial measure on next frame to avoid layout thrash
    const rafId = requestAnimationFrame(measure);

    // Only measure on resize, NOT on scroll
    const handleResize = () => measure();
    
    window.addEventListener('resize', handleResize, { passive: true });
    // NO SCROLL LISTENER - card stays fixed during scroll!

    // Visual viewport resize only
    const vv = typeof window !== 'undefined' && window.visualViewport ? window.visualViewport : null;
    if (vv) {
      vv.addEventListener('resize', handleResize, { passive: true });
      // NO SCROLL LISTENER for visual viewport either
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
      window.removeEventListener('resize', handleResize);
      if (vv) {
        vv.removeEventListener('resize', handleResize);
      }
      if (ro) {
        try { ro.disconnect(); } catch {}
      }
    };
  }, [measure, step.selector]);

  // NEW: Get responsive placement based on screen size and original placement
  const getResponsivePlacement = () => {
    const vv = typeof window !== 'undefined' && window.visualViewport ? window.visualViewport : null;
    const viewportWidth = vv ? vv.width : window.innerWidth;
    const isMobile = viewportWidth < 768; // Tailwind 'md' breakpoint
    
    let responsivePlacement = step.placement || 'bottom';
    
    // On mobile, convert left/right placements to top/bottom
    if (isMobile) {
      if (responsivePlacement === 'left' || responsivePlacement === 'right') {
        // For conflicts panel and other wide elements, use top placement on mobile
        responsivePlacement = 'top';
      }
    }
    
    return responsivePlacement;
  };

  const placement = getResponsivePlacement();
  const offset = 12;

  // IMPROVED: Calculate card position with viewport boundary checking and mobile responsiveness
  const cardPos = () => {
    if (!rect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    
    // Get viewport dimensions
    const vv = typeof window !== 'undefined' && window.visualViewport ? window.visualViewport : null;
    const viewportWidth = vv ? vv.width : window.innerWidth;
    const viewportHeight = vv ? vv.height : window.innerHeight;
    const isMobile = viewportWidth < 768;
    
    // Card dimensions (approximate - will be refined after render)
    const cardWidth = Math.min(viewportWidth * 0.9, 360);
    const cardHeight = 200; // Approximate height
    const padding = isMobile ? 16 : 24; // More aggressive padding on mobile

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let top, left, transform;
    
    switch (placement) {
      case 'top':
        top = rect.top - offset;
        left = centerX;
        transform = 'translate(-50%, -100%)';
        
        // Check if card goes above viewport
        if (top - cardHeight < padding) {
          // Flip to bottom
          top = rect.top + rect.height + offset;
          transform = 'translate(-50%, 0)';
        }
        break;
        
      case 'bottom':
        top = rect.top + rect.height + offset;
        left = centerX;
        transform = 'translate(-50%, 0)';
        
        // Check if card goes below viewport
        if (top + cardHeight > viewportHeight - padding) {
          // Flip to top
          top = rect.top - offset;
          transform = 'translate(-50%, -100%)';
        }
        break;
        
      case 'left':
        top = centerY;
        left = rect.left - offset;
        transform = 'translate(-100%, -50%)';
        
        // Check if card goes past left edge
        if (left - cardWidth < padding) {
          // Flip to right
          left = rect.left + rect.width + offset;
          transform = 'translate(0, -50%)';
        }
        break;
        
      case 'right':
        top = centerY;
        left = rect.left + rect.width + offset;
        transform = 'translate(0, -50%)';
        
        // Check if card goes past right edge
        if (left + cardWidth > viewportWidth - padding) {
          // Flip to left
          left = rect.left - offset;
          transform = 'translate(-100%, -50%)';
        }
        break;
        
      default:
        top = rect.top + rect.height + offset;
        left = centerX;
        transform = 'translate(-50%, 0)';
    }
    
    // Final boundary check for horizontal position
    const halfCardWidth = cardWidth / 2;
    if (transform.includes('-50%')) {
      // Centered horizontally
      if (left - halfCardWidth < padding) {
        left = halfCardWidth + padding;
      } else if (left + halfCardWidth > viewportWidth - padding) {
        left = viewportWidth - halfCardWidth - padding;
      }
    }
    
    // Final boundary check for vertical position (especially important on mobile)
    if (isMobile) {
      // Ensure card doesn't go off bottom
      if (top + cardHeight > viewportHeight - padding) {
        top = viewportHeight - cardHeight - padding;
      }
      // Ensure card doesn't go off top
      if (top < padding) {
        top = padding;
      }
    }
    
    return { 
      top: `${top}px`, 
      left: `${left}px`, 
      transform,
      maxWidth: `${cardWidth}px`
    };
  };

  // IMPROVED: Calculate pointer position with same boundary logic
  const pointerPos = () => {
    if (!rect) return null;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const vv = typeof window !== 'undefined' && window.visualViewport ? window.visualViewport : null;
    const viewportWidth = vv ? vv.width : window.innerWidth;
    const viewportHeight = vv ? vv.height : window.innerHeight;
    const isMobile = viewportWidth < 768;
    const cardWidth = Math.min(viewportWidth * 0.9, 360);
    const cardHeight = 200;
    const padding = isMobile ? 16 : 24;
    
    let style = {};
    
    switch (placement) {
      case 'top':
        if (rect.top - offset - cardHeight < padding) {
          // Flipped to bottom, point up
          style = {
            top: `${rect.top + rect.height + offset}px`,
            left: `${centerX}px`,
            transform: 'translate(-50%, 0)',
          };
        } else {
          // Normal top placement, point down
          style = {
            top: `${rect.top - offset}px`,
            left: `${centerX}px`,
            transform: 'translate(-50%, -100%)',
          };
        }
        break;
        
      case 'bottom':
        if (rect.top + rect.height + offset + cardHeight > viewportHeight - padding) {
          // Flipped to top, point down
          style = {
            top: `${rect.top - offset}px`,
            left: `${centerX}px`,
            transform: 'translate(-50%, -100%)',
          };
        } else {
          // Normal bottom placement, point up
          style = {
            top: `${rect.top + rect.height + offset}px`,
            left: `${centerX}px`,
            transform: 'translate(-50%, 0)',
          };
        }
        break;
        
      case 'left':
        if (rect.left - offset - cardWidth < padding) {
          // Flipped to right, point left
          style = {
            top: `${centerY}px`,
            left: `${rect.left + rect.width + offset}px`,
            transform: 'translate(0, -50%)',
          };
        } else {
          // Normal left placement, point right
          style = {
            top: `${centerY}px`,
            left: `${rect.left - offset}px`,
            transform: 'translate(-100%, -50%)',
          };
        }
        break;
        
      case 'right':
        if (rect.left + rect.width + offset + cardWidth > viewportWidth - padding) {
          // Flipped to left, point right
          style = {
            top: `${centerY}px`,
            left: `${rect.left - offset}px`,
            transform: 'translate(-100%, -50%)',
          };
        } else {
          // Normal right placement, point left
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

  // IMPROVED: Determine pointer direction based on actual placement
  const getPointerStyle = () => {
    if (!rect) return {};
    
    const vv = typeof window !== 'undefined' && window.visualViewport ? window.visualViewport : null;
    const viewportWidth = vv ? vv.width : window.innerWidth;
    const viewportHeight = vv ? vv.height : window.innerHeight;
    const isMobile = viewportWidth < 768;
    const cardWidth = Math.min(viewportWidth * 0.9, 360);
    const cardHeight = 200;
    const padding = isMobile ? 16 : 24;
    
    let isFlipped = false;
    
    switch (placement) {
      case 'top':
        isFlipped = rect.top - offset - cardHeight < padding;
        break;
      case 'bottom':
        isFlipped = rect.top + rect.height + offset + cardHeight > viewportHeight - padding;
        break;
      case 'left':
        isFlipped = rect.left - offset - cardWidth < padding;
        break;
      case 'right':
        isFlipped = rect.left + rect.width + offset + cardWidth > viewportWidth - padding;
        break;
    }
    
    // Return appropriate pointer style based on placement and flip status
    if (placement === 'top' && !isFlipped) {
      return {
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderBottom: '10px solid white',
      };
    } else if ((placement === 'bottom' && !isFlipped) || (placement === 'top' && isFlipped)) {
      return {
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderTop: '10px solid white',
      };
    } else if ((placement === 'left' && !isFlipped) || (placement === 'right' && isFlipped)) {
      return {
        borderTop: '8px solid transparent',
        borderBottom: '8px solid transparent',
        borderRight: '10px solid white',
      };
    } else if ((placement === 'right' && !isFlipped) || (placement === 'left' && isFlipped)) {
      return {
        borderTop: '8px solid transparent',
        borderBottom: '8px solid transparent',
        borderLeft: '10px solid white',
      };
    }
    
    return {};
  };

  // IMPROVED: Handle button clicks with preventDefault to avoid extension conflicts
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

      {/* Callout card with improved positioning */}
      <div
        ref={cardRef}
        className="absolute bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
        style={{
          ...cardPos(),
          width: 'min(90vw, 360px)',
          maxHeight: '80vh',
          zIndex: 100,
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
        <div className="px-4 py-3 overflow-y-auto" style={{ maxHeight: '50vh' }}>
          <p className="text-sm text-gray-700 leading-relaxed">{step.body}</p>
          {step.tip && (
            <div className="mt-3 text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <span className="font-semibold text-blue-800">💡 Tip: </span>
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

      {/* Pointer (small triangle) with improved positioning */}
      {rect && (
        <div
          className="absolute w-0 h-0 pointer-events-none"
          style={{
            ...pointerPos(),
            zIndex: 99,
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