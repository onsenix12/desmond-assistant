import React, { useState } from 'react';
import CalendarGrid from './CalendarGrid';
import IntelligencePanel from './IntelligencePanel';
import CalendarHeader from './CalendarHeader';
import SuccessMessages from './SuccessMessages';
import MobileChat from './MobileChat';
import MobileNavigation from './MobileNavigation';
import EventList from './EventList';
import SelectedDayDetail from './SelectedDayDetail';
import CalendarErrorBoundary from './CalendarErrorBoundary';
import ConflictResolver from './ConflictResolver';
import SuggestionHandler from './SuggestionHandler';
import PatternManager from './PatternManager';
import { calendarEvents, conflicts, smartSuggestions, patterns } from '../utils/demoData';
import { formatDate, formatTime, sortEventsByTime, formatConflictDate } from '../utils/helper';


const CalendarDashboard = ({ connectedApps }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(9); // October (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);
  const [events, setEvents] = useState(calendarEvents);
  const [resolvedConflicts, setResolvedConflicts] = useState(new Set());
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [lastResolvedConflict, setLastResolvedConflict] = useState(null);
  const [showPatternSuccess, setShowPatternSuccess] = useState(false);
  const [lastPatternAction, setLastPatternAction] = useState(null);
  const [appliedSuggestions, setAppliedSuggestions] = useState(new Set());
  const [appliedPatterns, setAppliedPatterns] = useState(new Set());
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: "Hi! I'm your calendar assistant. I can help you with schedule conflicts, productivity insights, and family time optimization. What would you like to know? 🤖",
      timestamp: new Date(),
      suggestions: [
        "Check my conflicts",
        "How's my family time?",
        "When am I most productive?",
        "What's my schedule today?"
      ]
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Count connected apps
  const connectedCount = Object.values(connectedApps || {}).filter(
    app => app.status === 'connected'
  ).length;

  // Get events for selected date
  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    const year = selectedDate.year;
    const month = String(selectedDate.month + 1).padStart(2, '0');
    const day = String(selectedDate.day).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return sortEventsByTime(
      events.filter(event => event.start.startsWith(dateStr))
    );
  };

  const selectedDayEvents = getEventsForSelectedDate();

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Handle conflict resolution logic
  const handleConflictResolution = (conflict, resolution) => {
    console.log('Resolving conflict:', conflict.id, 'with', resolution.label);
    
    // Apply resolution based on action type
    switch (resolution.action) {
      case 'reschedule':
        // Move the conflicting event to a new time
        if (conflict.id === 'c1') { // Monday Evening Crunch
          // Move boss meeting from 6pm to 4:30pm
          if (conflict.events.includes('e4')) {
            return {
              type: 'UPDATE_EVENT',
              eventId: 'e4',
              updates: {
                start: '2025-10-13T16:30:00',
                end: '2025-10-13T17:30:00',
                conflict: false,
                conflictsWith: [],
                title: 'Boss wants to meet',
                notes: 'Rescheduled to accommodate family dinner'
              }
            };
          }
        }
        if (conflict.id === 'c2') { // Coffee Time Invasion
          // Move meeting that conflicts with coffee time
          if (conflict.events.includes('e12')) {
            return {
              type: 'UPDATE_EVENT',
              eventId: 'e12',
              updates: {
                start: '2025-10-15T15:00:00',
                end: '2025-10-15T15:30:00',
                conflict: false,
                conflictsWith: [],
                title: 'Meeting overlap',
                notes: 'Shortened to respect coffee break'
              }
            };
          }
        }
        break;
        
      case 'family_adjust':
        // Adjust family event time and clear conflict state
        return {
          type: 'UPDATE_EVENT',
          eventId: 'e5',
          updates: {
            start: '2025-10-13T19:00:00',
            end: '2025-10-13T20:00:00',
            conflict: false,
            conflictsWith: [],
            notes: 'Adjusted to accommodate work meeting'
          }
        };
        
      case 'personal_adjust':
        return {
          type: 'UPDATE_EVENT',
          eventId: 'e11',
          updates: {
            start: '2025-10-15T16:30:00',
            end: '2025-10-15T17:00:00',
            conflict: false,
            conflictsWith: [],
            notes: 'Moved to accommodate work meeting'
          }
        };
        
      case 'permanent_block':
        // Create a permanent block based on conflict type
        if (conflict.id === 'c2') { // Coffee Time Invasion
          return {
            type: 'UPDATE_EVENT',
            eventId: 'e11',
            updates: {
              title: 'Focus Time ☕',
              protected: true,
              recurring: 'daily',
              notes: 'Protected time - no meetings allowed',
              conflict: false,
              conflictsWith: [],
              createdBy: 'system'
            }
          };
        } else if (conflict.id === 'c1') { // Monday Evening Crunch
          return {
            type: 'UPDATE_EVENT',
            eventId: 'e5',
            updates: {
              start: '2025-10-13T18:00:00',
              end: '2025-10-13T20:00:00',
              conflict: false,
              conflictsWith: [],
              title: 'Family Dinner Time 🍽️',
              notes: 'Protected family time - no work meetings allowed',
              protected: true,
              recurring: 'weekly'
            }
          };
        }
        break;
        
      case 'decline':
        // Remove the conflicting event
        return {
          type: 'REMOVE_EVENTS',
          eventIds: conflict.events
        };
        
      case 'join':
        // Join an existing event (like joining Jayden's Pokémon event)
        return {
          type: 'UPDATE_EVENT',
          eventId: 'e19',
          updates: {
            attendees: ['Emily', 'Jayden', 'Desmond'],
            notes: 'Jayden\'s Pokémon Event (Desmond joining)'
          }
        };
        
      case 'create_event':
        // Create a new event (like family lunch)
        if (conflict.id === 'c3') { // Weekend Schedule Jam
          return {
            type: 'CREATE_EVENT',
            event: {
              id: `lunch_${Date.now()}`,
              title: 'Family Lunch',
              start: '2025-10-18T12:00:00',
              end: '2025-10-18T13:00:00',
              type: 'family',
              attendees: ['Emily', 'Jayden', 'Desmond'],
              notes: 'Midday family connection',
              createdBy: 'system'
            }
          };
        }
        break;
        
      case 'accept':
        // Accept the current schedule as is
        return { type: 'NO_CHANGE' };
        
      default:
        return { type: 'NO_CHANGE' };
    }
    
    return { type: 'NO_CHANGE' };
  };

  // Handle suggestion application logic
  const handleSuggestionApplication = (suggestion, option) => {
    console.log('Applying suggestion:', suggestion.id, option);
    
    switch (suggestion.action) {
      case 'create_event':
        // Create a new event (like gym session)
        if (suggestion.eventDetails) {
          return {
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
          
          return {
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
        // Send message to family about schedule change
        return {
          type: 'SEND_MESSAGE',
          message: suggestion.message || 'Family notification sent'
        };
        
      case 'create_family_block':
        // Create recurring family time blocks
        return {
          type: 'CREATE_EVENTS',
          events: suggestion.events || []
        };
        
      default:
        return { type: 'NO_CHANGE' };
    }
    
    return { type: 'NO_CHANGE' };
  };

  // Handle pattern application logic
  const handlePatternApplication = (pattern) => {
    console.log('Applying pattern action:', pattern.id, pattern.action);
    
    switch (pattern.action) {
      case 'create_recurring_block':
        // Create Monday evening family time blocks (only Mondays)
        if (pattern.id === 'p1') {
          return {
            type: 'CREATE_EVENT',
            event: {
              id: `family_block_${Date.now()}_1`,
              title: 'Family Time 🍽️',
              start: '2025-10-20T18:00:00', // Monday Oct 20
              end: '2025-10-20T20:00:00',
              type: 'family',
              recurring: 'weekly',
              protected: true,
              notes: 'Protected family time - no work meetings allowed',
              createdBy: 'pattern'
            }
          };
        }
        break;
        
      case 'enable_focus_blocks':
        // Enable daily focus time blocks
        return {
          type: 'ENABLE_FEATURE',
          message: 'Daily focus time blocks enabled! Your 3:30pm coffee break is now protected.'
        };
        
      case 'create_weekend_family':
        // Create weekend family activities
        if (pattern.id === 'p3') {
          return {
            type: 'CREATE_EVENTS',
            events: [
              {
                id: `weekend_${Date.now()}_1`,
                title: 'Family Hiking 🥾',
                start: '2025-10-19T08:00:00',
                end: '2025-10-19T11:00:00',
                type: 'family',
                attendees: ['Emily', 'Jayden', 'Desmond'],
                notes: 'Weekly family outdoor activity',
                createdBy: 'pattern'
              },
              {
                id: `weekend_${Date.now()}_2`,
                title: 'Pokémon GO Adventure 🎮',
                start: '2025-10-19T15:00:00',
                end: '2025-10-19T17:00:00',
                type: 'family',
                attendees: ['Jayden', 'Desmond'],
                notes: 'Father-son gaming time',
                createdBy: 'pattern'
              }
            ]
          };
        }
        break;
        
      default:
        return { type: 'NO_CHANGE' };
    }
    
    return { type: 'NO_CHANGE' };
  };

  // Helper function to check if an event should show strikethrough
  // Only events that were "cancelled" or "moved away" should get strikethrough
  const shouldEventShowStrikethrough = (event) => {
    if (!event.conflict || !event.conflictsWith) return false;
    
    // Check if any conflict involving this event has been resolved
    const hasResolvedConflict = conflicts.some(conflict => 
      conflict.events.includes(event.id) && 
      resolvedConflicts.has(conflict.id)
    );
    
    if (!hasResolvedConflict) return false;
    
    // Only show strikethrough for events that were moved away or cancelled
    // Events that were adjusted to resolve the conflict (like family dinner moved to 7pm) should NOT get strikethrough
    return event.notes && (
      event.notes.includes('Rescheduled to accommodate') || 
      event.notes.includes('Shortened to respect')
    );
  };

  const handleResolveConflict = (conflict, resolution) => {
    console.log('Resolving conflict:', conflict.id, 'with', resolution.label);
    
    // Mark conflict as resolved
    setResolvedConflicts(prev => new Set([...prev, conflict.id]));
    setLastResolvedConflict({ conflict, resolution });
    setShowSuccessMessage(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccessMessage(false), 3000);
    
    // Handle conflict resolution directly
    const action = handleConflictResolution(conflict, resolution);
    
    // Apply the action to events
    if (action.type === 'UPDATE_EVENT') {
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === action.eventId 
            ? { ...event, ...action.updates }
            : event
        )
      );
    } else if (action.type === 'REMOVE_EVENTS') {
      setEvents(prevEvents => 
        prevEvents.filter(event => !action.eventIds.includes(event.id))
      );
    } else if (action.type === 'CREATE_EVENT') {
      setEvents(prevEvents => [...prevEvents, action.event]);
    } else if (action.type === 'CREATE_EVENTS') {
      setEvents(prevEvents => [...prevEvents, ...action.events]);
    }
  };

  const handleApplySuggestion = (suggestion, option, action) => {
    console.log('Applying suggestion:', suggestion.id, option);
    
    // Mark suggestion as applied so it disappears
    setAppliedSuggestions(prev => new Set([...prev, suggestion.id]));
    
    // Apply the action to events
    if (action.type === 'UPDATE_EVENT') {
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === action.eventId 
            ? { ...event, ...action.updates }
            : event
        )
      );
    } else if (action.type === 'CREATE_EVENT') {
      setEvents(prevEvents => [...prevEvents, action.event]);
    } else if (action.type === 'CREATE_EVENTS') {
      setEvents(prevEvents => [...prevEvents, ...action.events]);
    } else if (action.type === 'SEND_MESSAGE') {
      console.log('Sending message:', action.message);
    }
  };

  const handleDismiss = (itemId, type) => {
    console.log('Dismissing', type, itemId);
  };

  const handlePatternAction = (pattern, action) => {
    console.log('Applying pattern action:', pattern.id, pattern.action);
    
    // Check if this pattern has already been applied
    if (appliedPatterns.has(pattern.id)) {
      console.log('Pattern already applied, skipping duplicate creation');
      return;
    }
    
    // Mark pattern as applied
    setAppliedPatterns(prev => new Set([...prev, pattern.id]));
    
    // Apply the action to events
    if (action.type === 'CREATE_EVENT') {
      setEvents(prevEvents => [...prevEvents, action.event]);
    } else if (action.type === 'CREATE_EVENTS') {
      setEvents(prevEvents => [...prevEvents, ...action.events]);
    } else if (action.type === 'ENABLE_FEATURE') {
      setLastPatternAction({ pattern, action: action.message });
      setShowPatternSuccess(true);
      setTimeout(() => setShowPatternSuccess(false), 3000);
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: chatInput.trim(),
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Generate bot response based on user input
    setTimeout(() => {
      const botResponse = generateBotResponse(chatInput.trim());
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        message: botResponse.message || botResponse,
        suggestions: botResponse.suggestions || [],
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
      
      // Handle any actions that need to be performed
      if (botResponse.action) {
        handleChatAction(botResponse.action);
      }
    }, 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: suggestion,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Generate bot response based on suggestion
    setTimeout(() => {
      const botResponse = generateBotResponse(suggestion);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        message: botResponse.message || botResponse,
        suggestions: botResponse.suggestions || [],
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
      
      // Handle any actions that need to be performed
      if (botResponse.action) {
        handleChatAction(botResponse.action);
      }
    }, 1000);
  };

  // Handle chat actions that create events
  const handleChatAction = (action) => {
    switch (action) {
      case 'create_family_protection_blocks':
        const familyBlocks = [
          {
            id: `family_protection_${Date.now()}_1`,
            title: 'Family Dinner Time 🍽️',
            start: '2025-10-13T18:00:00', // Monday
            end: '2025-10-13T20:00:00',
            type: 'family',
            protected: true,
            recurring: 'weekly',
            notes: 'Protected family time - no work meetings allowed',
            createdBy: 'system'
          },
          {
            id: `family_protection_${Date.now()}_2`,
            title: 'Family Dinner Time 🍽️',
            start: '2025-10-20T18:00:00', // Next Monday
            end: '2025-10-20T20:00:00',
            type: 'family',
            protected: true,
            recurring: 'weekly',
            notes: 'Protected family time - no work meetings allowed',
            createdBy: 'system'
          },
          {
            id: `family_protection_${Date.now()}_3`,
            title: 'Family Dinner Time 🍽️',
            start: '2025-10-27T18:00:00', // Following Monday
            end: '2025-10-27T20:00:00',
            type: 'family',
            protected: true,
            recurring: 'weekly',
            notes: 'Protected family time - no work meetings allowed',
            createdBy: 'system'
          }
        ];
        setEvents(prevEvents => [...prevEvents, ...familyBlocks]);
        break;
        
      case 'schedule_morning_meeting':
        const morningMeeting = {
          id: `morning_meeting_${Date.now()}`,
          title: 'Strategic Planning Session',
          start: '2025-10-14T09:30:00', // Tuesday morning
          end: '2025-10-14T10:30:00',
          type: 'work',
          priority: 'high',
          notes: 'Scheduled during optimal productivity window',
          createdBy: 'suggestion'
        };
        setEvents(prevEvents => [...prevEvents, morningMeeting]);
        break;
        
      case 'block_focus_time':
        const focusBlocks = [
          {
            id: `focus_block_${Date.now()}_1`,
            title: 'Deep Work Block 🧠',
            start: '2025-10-14T14:00:00', // Tuesday
            end: '2025-10-14T16:00:00',
            type: 'personal',
            protected: true,
            notes: 'Protected focus time - no interruptions',
            createdBy: 'suggestion'
          },
          {
            id: `focus_block_${Date.now()}_2`,
            title: 'Deep Work Block 🧠',
            start: '2025-10-16T14:00:00', // Thursday
            end: '2025-10-16T16:00:00',
            type: 'personal',
            protected: true,
            notes: 'Protected focus time - no interruptions',
            createdBy: 'suggestion'
          }
        ];
        setEvents(prevEvents => [...prevEvents, ...focusBlocks]);
        break;
        
      case 'add_exercise_sessions':
        const exerciseSessions = [
          {
            id: `exercise_${Date.now()}_1`,
            title: 'Morning Run 🏃‍♂️',
            start: '2025-10-14T07:00:00', // Tuesday
            end: '2025-10-14T08:00:00',
            type: 'personal',
            notes: 'Marina Bay Sands running route',
            createdBy: 'suggestion'
          },
          {
            id: `exercise_${Date.now()}_2`,
            title: 'Gym Session 💪',
            start: '2025-10-16T07:00:00', // Thursday
            end: '2025-10-16T08:00:00',
            type: 'personal',
            notes: 'Strength training session',
            createdBy: 'suggestion'
          },
          {
            id: `exercise_${Date.now()}_3`,
            title: 'Weekend Hike 🥾',
            start: '2025-10-19T08:00:00', // Saturday
            end: '2025-10-19T11:00:00',
            type: 'personal',
            notes: 'Family hiking activity',
            createdBy: 'suggestion'
          }
        ];
        setEvents(prevEvents => [...prevEvents, ...exerciseSessions]);
        break;
        
      case 'create_buffer_time':
        const bufferEvents = [
          {
            id: `buffer_${Date.now()}_1`,
            title: 'Buffer Time ⏰',
            start: '2025-10-13T10:00:00', // Monday
            end: '2025-10-13T10:15:00',
            type: 'personal',
            notes: 'Transition time between meetings',
            createdBy: 'suggestion'
          },
          {
            id: `buffer_${Date.now()}_2`,
            title: 'Buffer Time ⏰',
            start: '2025-10-13T12:00:00', // Monday
            end: '2025-10-13T12:15:00',
            type: 'personal',
            notes: 'Transition time between meetings',
            createdBy: 'suggestion'
          }
        ];
        setEvents(prevEvents => [...prevEvents, ...bufferEvents]);
        break;
        
      default:
        console.log('Unknown chat action:', action);
    }
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Conflict-related queries
    if (input.includes('conflict') || input.includes('overlap') || input.includes('busy') || input.includes('check my conflicts')) {
      const activeConflicts = conflicts.filter(conflict => !resolvedConflicts.has(conflict.id));
      
      if (activeConflicts.length === 0) {
        return {
          message: "✅ **Great news!** No conflicts detected in your schedule.\n\nYour calendar looks clean and well-organized. Keep up the good work! 🎉",
          suggestions: ["How's my family time?", "When am I most productive?", "What's my schedule today?"]
        };
      }
      
      let conflictMessage = "🚨 **Schedule Conflicts Detected**\n\n";
      activeConflicts.forEach((conflict, index) => {
        conflictMessage += `**${index + 1}. ${conflict.title}**\n`;
        conflictMessage += `📅 Date: ${formatConflictDate(conflict.date)}\n`;
        conflictMessage += `⚠️ Issue: ${conflict.description}\n`;
        conflictMessage += `💡 Impact: ${conflict.impact}\n`;
        if (conflict.pattern) {
          conflictMessage += `📊 Pattern: ${conflict.pattern}\n`;
        }
        conflictMessage += `\n`;
      });
      
      conflictMessage += "Would you like me to help resolve any of these conflicts?";
      
      return {
        message: conflictMessage,
        suggestions: ["Resolve Monday Evening Crunch", "How's my family time?", "When am I most productive?"]
      };
    }
    
    // Family time queries
    if (input.includes('family') || input.includes('dinner') || input.includes('weekend') || input.includes('how\'s my family time')) {
      return {
        message: "👨‍👩‍👦 **Family Time Analysis**\n\n📊 **Current Status:**\n• 3 family events scheduled\n• 1 work conflict affecting family time\n\n⚠️ **Main Issue:** Monday Evening Crunch\nYour boss scheduled a 6pm meeting that overlaps with family dinner at 6:30pm.\n\n💡 **Recommendation:** Set up automatic family time protection blocks to prevent work from encroaching on family moments.\n\nWould you like me to create these protection blocks?",
        suggestions: ["Create family protection blocks", "Check my conflicts", "When am I most productive?"]
      };
    }
    
    // Productivity queries
    if (input.includes('productive') || input.includes('focus') || input.includes('work') || input.includes('when am i most productive')) {
      return {
        message: "⚡ **Productivity Analysis**\n\n📈 **Peak Performance Times:**\n• Morning: 9-11am (2 important meetings)\n• Afternoon: 2-4pm (focus time)\n\n📊 **Current Schedule:**\n• 8 work events this week\n• 2 morning meetings (optimal time)\n\n💡 **Recommendations:**\n• Schedule important tasks during 9-11am\n• Protect 2-4pm for deep work\n• Add buffer time between meetings\n\nWould you like me to suggest optimal times for your next important task?",
        suggestions: ["Suggest optimal times", "How's my family time?", "Check my conflicts"]
      };
    }
    
    // Schedule queries
    if (input.includes('schedule') || input.includes('today') || input.includes('tomorrow') || input.includes('what\'s my schedule today')) {
      return {
        message: "📅 **Today's Schedule**\n\n⏰ **Next Event:** Weekly Team Sync at 9:00 AM\n\n📋 **Your Day:**\n• 9:00 AM - Weekly Team Sync\n• 10:30 AM - Budget Planning Review\n• 3:30 PM - Coffee Break ☕\n• 6:00 PM - Boss wants to meet (CONFLICT!)\n• 6:30 PM - Family Dinner\n\n💡 **Insight:** Busy day ahead! Consider adding buffer time between meetings.\n\nWould you like me to analyze your week or suggest optimizations?",
        suggestions: ["Analyze my week", "How's my family time?", "When am I most productive?"]
      };
    }
    
    // Specific conflict resolution
    if (input.includes('resolve monday evening crunch') || input.includes('resolve monday evening')) {
      const mondayConflict = conflicts.find(c => c.id === 'c1' && !resolvedConflicts.has(c.id));
      if (mondayConflict) {
        return {
          message: "🔧 **Resolving Monday Evening Crunch**\n\nHere are your options:\n\n**Option 1: Move Boss Meeting** ⏰\n• Reschedule to 4:30pm\n• Frees you for family dinner\n• Still before end of day\n\n**Option 2: Adjust Family Dinner** 👨‍👩‍👦\n• Move dinner to 7:00pm\n• One-time adjustment\n• Minimal disruption\n\n**Option 3: Split the Difference** ⚖️\n• Shorten meeting to 30 minutes\n• Start dinner at 6:45pm\n• Compromise solution\n\nWhich option would you prefer?",
          suggestions: ["Move boss meeting to 4:30pm", "Ask family to shift dinner to 7pm", "Split the difference - 30min meeting"]
        };
      } else {
        return {
          message: "✅ The Monday Evening Crunch has already been resolved! No action needed.",
          suggestions: ["Check my conflicts", "How's my family time?", "When am I most productive?"]
        };
      }
    }
    
    // Conflict resolution actions
    if (input.includes('move boss meeting to 4:30pm')) {
      const mondayConflict = conflicts.find(c => c.id === 'c1' && !resolvedConflicts.has(c.id));
      if (mondayConflict) {
        // Trigger the conflict resolution
        const resolution = mondayConflict.resolutionOptions.find(opt => opt.id === 'r1');
        if (resolution) {
          handleResolveConflict(mondayConflict, resolution);
          return {
            message: "✅ **Conflict Resolved!**\n\nI've moved the boss meeting to 4:30pm and sent a message:\n\n\"Can we move to 4:30pm? Have family commitment at 6:30pm.\"\n\nYour family dinner at 6:30pm is now protected! 🎉",
            suggestions: ["Check my conflicts", "How's my family time?", "What's my schedule today?"]
          };
        }
      }
      return {
        message: "❌ Sorry, I couldn't find that conflict to resolve.",
        suggestions: ["Check my conflicts", "How's my family time?", "When am I most productive?"]
      };
    }
    
    if (input.includes('ask family to shift dinner to 7pm')) {
      const mondayConflict = conflicts.find(c => c.id === 'c1' && !resolvedConflicts.has(c.id));
      if (mondayConflict) {
        const resolution = mondayConflict.resolutionOptions.find(opt => opt.id === 'r2');
        if (resolution) {
          handleResolveConflict(mondayConflict, resolution);
          return {
            message: "✅ **Conflict Resolved!**\n\nI've sent a WhatsApp message to Emily:\n\n\"Can we do 7pm dinner tonight? Work meeting ran over.\"\n\nFamily dinner has been moved to 7:00pm! 👨‍👩‍👦",
            suggestions: ["Check my conflicts", "How's my family time?", "What's my schedule today?"]
          };
        }
      }
      return {
        message: "❌ Sorry, I couldn't find that conflict to resolve.",
        suggestions: ["Check my conflicts", "How's my family time?", "When am I most productive?"]
      };
    }
    
    if (input.includes('split the difference - 30min meeting')) {
      const mondayConflict = conflicts.find(c => c.id === 'c1' && !resolvedConflicts.has(c.id));
      if (mondayConflict) {
        const resolution = mondayConflict.resolutionOptions.find(opt => opt.id === 'r3');
        if (resolution) {
          handleResolveConflict(mondayConflict, resolution);
          return {
            message: "✅ **Conflict Resolved!**\n\nI've shortened the meeting to 30 minutes and moved family dinner to 6:45pm.\n\nBoth commitments are now accommodated! ⚖️",
            suggestions: ["Check my conflicts", "How's my family time?", "What's my schedule today?"]
          };
        }
      }
      return {
        message: "❌ Sorry, I couldn't find that conflict to resolve.",
        suggestions: ["Check my conflicts", "How's my family time?", "When am I most productive?"]
      };
    }
    
    // Suggest optimal times
    if (input.includes('suggest optimal times') || input.includes('optimal times')) {
      return {
        message: "⏰ **Optimal Time Suggestions**\n\nBased on your productivity patterns:\n\n**🌅 Morning Peak (9:00-11:00 AM)**\n• Best for: Important meetings, strategic planning\n• Current: 2 meetings scheduled ✅\n• Available: Tuesday, Wednesday, Friday\n\n**🌆 Afternoon Focus (2:00-4:00 PM)**\n• Best for: Deep work, analysis, reports\n• Current: 1 focus block scheduled ✅\n• Available: Monday, Tuesday, Thursday\n\n**🌙 Evening Planning (7:00-9:00 PM)**\n• Best for: Personal projects, family planning\n• Current: Family time protected ✅\n• Available: Tuesday, Wednesday, Thursday\n\nWould you like me to schedule something specific?",
        suggestions: ["Schedule morning meeting", "Block afternoon focus time", "How's my family time?"]
      };
    }
    
    // Analyze my week
    if (input.includes('analyze my week') || input.includes('week analysis')) {
      return {
        message: "📊 **Weekly Schedule Analysis**\n\n**📈 This Week's Overview:**\n• Total events: 12\n• Work events: 8 (67%)\n• Family events: 3 (25%)\n• Personal time: 1 (8%)\n\n**⚠️ Key Insights:**\n• Monday is your busiest day (5 events)\n• Family time concentrated on weekends\n• Missing: Regular exercise blocks\n• Good: Consistent morning meetings\n\n**💡 Recommendations:**\n• Add 2-3 exercise sessions\n• Create buffer time between meetings\n• Consider earlier family dinner on weekdays\n\nWould you like me to implement any of these suggestions?",
        suggestions: ["Add exercise sessions", "Create buffer time", "How's my family time?"]
      };
    }
    
    // Schedule morning meeting
    if (input.includes('schedule morning meeting') || input.includes('morning meeting')) {
      return {
        message: "✅ **Morning Meeting Scheduled!**\n\nI've scheduled a Strategic Planning Session for Tuesday 9:30-10:30 AM during your peak productivity window.\n\nThis time slot is optimal for:\n• Strategic thinking\n• Important decisions\n• High-priority work\n\nYour calendar has been updated! 📅",
        suggestions: ["Block afternoon focus time", "How's my family time?", "Check my conflicts"],
        action: 'schedule_morning_meeting'
      };
    }
    
    // Block afternoon focus time
    if (input.includes('block afternoon focus time') || input.includes('focus time')) {
      return {
        message: "✅ **Focus Time Blocks Created!**\n\nI've scheduled protected focus time blocks:\n\n🧠 **Focus Sessions:**\n• Tuesday 2:00-4:00 PM\n• Thursday 2:00-4:00 PM\n• Marked as 'protected'\n• No meetings can be scheduled\n\nPerfect for deep work, analysis, and strategic thinking! 🎯",
        suggestions: ["How's my family time?", "Check my conflicts", "When am I most productive?"],
        action: 'block_focus_time'
      };
    }
    
    // Add exercise sessions
    if (input.includes('add exercise sessions') || input.includes('exercise sessions')) {
      return {
        message: "✅ **Exercise Sessions Added!**\n\nI've scheduled regular exercise sessions:\n\n🏃‍♂️ **Your New Routine:**\n• Tuesday 7:00 AM - Morning Run\n• Thursday 7:00 AM - Gym Session\n• Saturday 8:00 AM - Weekend Hike\n\nThis balances your work schedule with health and family time! 💪",
        suggestions: ["How's my family time?", "Check my conflicts", "When am I most productive?"],
        action: 'add_exercise_sessions'
      };
    }
    
    // Create buffer time
    if (input.includes('create buffer time') || input.includes('buffer time')) {
      return {
        message: "✅ **Buffer Time Added!**\n\nI've added 15-minute buffer periods between your meetings:\n\n⏰ **Buffer Benefits:**\n• Prevents meeting overruns\n• Allows time to prepare\n• Reduces stress and rushing\n• Improves meeting quality\n\nYour schedule now has breathing room! 😌",
        suggestions: ["How's my family time?", "Check my conflicts", "When am I most productive?"],
        action: 'create_buffer_time'
      };
    }
    
    // Create family protection blocks
    if (input.includes('create family protection blocks') || input.includes('create family protection')) {
      return {
        message: "✅ **Family Protection Blocks Created!**\n\nI've set up recurring family dinner protection blocks:\n\n🛡️ **Protection Details:**\n• Every Monday 6:00-8:00 PM\n• Marked as 'protected' time\n• No work meetings can be scheduled\n• Automatic conflict prevention\n\nYour family time is now protected from work encroachment! 🎉",
        suggestions: ["Check my conflicts", "How's my family time?", "When am I most productive?"],
        action: 'create_family_protection_blocks'
      };
    }
    
    // General help
    if (input.includes('help') || input.includes('what can you do') || input.includes('what else can you help with')) {
      return {
        message: "🤖 **I can help you with:**\n\n🚨 **Conflict Resolution**\n• Identify schedule overlaps\n• Suggest resolution options\n• Implement fixes automatically\n\n👨‍👩‍👦 **Family Time Protection**\n• Analyze family vs work balance\n• Create protection blocks\n• Prevent work encroachment\n\n⚡ **Productivity Optimization**\n• Find your peak performance times\n• Suggest optimal scheduling\n• Protect focus time\n\n📅 **Schedule Analysis**\n• Review your daily/weekly schedule\n• Identify patterns and trends\n• Suggest improvements\n\nWhat would you like to explore?",
        suggestions: ["Check my conflicts", "How's my family time?", "When am I most productive?", "What's my schedule today?"]
      };
    }
    
    // Default response
    return {
      message: "🤔 That's interesting! I can help you analyze your schedule patterns, resolve conflicts, or find the best times for important tasks.\n\nTry one of these common questions:",
      suggestions: ["Check my conflicts", "How's my family time?", "When am I most productive?", "What's my schedule today?"]
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Utility Components */}
      <ConflictResolver 
        conflicts={conflicts}
        resolvedConflicts={resolvedConflicts}
        onResolveConflict={handleResolveConflict}
      />
      <SuggestionHandler 
        suggestions={smartSuggestions}
        appliedSuggestions={appliedSuggestions}
        onApplySuggestion={handleApplySuggestion}
      />
      <PatternManager 
        patterns={patterns}
        appliedPatterns={appliedPatterns}
        onPatternAction={handlePatternAction}
      />
      
      {/* Header */}
      <CalendarHeader connectedCount={connectedCount} />

      {/* Success Messages */}
      <SuccessMessages 
        showSuccessMessage={showSuccessMessage}
        lastResolvedConflict={lastResolvedConflict}
        showPatternSuccess={showPatternSuccess}
        lastPatternAction={lastPatternAction}
      />

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-20 lg:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left: Calendar Grid (70%) */}
          <div className="lg:col-span-2 order-1">
            {/* Mobile: Show selected day events in list view */}
            <EventList 
              selectedDate={selectedDate}
              selectedDayEvents={selectedDayEvents}
              setSelectedDate={setSelectedDate}
              shouldEventShowStrikethrough={shouldEventShowStrikethrough}
            />
            
            <CalendarErrorBoundary>
              <CalendarGrid
                year={currentYear}
                month={currentMonth}
                events={events}
                conflicts={conflicts.filter(conflict => !resolvedConflicts.has(conflict.id))}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            </CalendarErrorBoundary>

            {/* Selected Day Detail - Desktop only */}
            <SelectedDayDetail 
              selectedDate={selectedDate}
              selectedDayEvents={selectedDayEvents}
              setSelectedDate={setSelectedDate}
              shouldEventShowStrikethrough={shouldEventShowStrikethrough}
            />
          </div>

          {/* Right: Intelligence Panel (30%) */}
          <div className="lg:col-span-1 order-2">
            <CalendarErrorBoundary>
              <IntelligencePanel
                conflicts={conflicts.filter(conflict => !resolvedConflicts.has(conflict.id))}
                suggestions={smartSuggestions.filter(s => !appliedSuggestions.has(s.id))}
                patterns={patterns}
                appliedPatterns={appliedPatterns}
                onResolveConflict={handleResolveConflict}
                onApplySuggestion={handleApplySuggestion}
                onPatternAction={handlePatternAction}
                onDismiss={handleDismiss}
              />
            </CalendarErrorBoundary>
          </div>
        </div>
      </div>

      {/* Mobile Chat Overlay */}
      <MobileChat 
        showMobileChat={showMobileChat}
        setShowMobileChat={setShowMobileChat}
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        handleChatSubmit={handleChatSubmit}
        handleSuggestionClick={handleSuggestionClick}
      />

      {/* Mobile Bottom Navigation */}
      <MobileNavigation 
        showMobileChat={showMobileChat}
        setShowMobileChat={setShowMobileChat}
      />
    </div>
  );
};

export default CalendarDashboard;