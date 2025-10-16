import React, { useState } from 'react';
import { AlertCircle, TrendingUp, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { getConflictColor, formatConflictDate } from '../utils/helper';


const ConflictCard = ({ conflict, onResolve }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState(null);

  const handleResolve = (resolution) => {
    setSelectedResolution(resolution.id);
    if (onResolve) {
      onResolve(conflict, resolution);
    }
  };

  const severityConfig = {
    high: { icon: AlertCircle, label: 'High' },
    medium: { icon: TrendingUp, label: 'Medium' },
    low: { icon: CheckCircle2, label: 'Low' }
  };

  const SeverityIcon = severityConfig[conflict.severity]?.icon || AlertCircle;

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${selectedResolution ? 'bg-green-50' : 'bg-white'}`}>
      {/* Header */}
      <div className={`p-4 cursor-pointer ${selectedResolution ? 'bg-green-50' : 'bg-gray-50'}`} onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${selectedResolution ? 'bg-green-200 text-green-700' : 'bg-[#119BFE1A] text-[#119BFE]'}`}>
            {selectedResolution ? (
              <CheckCircle2 size={20} />
            ) : (
              <SeverityIcon size={20} />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-800">{conflict.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded ${selectedResolution ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                {selectedResolution ? 'Resolved' : severityConfig[conflict.severity]?.label}
              </span>
            </div>
            
            {/* Date Display */}
            {conflict.date && (
              <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                <span className="font-semibold">📅</span>
                <span>{formatConflictDate(conflict.date)}</span>
              </div>
            )}
            
            <p className="text-sm text-gray-700 mb-2">
              {conflict.description}
            </p>

            {/* Pattern hint removed to reduce noise */}

            {selectedResolution && (
              <div className="flex items-start gap-1.5 text-xs text-green-700 bg-white bg-opacity-50 p-2 rounded mt-2">
                <CheckCircle2 size={14} className="mt-0.5" />
                <span className="font-semibold">
                  Solution applied: {conflict.resolutionOptions.find(r => r.id === selectedResolution)?.label}
                </span>
              </div>
            )}
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={expanded ? "Collapse details" : "Expand details"}
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Resolution Options (Simplified) */}
      {!selectedResolution && (
        <div className="p-4 bg-white border-t border-gray-200">
          {/* Primary action: best recommended */}
          {(() => {
            const primary = conflict.resolutionOptions.find(o => o.recommended) || conflict.resolutionOptions[0];
            if (!primary) return null;
            return (
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-3">
                <button
                  onClick={() => handleResolve(primary)}
                  className="px-4 py-2 rounded-lg text-white bg-[#119BFE] hover:brightness-95 font-semibold"
                >
                  {primary.label}
                </button>
                {primary.reasoning && (
                  <span className="text-xs text-gray-600">{primary.reasoning}</span>
                )}
              </div>
            );
          })()}

          {/* More options toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-gray-700 underline"
          >
            {expanded ? 'Hide options' : 'More options'}
          </button>

          {expanded && (
            <div className="mt-3 space-y-2">
              {conflict.resolutionOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleResolve(option)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <div className="font-semibold text-gray-800">{option.label}</div>
                  {option.reasoning && (
                    <div className="text-xs text-gray-600">{option.reasoning}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Impact Preview (if resolved) */}
      {expanded && selectedResolution && (
        <div className="p-4 bg-green-50 border-t border-green-200">
          <div className="flex items-start gap-2">
            <CheckCircle2 size={18} className="text-green-600 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-semibold mb-1">Conflict resolved!</p>
              <p>
                {conflict.resolutionOptions.find(r => r.id === selectedResolution)?.reasoning}
              </p>
              {conflict.resolutionOptions.find(r => r.id === selectedResolution)?.autoMessage && (
                <p className="mt-2 italic text-xs">
                  Message sent: "{conflict.resolutionOptions.find(r => r.id === selectedResolution)?.autoMessage}"
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConflictCard;