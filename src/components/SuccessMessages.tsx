import React from 'react';
import { SuccessMessagesProps } from '../types';

const SuccessMessages: React.FC<SuccessMessagesProps> = ({ 
  showSuccessMessage, 
  lastResolvedConflict, 
  showPatternSuccess, 
  lastPatternAction 
}) => {
  return (
    <>
      {/* Success Message */}
      {showSuccessMessage && lastResolvedConflict && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-500 text-sm">✓</span>
            </div>
            <span className="font-semibold">
              {lastResolvedConflict.resolution.label} applied!
            </span>
          </div>
        </div>
      )}

      {/* Pattern Success Message */}
      {showPatternSuccess && lastPatternAction && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <span className="text-purple-500 text-sm">✓</span>
            </div>
            <span className="font-semibold">
              {lastPatternAction.action}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default SuccessMessages;
