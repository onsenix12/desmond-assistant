import React, { useState } from 'react';
import { AlertTriangle, Sparkles } from 'lucide-react';
import ConflictCard from './ConflictCard';
import SmartActionCard from './SmartActionCard';
import PatternManager from './PatternManager';
import SuggestionHandler from './SuggestionHandler';
import { getColorClasses } from '../utils/helper';

const IntelligencePanel = ({ 
  conflicts, 
  suggestions, 
  patterns,
  appliedPatterns = new Set(),
  onResolveConflict,
  onApplySuggestion,
  onPatternAction
}) => {
  const [activeTab, setActiveTab] = useState('conflicts'); // 'conflicts', 'suggestions', 'patterns'

  const visibleConflicts = conflicts || [];
  const visibleSuggestions = suggestions || [];
  const visiblePatterns = [];

  // Insights removed per feedback – no pattern actions.

  const handleSuggestionActionWrapper = (suggestion, option) => {
    // Call the SuggestionHandler logic directly
    let action = { type: 'NO_CHANGE' };
    
    switch (suggestion.action) {
      case 'create_event':
        if (suggestion.eventDetails) {
          action = {
            type: 'CREATE_EVENT',
            event: {
              ...suggestion.eventDetails,
              id: `suggestion_${Date.now()}`,
              createdBy: 'suggestion'
            }
          };
        }
        break;
        
      case 'suggest_exercise':
        if (option && option.date && option.time) {
          const [startTime, endTime] = option.time.split(' - ');
          const [hours, minutes] = startTime.replace(' AM', '').replace(' PM', '').split(':');
          const isPM = option.time.includes(' PM') && hours !== '12';
          const hour24 = isPM ? (parseInt(hours) + 12) : parseInt(hours);
          
          const startISO = `${option.date}T${String(hour24).padStart(2, '0')}:${String(parseInt(minutes)).padStart(2, '0')}:00`;
          const endISO = `${option.date}T${String(hour24 + 1).padStart(2, '0')}:${String(parseInt(minutes)).padStart(2, '0')}:00`;
          
          action = {
            type: 'CREATE_EVENT',
            event: {
              id: `exercise_${Date.now()}`,
              title: 'Gym Session 💪',
              start: startISO,
              end: endISO,
              type: 'personal',
              notes: `Scheduled via smart suggestion - ${option.reason}`,
              createdBy: 'suggestion'
            }
          };
        }
        break;
        
      case 'suggest_to_family':
        action = { type: 'SEND_MESSAGE', message: suggestion.autoMessage };
        break;
        
      case 'confirm_weather':
        if (suggestion.id === 's3') {
          action = {
            type: 'UPDATE_EVENT',
            eventId: 'e21',
            updates: {
              notes: 'Family Hiking (Weather confirmed - everyone good to go!)',
              confirmed: true
            }
          };
        }
        break;
        
      case 'create_study_block':
        if (suggestion.recommendation) {
          action = {
            type: 'CREATE_EVENT',
            event: {
              id: `study_${Date.now()}`,
              title: 'MITB Study Session',
              start: '2025-10-16T20:00:00',
              end: '2025-10-16T22:00:00',
              type: 'study',
              notes: 'Data Analytics assignment work',
              createdBy: 'suggestion'
            }
          };
        }
        break;
        
      case 'permanent_block':
        if (suggestion.blockDetails) {
          const weekDays = ['2025-10-20', '2025-10-21', '2025-10-22', '2025-10-23', '2025-10-24'];
          const events = weekDays.map((date, index) => ({
            id: `block_${Date.now()}_${index}`,
            title: suggestion.blockDetails.title,
            start: `${date}T15:30:00`,
            end: `${date}T16:00:00`,
            type: 'personal',
            protected: true,
            notes: `${suggestion.blockDetails.type} - Week of Oct 20-24`,
            createdBy: 'suggestion'
          }));
          action = { type: 'CREATE_EVENTS', events };
        }
        break;
        
      default:
        if (option) {
          action = {
            type: 'UPDATE_EVENT',
            eventId: 'e20',
            updates: {
              title: `Dinner at ${option.name}`,
              location: option.name,
              notes: `${option.cuisine} - ${option.reason}`,
              end: '2025-10-18T20:30:00',
              createdBy: 'suggestion'
            }
          };
        }
        break;
    }
    
    // Call the parent's onApplySuggestion with the suggestion, option, and action
    if (onApplySuggestion) {
      onApplySuggestion(suggestion, option, action);
    }
  };

  const tabs = [
    { 
      id: 'conflicts', 
      label: 'Conflicts', 
      icon: AlertTriangle, 
      count: visibleConflicts.length,
      color: 'red'
    },
    { 
      id: 'suggestions', 
      label: 'Smart Actions', 
      icon: Sparkles, 
      count: visibleSuggestions.length,
      color: 'blue'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg h-full flex flex-col" data-testid="conflicts-panel">
      {/* Header Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-center gap-1 sm:gap-2 transition-all border-b-2 touch-manipulation ${
                  isActive 
                    ? `${getColorClasses(tab.color, 'border')} ${getColorClasses(tab.color, 'light')}` 
                    : 'border-transparent hover:bg-gray-50 active:bg-gray-100'
                }`}
                aria-label={`${tab.label} tab${tab.count > 0 ? `, ${tab.count} items` : ''}`}
                aria-selected={isActive}
                role="tab"
              >
                <TabIcon size={16} className={`sm:w-[18px] sm:h-[18px] ${isActive ? getColorClasses(tab.color, 'text') : 'text-gray-500'}`} />
                <span className={`text-xs sm:text-sm font-semibold ${
                  isActive ? getColorClasses(tab.color, 'text') : 'text-gray-600'
                }`}>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </span>
                {tab.count > 0 && (
                  <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                    isActive 
                      ? `${getColorClasses(tab.color, 'bg')} text-white` 
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {/* Conflicts Tab */}
        {activeTab === 'conflicts' && (
          <div className="space-y-3 sm:space-y-4">
            {visibleConflicts.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="inline-block p-3 sm:p-4 bg-green-100 rounded-full mb-3 sm:mb-4">
                  <AlertTriangle size={24} className="text-green-600 sm:w-8 sm:h-8" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">No Conflicts</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Your schedule is looking smooth! ✨
                </p>
              </div>
            ) : (
              <>
                <div className="mb-3 sm:mb-4">
                  <h3 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">
                    Schedule Conflicts ({visibleConflicts.length})
                  </h3>
                  <p className="text-xs text-gray-600">
                    One-click resolutions powered by pattern detection
                  </p>
                </div>
                
                {visibleConflicts.map((conflict) => (
                  <div key={conflict.id}>
                    <ConflictCard 
                      conflict={conflict}
                      onResolve={onResolveConflict}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <div className="space-y-3 sm:space-y-4" data-testid="suggestions-panel">
            {visibleSuggestions.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="inline-block p-3 sm:p-4 bg-blue-100 rounded-full mb-3 sm:mb-4">
                  <Sparkles size={24} className="text-blue-600 sm:w-8 sm:h-8" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">All Caught Up</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  No new suggestions right now. Check back later!
                </p>
              </div>
            ) : (
              <>
                <div className="mb-3 sm:mb-4">
                  <h3 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">
                    Smart Suggestions ({visibleSuggestions.length})
                  </h3>
                  <p className="text-xs text-gray-600">
                    AI-powered recommendations based on your patterns
                  </p>
                </div>
                
                {visibleSuggestions.map((suggestion) => (
                  <div key={suggestion.id}>
                    <SmartActionCard 
                      suggestion={suggestion}
                      onAction={handleSuggestionActionWrapper}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Insights removed */}
      </div>
    </div>
  );
};

export default IntelligencePanel;
