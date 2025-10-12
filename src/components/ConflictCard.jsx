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
    high: { icon: AlertCircle, color: 'red', label: 'High Priority' },
    medium: { icon: TrendingUp, color: 'yellow', label: 'Medium Priority' },
    low: { icon: CheckCircle2, color: 'blue', label: 'Low Priority' }
  };

  const SeverityIcon = severityConfig[conflict.severity]?.icon || AlertCircle;
  const severityColor = severityConfig[conflict.severity]?.color || 'red';

  return (
    <div className={`border-2 rounded-lg overflow-hidden ${
      selectedResolution 
        ? 'border-green-400 bg-green-50' 
        : `border-${severityColor}-300 bg-${severityColor}-50`
    }`}>
      {/* Header */}
      <div 
        className={`p-4 cursor-pointer ${
          selectedResolution ? 'bg-green-100' : `bg-${severityColor}-100`
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${
            selectedResolution 
              ? 'bg-green-200 text-green-700' 
              : `bg-${severityColor}-200 text-${severityColor}-700`
          }`}>
            {selectedResolution ? (
              <CheckCircle2 size={20} />
            ) : (
              <SeverityIcon size={20} />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-800">{conflict.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded ${
                selectedResolution
                  ? 'bg-green-200 text-green-800'
                  : `bg-${severityColor}-200 text-${severityColor}-800`
              }`}>
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

            {conflict.pattern && !selectedResolution && (
              <div className="flex items-start gap-1.5 text-xs text-gray-600 bg-white bg-opacity-50 p-2 rounded">
                <span className="mt-0.5">📊</span>
                <span className="italic">{conflict.pattern}</span>
              </div>
            )}

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

      {/* Resolution Options (Expanded) */}
      {expanded && !selectedResolution && (
        <div className="p-4 bg-white border-t border-gray-200">
          <h4 className="font-semibold text-sm text-gray-700 mb-3">
            Choose a resolution:
          </h4>
          
          <div className="space-y-2">
            {conflict.resolutionOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleResolve(option)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  option.recommended 
                    ? 'border-blue-400 bg-blue-50 hover:bg-blue-100' 
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start gap-2">
                  {option.recommended && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded font-semibold mt-1">
                      RECOMMENDED
                    </span>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-1">
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">
                      {option.reasoning}
                    </p>
                    {option.autoMessage && (
                      <div className="text-xs text-gray-500 bg-white p-2 rounded mt-2 border border-gray-200">
                        <span className="font-semibold">Auto-message: </span>
                        <span className="italic">"{option.autoMessage}"</span>
                      </div>
                    )}
                    {option.impact && (
                      <div className="text-xs text-blue-700 mt-1">
                        <span className="font-semibold">Impact: </span>
                        {option.impact}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
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