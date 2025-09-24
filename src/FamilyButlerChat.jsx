import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, MoreVertical, Calendar, Clock, Users } from 'lucide-react';

const FamilyButlerChat = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('butler_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 1,
        type: 'assistant',
        content: "Good evening, Desmond! I've synced your work and family calendars for tomorrow. 1 potential conflict needs your call — want to review now?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          "Review calendar conflicts",
          "What should I focus on tomorrow?",
          "Plan a surprise for my family"
        ]
      }
    ];
  });
  const [memory, setMemory] = useState(() => {
    const saved = localStorage.getItem('butler_memory');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      userName: 'Desmond',
      coffeeTime: '3:30 PM',
      lovedOnes: { wife: 'Emily', son: 'Jayden' },
      preferences: {
        cuisines: ['Japanese', 'Korean'],
        weekendActivities: ['hiking', 'museum', 'Pokemon GO'],
        peakHours: ['9:00 AM - 11:00 AM', '7:00 PM - 9:00 PM']
      },
      surprises: {
        wife: ['flowers', 'spa voucher', 'date night reservation'],
        son: ['Pokemon GO event', 'LEGO set', 'arcade tokens']
      },
      history: []
    };
  });
  const [calendar, setCalendar] = useState(() => {
    const saved = localStorage.getItem('butler_calendar');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: 'e1', title: 'Strategic Planning', start: '2025-09-25T09:00', end: '2025-09-25T10:00', who: ['You'] },
      { id: 'e2', title: 'Client Call', start: '2025-09-25T09:30', end: '2025-09-25T10:15', who: ['You'] },
      { id: 'e3', title: 'Family Dinner', start: '2025-09-25T18:30', end: '2025-09-25T19:30', who: ['Family'] }
    ];
  });
  const firstEventDate = (() => {
    const first = [...(calendar || [])].sort((a,b) => new Date(a.start) - new Date(b.start))[0];
    return first ? new Date(first.start) : new Date();
  })();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(firstEventDate);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('butler_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('butler_memory', JSON.stringify(memory));
  }, [memory]);

  useEffect(() => {
    localStorage.setItem('butler_calendar', JSON.stringify(calendar));
  }, [calendar]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    const userMsg = message;
    setMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = generateAIResponse(userMsg);
      setMessages(prev => [...prev, aiResponse]);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion) => {
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: suggestion,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = generateAIResponse(suggestion);
      setMessages(prev => [...prev, aiResponse]);
    }, 2500);
  };

  const handleActionClick = (action) => {
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: action.label,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);

    // Show typing indicator
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = generateActionResponse(action.label);
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const generateAIResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('review calendar conflicts') || lowerMsg.includes('conflict')) {
      const conflicts = findConflicts(calendar);
      if (conflicts.length === 0) {
        return buildAssistant(
          "All synced. No conflicts found for tomorrow. Want me to optimize transitions or add buffers?",
          undefined,
          ["Add 10-min buffers between meetings", "Protect my peak hours", "Plan a surprise for my family"]
        );
      }
      const summary = conflicts.map((c, i) => `${i+1}. ${formatTime(c.a.start)} ${c.a.title} overlaps ${formatTime(c.b.start)} ${c.b.title}`).join('\n');
      return buildAssistant(
        `I found ${conflicts.length} potential conflict(s):\n\n${summary}\n\nI can propose fixes. Want me to:`,
        [
          { label: "Auto-resolve with smart moves", type: "primary" },
          { label: "Show options for each conflict", type: "secondary" },
          { label: "Ignore for now", type: "secondary" }
        ],
        ["Optimize my time", "Protect my peak hours"]
      );
    }
    
    if (lowerMsg.includes('what should i focus on today') || lowerMsg.includes('what should i focus on tomorrow')) {
      return {
        id: Date.now(),
        type: 'assistant',
        content: "Based on your calendar and priorities, here's what I recommend for tomorrow:\n\n🎯 **Top 3 Focus Areas:**\n1. **9:00 AM** - Strategic Planning Meeting (prepare your quarterly review)\n2. **2:00 PM** - MITB assignment deadline (final review needed)\n3. **6:30 PM** - Family dinner planning (son mentioned wanting to try Korean food)\n\n⚡ **Optimization tip:** I've blocked 15 minutes before each transition for you to decompress and refocus.\n\n☕ **Protected time:** Your coffee break at 3:30 PM is sacred - I'll decline any meeting requests during this time.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          "Adjust my coffee break timing",
          "Find time for exercise", 
          "Check family availability tonight"
        ]
      };
    }
    
    if (lowerMsg.includes('plan family weekend') || lowerMsg.includes('weekend activities')) {
      return {
        id: Date.now(),
        type: 'assistant',
        content: "I've analyzed everyone's preferences and schedules. Here are my weekend suggestions:\n\n🏃‍♂️ **Saturday Morning (7:00 AM)**\nFamily hiking at Bukit Timah - weather looks perfect, and your son mentioned wanting to get outdoors more.\n\n🎮 **Saturday Afternoon (2:00 PM)**\nPokemon GO community day at Marina Bay - there's a special event your son would love.\n\n🍽️ **Sunday Brunch (11:00 AM)**\nTry that new Korean restaurant your son suggested - Jang Su Jang at Tanjong Pagar.\n\nShall I book the restaurant and add these to everyone's calendar?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          { label: "Book everything", type: "primary" },
          { label: "Just the restaurant", type: "secondary" },
          { label: "Let me check with family first", type: "secondary" }
        ]
      };
    }

    if (lowerMsg.includes('plan a surprise') || lowerMsg.includes('surprise')) {
      const wifeName = memory.lovedOnes.wife;
      const sonName = memory.lovedOnes.son;
      return buildAssistant(
        `Here are thoughtful surprise ideas based on what I know:\n\n💐 For ${wifeName}: ${memory.surprises.wife.slice(0,2).join(', ')}\n🧒 For ${sonName}: ${memory.surprises.son.slice(0,2).join(', ')}\n\nI can handle logistics and keep it discreet.`,
        [
          { label: `Plan a date night for ${wifeName}`, type: 'primary' },
          { label: `Organize a ${sonName} surprise quest`, type: 'secondary' },
          { label: 'Show more ideas', type: 'secondary' }
        ],
        ["Review calendar conflicts", "Check family availability tonight"]
      );
    }

    if (lowerMsg.includes("show today's optimized view") || lowerMsg.includes('show today')) {
      setShowCalendar(true);
      setSelectedDate(new Date());
      return buildAssistant("Opening today's optimized view.");
    }
    
    if (lowerMsg.includes('optimize my time') || lowerMsg.includes('optimize')) {
      return {
        id: Date.now(),
        type: 'assistant',
        content: "I've found several optimization opportunities:\n\n⏰ **Time Savings Identified:**\n• Combine your grocery run with your son's pickup (saves 20 mins)\n• Batch your MITB reading sessions (more efficient than scattered 15-min blocks)\n• Move gym session to 6 AM when it's less crowded (saves 15 mins)\n\n🧠 **Decision Fatigue Reduction:**\n• I can pre-select 3 dinner options daily based on your family's preferences\n• Auto-schedule your reading time when energy levels are highest\n• Set up meal prep reminders for your wife's weekend cooking\n\n🎯 **Energy Management:**\nYour most productive hours are 9-11 AM and 7-9 PM. I can protect these for your most important work.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          "Implement gym schedule change",
          "Set up dinner pre-selection",
          "Protect my peak hours"
        ]
      };
    }
    
    if (lowerMsg.includes('check family schedule') || lowerMsg.includes('family')) {
      return {
        id: Date.now(),
        type: 'assistant',
        content: "Here's your family's current status:\n\n👨 **You:** Available after 6 PM tonight\n👩 **Wife:** Finishing work calls until 7 PM, then free\n🧑 **Son:** Polytechnic project due tomorrow, working until 8 PM\n\n🍽️ **Dinner suggestion:** Since everyone's busy until 8 PM, how about ordering from that Japanese place you all enjoyed last month? I can have it delivered by 8:15 PM so you can eat together when everyone's free.\n\nAlso, your wife mentioned wanting to plan next month's family vacation. Should I research some options based on your usual preferences?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          "Order Japanese dinner for 8:15 PM",
          "Research vacation options",
          "Plan family time after dinner"
        ]
      };
    }
    
    if (lowerMsg.includes('coffee') || lowerMsg.includes('break')) {
      return {
        id: Date.now(),
        type: 'assistant',
        content: "Your coffee breaks are crucial for your productivity! I've been protecting your 3:30 PM slot religiously.\n\n☕ **Tomorrow's coffee plan:**\n• 3:30 PM - Your usual 15-minute break\n• Cafe downstairs has your regular latte ready\n• I've blocked your calendar so no one can schedule over it\n\n📚 **Bonus:** Perfect timing to catch up on today's Straits Times headlines - I've curated the top 3 articles you'd find most relevant based on your interests in geopolitics and management.\n\nWould you like me to adjust the timing or find an alternative quiet spot if the cafe gets too crowded?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          "Find alternative quiet spots",
          "Extend to 20 minutes tomorrow",
          "Add morning coffee routine"
        ]
      };
    }
    
    // Default response for unmatched queries
    return buildAssistant(
      "I'm your planning copilot — I learn your rhythms and propose smart options, you decide. Ask me to sync calendars, spot conflicts, craft surprises, or brainstorm plans.",
      undefined,
      [
        "Review calendar conflicts",
        "Help me plan tomorrow",
        "Plan a surprise for my family"
      ]
    );
  };

  const generateActionResponse = (action) => {
    if (action === "Auto-resolve with smart moves") {
      const { updatedCalendar, summary } = autoResolveConflicts(calendar);
      setCalendar(updatedCalendar);
      return buildAssistant(
        `Done. I nudged a few events to clear overlaps:\n\n${summary}\n\nI also added 10-min buffers before and after your key meetings.`,
        undefined,
        ["Show today's optimized view", "Protect my peak hours", "Plan a surprise for my family"]
      );
    }
    if (action === "Show options for each conflict") {
      const conflicts = findConflicts(calendar);
      if (conflicts.length === 0) {
        return buildAssistant("Looks like conflicts are already resolved.", undefined, ["Optimize my time", "Plan weekend activities"]);
      }
      const options = conflicts.map((c, i) => `Conflict ${i+1}: Move ${c.b.title} to ${formatTime(shiftTime(c.b.start, 45))} or convert to 20-min standup?`).join('\n');
      return buildAssistant(`Here are resolution options:\n\n${options}`, [
        { label: "Apply suggested moves", type: 'primary' },
        { label: "Convert overlapping to standups", type: 'secondary' }
      ]);
    }
    if (action === "Apply suggested moves") {
      const { updatedCalendar } = autoResolveConflicts(calendar);
      setCalendar(updatedCalendar);
      return buildAssistant("Applied. Your morning is now clean and focused.", undefined, ["Show today's optimized view", "Plan a surprise for my family"]);
    }
    if (action?.startsWith('Plan a date night')) {
      const wifeName = memory.lovedOnes.wife;
      return buildAssistant(
        `I'll arrange a surprise date night for ${wifeName}: 7:30 PM Friday, Korean fusion at your favorite spot, and a reminder to book a sitter. I will pencil a placeholder and wait for your final OK.`,
        [ { label: 'Confirm and send invites', type: 'primary' }, { label: 'Suggest alternatives', type: 'secondary' } ],
        ["Add a sweet note from me", "Keep it secret on shared calendars"]
      );
    }
    if (action?.startsWith('Organize a')) {
      const sonName = memory.lovedOnes.son;
      return buildAssistant(
        `For ${sonName}, I'll set up a mini quest: clues around your block ending at an ice-cream stop. Estimated 45 mins, perfect after homework.`,
        [ { label: 'Schedule for Saturday 5 PM', type: 'primary' }, { label: 'Show alternative quests', type: 'secondary' } ],
        ["Invite wife to join at the end", "Add a small gift pickup"]
      );
    }
    if (action === "Book everything") {
      return {
        id: Date.now(),
        type: 'assistant',
        content: "Perfect! I've taken care of everything:\n\n✅ **Booked Jang Su Jang** for Sunday 11:30 AM (table for 3)\n✅ **Added hiking** to Saturday 7 AM in everyone's calendar\n✅ **Set Pokemon GO reminder** for Saturday 2 PM\n✅ **Sent details** to your family group chat\n\n📱 **Confirmations sent to your phone**\n🗺️ **Directions and parking info** added to calendar events\n\nYour son already replied with three fire emojis - I think he's excited! Your wife confirmed she's free both days.\n\nAnything else you'd like me to plan for the weekend?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          "Plan Sunday evening activity",
          "Check weather backup plans",
          "Set workout schedule for next week"
        ]
      };
    }
    
    if (action === "Order Japanese dinner for 8:15 PM") {
      return {
        id: Date.now(),
        type: 'assistant',
        content: "Order confirmed! 🍱\n\n📱 **Ginza Ramen House**\n• 2x Tonkotsu Ramen (you and your wife's usual)\n• 1x Chicken Teriyaki Set (your son's favorite)\n• 3x Gyoza (family sharing portion)\n• Delivery: 8:15 PM sharp\n\n💳 **Payment:** Charged to your usual card\n📍 **Delivery:** They have your address and gate code\n\nI've also set a gentle reminder for 8:10 PM to clear the dining table and set up for family dinner. Your son should be done with his project by then, and your wife can wrap up her calls.\n\nEnjoy your family time together! 😊",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          "Set up post-dinner family activity",
          "Plan dessert or drinks",
          "Schedule family movie night"
        ]
      };
    }

    // Default action response
    return {
      id: Date.now(),
      type: 'assistant',
      content: "I understand. I'll help you with that right away. Let me process your request and find the best solution based on your preferences and current schedule.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        "Tell me more details",
        "Show me alternatives", 
        "Proceed with this plan"
      ]
    };
  };

  // Helpers
  const buildAssistant = (content, actions, suggestions) => ({
    id: Date.now(),
    type: 'assistant',
    content,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ...(actions ? { actions } : {}),
    ...(suggestions ? { suggestions } : {})
  });

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const findConflicts = (events) => {
    const sorted = [...events].sort((a,b) => new Date(a.start) - new Date(b.start));
    const conflicts = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      const a = sorted[i];
      for (let j = i + 1; j < sorted.length; j++) {
        const b = sorted[j];
        if (new Date(b.start) < new Date(a.end)) {
          conflicts.push({ a, b });
        } else {
          break;
        }
      }
    }
    return conflicts;
  };

  const shiftTime = (iso, minutes) => {
    const d = new Date(iso);
    d.setMinutes(d.getMinutes() + minutes);
    return d.toISOString().slice(0,16);
  };

  const autoResolveConflicts = (events) => {
    const conflicts = findConflicts(events);
    const moves = [];
    let updated = [...events];
    conflicts.forEach(({ a, b }) => {
      const moved = { ...b, start: shiftTime(b.start, 45), end: shiftTime(b.end, 45) };
      updated = updated.map(e => e.id === b.id ? moved : e);
      moves.push(`• Moved ${b.title} to ${formatTime(moved.start)}`);
    });
    const summary = moves.join('\n');
    return { updatedCalendar: updated, summary };
  };

  // Calendar helpers
  const startOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 Sun .. 6 Sat
    const diff = (day + 6) % 7; // make Monday start
    d.setDate(d.getDate() - diff);
    d.setHours(0,0,0,0);
    return d;
  };
  const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };
  const isSameDay = (a, b) => {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };
  const getWeekDates = (anchor) => {
    const start = startOfWeek(anchor);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };
  const isSameDateISO = (iso, date) => {
    const d = new Date(iso);
    return isSameDay(d, date);
  };
  const agendaForDay = (events, date) => {
    return events
      .filter(ev => isSameDateISO(ev.start, date))
      .sort((a,b) => new Date(a.start) - new Date(b.start));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h1 className="font-semibold">Family Butler</h1>
            <p className="text-xs opacity-90">Your AI Life Assistant • Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowCalendar(prev => !prev)}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-xs"
          >
            {showCalendar ? 'Chat' : 'Calendar'}
          </button>
          <MoreVertical size={20} className="opacity-75" />
        </div>
      </div>

      {/* Main Body: Chat or Calendar */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {showCalendar ? (
          <div>
            {/* Week strip */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {getWeekDates(selectedDate).map((d) => (
                <button
                  key={d.toDateString()}
                  onClick={() => setSelectedDate(d)}
                  className={`px-3 py-2 rounded-lg border ${isSameDay(d, selectedDate) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700'} min-w-[80px]`}
                >
                  <div className="text-xs opacity-80">{d.toLocaleDateString([], { weekday: 'short' })}</div>
                  <div className="text-sm font-semibold">{d.getDate()}</div>
                </button>
              ))}
            </div>

            {/* Day agenda */}
            <div className="bg-white border rounded-xl shadow-sm">
              <div className="px-4 py-2 border-b flex items-center justify-between">
                <div className="font-medium">{selectedDate.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedDate(addDays(selectedDate, -1))} className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">Prev</button>
                  <button onClick={() => setSelectedDate(new Date())} className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">Today</button>
                  <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">Next</button>
                </div>
              </div>
              <div className="p-4">
                {agendaForDay(calendar, selectedDate).length === 0 ? (
                  <p className="text-sm text-gray-500">No events for this day.</p>
                ) : (
                  <div className="space-y-2">
                    {agendaForDay(calendar, selectedDate).map(ev => (
                      <div key={ev.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="text-xs text-gray-500 min-w-[90px]">{formatTime(ev.start)} - {formatTime(ev.end)}</div>
                        <div>
                          <div className="text-sm font-medium">{ev.title}</div>
                          {ev.who && <div className="text-xs text-gray-500">{ev.who.join(', ')}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                  {msg.type === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm">🤖</span>
                      </div>
                      <span className="text-xs text-gray-500">Butler</span>
                    </div>
                  )}
                  <div className={`px-4 py-3 rounded-2xl ${
                    msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white border shadow-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-2">{msg.timestamp}</p>
                  {msg.actions && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.actions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(action)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${action.type === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {msg.suggestions && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-2 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 border border-blue-200 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm">🤖</span>
                    </div>
                    <span className="text-xs text-gray-500">Butler is typing...</span>
                  </div>
                  <div className="px-4 py-3 bg-white border shadow-sm rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions Bar */}
      <div className="px-4 py-2 bg-white border-t">
        <div className="flex gap-2 overflow-x-auto">
          <button 
            onClick={() => { setShowCalendar(true); setSelectedDate(new Date()); }}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg text-sm whitespace-nowrap hover:bg-gray-200 transition-colors"
          >
            <Calendar size={14} />
            Calendar
          </button>
          <button 
            onClick={() => handleSuggestionClick("What should I focus on today?")}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg text-sm whitespace-nowrap hover:bg-gray-200 transition-colors"
          >
            <Clock size={14} />
            Today's Focus
          </button>
          <button 
            onClick={() => handleSuggestionClick("Check family schedule")}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg text-sm whitespace-nowrap hover:bg-gray-200 transition-colors"
          >
            <Users size={14} />
            Family Sync
          </button>
          <button 
            onClick={() => handleSuggestionClick("Plan family weekend activities")}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg text-sm whitespace-nowrap hover:bg-gray-200 transition-colors"
          >
            <Calendar size={14} />
            Weekend Plans
          </button>
          <button 
            onClick={() => handleSuggestionClick("Review calendar conflicts")}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg text-sm whitespace-nowrap hover:bg-gray-200 transition-colors"
          >
            <Calendar size={14} />
            Conflicts
          </button>
          <button 
            onClick={() => handleSuggestionClick("Plan a surprise for my family")}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg text-sm whitespace-nowrap hover:bg-gray-200 transition-colors"
          >
            <Calendar size={14} />
            Surprises
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center gap-3">
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Paperclip size={20} />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your schedule, family, or life..."
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
              rows="1"
              style={{minHeight: '48px'}}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                message.trim() 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
          
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Mic size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FamilyButlerChat;