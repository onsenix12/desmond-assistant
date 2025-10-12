import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  UtensilsCrossed,
  Dumbbell,
  Mountain,
  BookOpen,
  Shield
} from 'lucide-react';

const SmartActionCard = ({ suggestion, onAction }) => {
  const [applied, setApplied] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const categoryConfig = {
    restaurant: { icon: UtensilsCrossed, color: 'emerald', label: 'Restaurant' },
    exercise: { icon: Dumbbell, color: 'orange', label: 'Exercise' },
    family: { icon: Mountain, color: 'green', label: 'Family' },
    study: { icon: BookOpen, color: 'blue', label: 'Study' },
    productivity: { icon: Shield, color: 'purple', label: 'Productivity' }
  };

  const config = categoryConfig[suggestion.category] || categoryConfig.productivity;
  const CategoryIcon = config.icon;

  const handleAction = (option = null) => {
    setApplied(true);
    if (option) {
      setSelectedOption(option);
    }
    if (onAction) {
      onAction(suggestion, option);
    }
    
    // Simulate actual functionality based on action type
    if (suggestion.action === 'create_event' || suggestion.action === 'suggest_exercise') {
      console.log('Creating calendar event:', suggestion.eventDetails || option);
      // In a real app, this would call an API to create the event
    } else if (suggestion.action === 'suggest_to_family') {
      console.log('Sending family message:', suggestion.autoMessage);
      // In a real app, this would send a WhatsApp message
    } else if (suggestion.action === 'permanent_block') {
      console.log('Creating permanent time block:', suggestion.blockDetails);
      // In a real app, this would create a recurring calendar block
    }
  };

  return (
    <div className={`border-2 rounded-lg overflow-hidden transition-all ${
      applied 
        ? 'border-green-400 bg-green-50' 
        : `border-${config.color}-200 bg-${config.color}-50`
    }`}>
      {/* Header */}
      <div className={`p-4 ${
        applied ? 'bg-green-100' : `bg-${config.color}-100`
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${
            applied 
              ? 'bg-green-200 text-green-700' 
              : `bg-${config.color}-200 text-${config.color}-700`
          }`}>
            {applied ? (
              <CheckCircle2 size={20} />
            ) : (
              <CategoryIcon size={20} />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                applied
                  ? 'bg-green-200 text-green-800'
                  : `bg-${config.color}-200 text-${config.color}-800`
              }`}>
                {applied ? '✓ APPLIED' : config.label.toUpperCase()}
              </span>
              {!applied && suggestion.oneClickBooking && (
                <span className="text-xs px-2 py-0.5 rounded bg-yellow-200 text-yellow-800 font-semibold">
                  ONE-CLICK
                </span>
              )}
            </div>
            
            <h3 className="font-bold text-gray-800 mb-1">
              {suggestion.title}
            </h3>
            
            <p className="text-sm text-gray-700">
              {suggestion.description}
            </p>

            {applied && selectedOption && (
              <div className="mt-2 flex items-start gap-1.5 text-xs text-green-700 bg-white bg-opacity-50 p-2 rounded">
                <CheckCircle2 size={14} className="mt-0.5" />
                <span className="font-semibold">
                  {selectedOption.name || suggestion.action}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Options / Actions */}
      {!applied && (
        <div className="p-4 bg-white">
          {/* Restaurant Options */}
          {suggestion.category === 'restaurant' && suggestion.options && (
            <div className="space-y-2">
              {suggestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAction(option)}
                  className="w-full text-left p-3 rounded-lg border-2 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800 group-hover:text-emerald-700">
                        {option.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {option.cuisine} • {option.reason}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-emerald-600" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Exercise Time Slots */}
          {suggestion.category === 'exercise' && suggestion.availableSlots && (
            <div className="space-y-2">
              {suggestion.availableSlots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAction(slot)}
                  className="w-full text-left p-3 rounded-lg border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800 group-hover:text-orange-700">
                        {slot.time}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {new Date(slot.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} • {slot.reason}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-orange-600" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Single Action Button */}
          {suggestion.category !== 'restaurant' && !(suggestion.category === 'exercise' && suggestion.availableSlots) && (
            <button
              onClick={() => handleAction()}
              className={`w-full p-3 rounded-lg border-2 font-semibold transition-all ${
                `border-${config.color}-400 bg-${config.color}-600 text-white hover:bg-${config.color}-700`
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Sparkles size={18} />
                <span>
                  {suggestion.action || 'Apply Suggestion'}
                </span>
              </div>
            </button>
          )}

          {/* Additional Context */}
          {suggestion.impact && (
            <div className="mt-3 text-xs text-gray-600 bg-blue-50 p-2 rounded">
              <span className="font-semibold">Impact: </span>
              {suggestion.impact}
            </div>
          )}

          {suggestion.benefit && (
            <div className="mt-2 text-xs text-gray-600 bg-green-50 p-2 rounded">
              <span className="font-semibold">Benefit: </span>
              {suggestion.benefit}
            </div>
          )}

          {suggestion.familyLikelihood && (
            <div className="mt-2 text-xs text-gray-600 bg-purple-50 p-2 rounded">
              <span className="font-semibold">Family likelihood: </span>
              {suggestion.familyLikelihood}
            </div>
          )}

          {suggestion.currentAllocation && (
            <div className="mt-2 text-xs text-gray-600">
              <span className="font-semibold">Current: </span>
              {suggestion.currentAllocation}
            </div>
          )}

          {suggestion.recommendation && (
            <div className="mt-2 text-xs text-blue-700 bg-blue-50 p-2 rounded">
              <span className="font-semibold">💡 Recommendation: </span>
              {suggestion.recommendation}
            </div>
          )}
        </div>
      )}

      {/* Success State */}
      {applied && (
        <div className="p-4 bg-green-50 border-t border-green-200">
          <div className="flex items-start gap-2">
            <CheckCircle2 size={18} className="text-green-600 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-semibold mb-1">Applied successfully!</p>
              {selectedOption && (
                <p className="text-xs">
                  {selectedOption.action || `Booking ${selectedOption.name}`}
                </p>
              )}
              {suggestion.autoMessage && (
                <p className="mt-2 italic text-xs bg-white bg-opacity-50 p-2 rounded border border-green-200">
                  Message: "{suggestion.autoMessage}"
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartActionCard;
