import React from 'react';

const MobileBottomSheet = ({ open, onClose, header, children }) => {
  return (
    <>
      {/* Peek bar */}
      {!open && (
        <div className="lg:hidden fixed bottom-14 left-0 right-0 flex justify-center z-20">
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-full shadow-md text-xs text-gray-700">
            {header}
          </div>
        </div>
      )}

      {open && (
        <div className="lg:hidden fixed inset-0 z-40" data-testid="mobile-sheet">
          <div className="absolute inset-0 bg-black/30" onClick={onClose} />
          <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-center py-2">
              <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileBottomSheet;


