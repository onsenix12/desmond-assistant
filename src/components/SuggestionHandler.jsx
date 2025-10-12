import React from 'react';

const SuggestionHandler = ({ 
  suggestions, 
  appliedSuggestions, 
  onApplySuggestion 
}) => {
  const handleApplySuggestion = (suggestion, option) => {
    console.log('Applying suggestion:', suggestion.id, option);
    
    let action = { type: 'NO_CHANGE' };
    
    switch (suggestion.action) {
      case 'create_event':
        // Create a new event (like gym session)
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
        // Create a new exercise event from selected time slot
        if (option && option.date && option.time) {
          const [startTime, endTime] = option.time.split(' - ');
          const [hours, minutes] = startTime.replace(' AM', '').replace(' PM', '').split(':');
          const isPM = option.time.includes(' PM') && hours !== '12';
          const hour24 = isPM ? (parseInt(hours) + 12) : parseInt(hours);
          
          // Create ISO strings directly to avoid timezone issues
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
        // In real app, this would send a message to family group chat
        console.log('Sending family message:', suggestion.autoMessage);
        action = { type: 'SEND_MESSAGE', message: suggestion.autoMessage };
        break;
        
      case 'confirm_weather':
        // Confirm weather for existing event
        if (suggestion.id === 's3') { // MacRitchie hiking suggestion
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
        // Create study time block
        if (suggestion.recommendation) {
          action = {
            type: 'CREATE_EVENT',
            event: {
              id: `study_${Date.now()}`,
              title: 'MITB Study Session',
              start: '2025-10-16T20:00:00', // Thursday night
              end: '2025-10-16T22:00:00',
              type: 'study',
              notes: 'Data Analytics assignment work',
              createdBy: 'suggestion'
            }
          };
        }
        break;
        
      case 'permanent_block':
        // Create week-long protection block (Oct 20-24)
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
          action = {
            type: 'CREATE_EVENTS',
            events
          };
        }
        break;
        
      default:
        // For restaurant suggestions, update existing family dinner instead of creating duplicate
        if (option) {
          action = {
            type: 'UPDATE_EVENT',
            eventId: 'e20', // Family Dinner - TBD
            updates: {
              title: `Dinner at ${option.name}`,
              location: option.name,
              notes: `${option.cuisine} - ${option.reason}`,
              end: '2025-10-18T20:30:00', // Extend to 8:30pm
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
    
    return action;
  };

  // This component doesn't render anything directly
  // It's used as a utility for suggestion handling logic
  return null;
};

export default SuggestionHandler;
