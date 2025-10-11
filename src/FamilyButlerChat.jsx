import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, MoreVertical, Calendar, Clock, Users } from 'lucide-react';

const FamilyButlerChat = () => {
  const STORAGE_CLEAR_MARK = 'butler_cleared_2025_10_01';
  const WELCOME_MARK = 'butler_welcome_shown_v1';

  const getInitialMessages = () => ([
    {
      id: 1,
      type: 'assistant',
      content: "Hi! I can be your AI copilot across your calendar, tasks, and routines. Do you want me to connect with your apps so I can help you the ultimate way? For this demo, I can connect Google Calendar or run in demo mode.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        { label: 'Connect Google Calendar', type: 'primary' },
        { label: 'Connect Outlook (demo)', type: 'secondary' },
        { label: 'Connect WhatsApp (demo)', type: 'secondary' },
        { label: 'Not now', type: 'secondary' }
      ],
      suggestions: [
        'Show my calendar',
        'What should I focus on today?',
        'Plan a surprise for my family'
      ]
    }
  ]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('butler_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return getInitialMessages();
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
  // Google Calendar integration (MVP)
  const DEMO_ONLY = true; // set to false when enabling real Google OAuth
  const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // TODO: replace with your real Client ID
  const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events';
  const [googleToken, setGoogleToken] = useState(null);
  const [gisReady, setGisReady] = useState(false);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [connectedApps, setConnectedApps] = useState({ google: false, outlookDemo: false, whatsappDemo: false });
  // Demo mode (no external API). Used automatically when not authenticated.
  const todayBase = new Date();
  const withTime = (h, m) => new Date(todayBase.getFullYear(), todayBase.getMonth(), todayBase.getDate(), h, m, 0).toISOString();
  const [demoEvents, setDemoEvents] = useState([
    { id: 'd1', title: 'Strategic Planning', start: withTime(9, 0), end: withTime(10, 0) },
    { id: 'd2', title: 'Client Call', start: withTime(11, 30), end: withTime(12, 0) },
    { id: 'd3', title: 'Family Dinner', start: withTime(18, 30), end: withTime(19, 30) }
  ]);
  const [demoOutlookEvents, setDemoOutlookEvents] = useState([
    { id: 'o1', title: 'Team Standup (Outlook)', start: withTime(10, 0), end: withTime(10, 15) },
    { id: 'o2', title: 'Project Sync (Outlook)', start: withTime(14, 0), end: withTime(14, 45) }
  ]);
  const [demoWhatsAppMsgs, setDemoWhatsAppMsgs] = useState([
    { id: 'w1', from: 'Emily', time: withTime(8, 15), text: 'Can we do dinner at 7:30 tonight?' },
    { id: 'w2', from: 'Jayden', time: withTime(13, 5), text: 'Dad, can you review my project later?' }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('butler_messages', JSON.stringify(messages));
  }, [messages]);

  // One-time clear of old local data so the new onboarding shows cleanly
  useEffect(() => {
    if (localStorage.getItem(STORAGE_CLEAR_MARK) !== '1') {
      try {
        localStorage.clear();
      } catch {}
      localStorage.setItem(STORAGE_CLEAR_MARK, '1');
      setMessages(getInitialMessages());
    }
  }, []);

  // Add a short opening tip message once per device
  useEffect(() => {
    if (localStorage.getItem(WELCOME_MARK) !== '1') {
      const tip = buildAssistant("Tip: You can say ‘Show my calendar’, ‘Connect apps’, or ‘Create an event for today at 3 PM’. I can run in demo mode or connect when you’re ready.");
      setMessages(prev => [...prev, tip]);
      localStorage.setItem(WELCOME_MARK, '1');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('butler_memory', JSON.stringify(memory));
  }, [memory]);

  // Load Google Identity Services client script (skipped in demo-only mode)
  useEffect(() => {
    if (DEMO_ONLY) return;
    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) return setGisReady(true);
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGisReady(true);
    script.onerror = () => setGisReady(false);
    document.head.appendChild(script);
  }, []);

  const ensureGoogleAuth = async () => {
    if (DEMO_ONLY) return null;
    if (googleToken) return googleToken;
    if (!gisReady || !window.google?.accounts?.oauth2) {
      throw new Error('Google auth not ready');
    }
    return new Promise((resolve, reject) => {
      try {
        setIsConnectingGoogle(true);
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: GOOGLE_SCOPES,
          prompt: 'consent',
          callback: (resp) => {
            setIsConnectingGoogle(false);
            if (resp?.access_token) {
              setGoogleToken(resp.access_token);
              resolve(resp.access_token);
            } else {
              reject(new Error('Failed to get access token'));
            }
          }
        });
        tokenClient.requestAccessToken();
      } catch (err) {
        setIsConnectingGoogle(false);
        reject(err);
      }
    });
  };

  const fetchGoogleEventsForDate = async (date) => {
    const token = await ensureGoogleAuth();
    const timeMin = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).toISOString();
    const timeMax = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).toISOString();
    const resp = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true&orderBy=startTime&timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!resp.ok) throw new Error('Failed to fetch events');
    const data = await resp.json();
    return (data.items || []).map(ev => ({
      id: ev.id,
      title: ev.summary || '(no title)',
      start: ev.start?.dateTime || ev.start?.date,
      end: ev.end?.dateTime || ev.end?.date,
      location: ev.location
    }));
  };

  const createGoogleEvent = async ({ summary, startDateTime, endDateTime, description, location }) => {
    const token = await ensureGoogleAuth();
    const resp = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        summary,
        description,
        location,
        start: { dateTime: startDateTime },
        end: { dateTime: endDateTime }
      })
    });
    if (!resp.ok) throw new Error('Failed to create event');
    return resp.json();
  };

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

    // Special actions that require async side-effects
    const run = async () => {
      try {
        setIsTyping(true);
        if (action.label === 'Connect Google Calendar') {
          if (!DEMO_ONLY) {
            await ensureGoogleAuth();
          }
          setConnectedApps(prev => ({ ...prev, google: true }));
          let content;
          if (DEMO_ONLY) {
            content = demoEvents.length === 0
              ? 'Connected (demo). No events found for today.'
              : `Connected (demo).\n\nToday\'s events:\n\n${demoEvents.map(e => `• ${formatTime(e.start)} - ${e.title}`).join('\n')}`;
          } else {
            const events = await fetchGoogleEventsForDate(new Date());
            content = events.length === 0
              ? 'Connected to Google Calendar. No events found for today.'
              : `Connected to Google Calendar.\n\nToday\'s events:\n\n${events.map(e => `• ${formatTime(e.start)} - ${e.title}`).join('\n')}`;
          }
          const resultMsg = buildAssistant(content, [ { label: "Refresh today's events", type: 'secondary' }, { label: 'Create an event for today at 3 PM', type: 'secondary' } ]);
          setIsTyping(false);
          setMessages(prev => [...prev, resultMsg]);
          return;
        }
        if (action.label === "Refresh today's events") {
          if (!googleToken) {
            const content = demoEvents.length === 0
              ? 'Demo: No events for today.'
              : `Demo — Today\'s events:\n\n${demoEvents.map(e => `• ${formatTime(e.start)} - ${e.title}`).join('\n')}`;
            setIsTyping(false);
            setMessages(prev => [...prev, buildAssistant(content)]);
            return;
          }
          const events = await fetchGoogleEventsForDate(new Date());
          const content = events.length === 0
            ? 'No events found for today.'
            : `Today\'s events:\n\n${events.map(e => `• ${formatTime(e.start)} - ${e.title}`).join('\n')}`;
          setIsTyping(false);
          setMessages(prev => [...prev, buildAssistant(content)]);
          return;
        }
        if (action.label === 'Create an event for today at 3 PM') {
          const today = new Date();
          const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 0, 0).toISOString();
          const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30, 0).toISOString();
          if (!googleToken) {
            const newEvent = { id: `demo-${Date.now()}`, title: 'Focus block', start, end };
            const updated = [...demoEvents, newEvent].sort((a,b)=> new Date(a.start)-new Date(b.start));
            setDemoEvents(updated);
            const content = `Demo: Event created — Focus block, 3:00–3:30 PM today.\n\nUpdated list:\n\n${updated.map(e => `• ${formatTime(e.start)} - ${e.title}`).join('\n')}`;
            setIsTyping(false);
            setMessages(prev => [...prev, buildAssistant(content)]);
            return;
          }
          if (DEMO_ONLY) {
            const newEvent = { id: `demo-${Date.now()}`, title: 'Focus block', start, end };
            const updated = [...demoEvents, newEvent].sort((a,b)=> new Date(a.start)-new Date(b.start));
            setDemoEvents(updated);
            const content = `Demo: Event created — Focus block, 3:00–3:30 PM today.\n\nUpdated list:\n\n${updated.map(e => `• ${formatTime(e.start)} - ${e.title}`).join('\n')}`;
            setIsTyping(false);
            setMessages(prev => [...prev, buildAssistant(content)]);
          } else {
            await createGoogleEvent({ summary: 'Focus block', startDateTime: start, endDateTime: end, description: 'Created via Family Butler', location: undefined });
            const ok = buildAssistant('Event created: Focus block, 3:00–3:30 PM today.');
            const events = await fetchGoogleEventsForDate(new Date());
            const content = events.length === 0
              ? 'No events found for today.'
              : `Updated list:\n\n${events.map(e => `• ${formatTime(e.start)} - ${e.title}`).join('\n')}`;
            setIsTyping(false);
            setMessages(prev => [...prev, ok, buildAssistant(content)]);
          }
          return;
        }
        // Default behavior for other actions
        await new Promise(r => setTimeout(r, 1500));
        setIsTyping(false);
        const aiResponse = generateActionResponse(action.label);
        setMessages(prev => [...prev, aiResponse]);
      } catch (err) {
        setIsTyping(false);
        setMessages(prev => [...prev, buildAssistant(`Something went wrong: ${err.message}`)]);
      }
    };
    run();
  };

  const generateAIResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    
    // Show Google Calendar (MVP)
    if (lowerMsg.includes('show my calendar') || lowerMsg.includes("show today's calendar") || lowerMsg.includes('show calendar') || lowerMsg.includes("what's my schedule")) {
      if (!googleToken) {
        const content = demoEvents.length === 0
          ? 'Demo: No events for today.'
          : `Demo — Today\'s events:\n\n${demoEvents.map(e => `• ${formatTime(e.start)} - ${e.title}`).join('\n')}`;
        return buildAssistant(content, [ { label: "Refresh today's events", type: 'secondary' }, { label: 'Create an event for today at 3 PM', type: 'secondary' } ]);
      }
      return buildAssistant(
        'Fetching today\'s events from Google Calendar... ',
        [ { label: 'Refresh today\'s events', type: 'secondary' }, { label: 'Create an event for today at 3 PM', type: 'secondary' } ]
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

    if (lowerMsg.includes('connect apps') || lowerMsg.includes('connect my apps') || lowerMsg.includes('connect with your apps')) {
      return buildAssistant(
        "Great! I can start with Google Calendar now and add others later. For this demo, connecting Calendar lets me show, create, and update events. Want to connect now or try the demo mode first?",
        [
          { label: 'Connect Google Calendar', type: 'primary' },
          { label: 'Connect Outlook (demo)', type: 'secondary' },
          { label: 'Connect WhatsApp (demo)', type: 'secondary' },
          { label: 'Not now', type: 'secondary' }
        ],
        [ 'Show my calendar', 'Create an event for today at 3 PM' ]
      );
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

    // Remove old inline calendar toggle path
    
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
    if (action === 'Connect Google Calendar') {
      return {
        id: Date.now(),
        type: 'assistant',
        content: isConnectingGoogle ? 'Connecting to Google...' : 'Connecting to Google... Grant access in the popup if prompted.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [ { label: 'Refresh today\'s events', type: 'primary' } ]
      };
    }
    if (action === 'Connect Outlook (demo)') {
      setConnectedApps(prev => ({ ...prev, outlookDemo: true }));
      const content = demoOutlookEvents.length === 0
        ? 'Demo (Outlook): No events for today.'
        : `Demo (Outlook) — Today\'s events:\n\n${demoOutlookEvents.map(e => `• ${formatTime(e.start)} - ${e.title}`).join('\n')}`;
      return buildAssistant(
        `Connected Outlook (demo).\n\n${content}`,
        [ { label: 'Refresh Outlook (demo)', type: 'secondary' } ]
      );
    }
    if (action === 'Connect WhatsApp (demo)') {
      setConnectedApps(prev => ({ ...prev, whatsappDemo: true }));
      const content = demoWhatsAppMsgs.length === 0
        ? 'Demo (WhatsApp): No recent messages.'
        : `Demo (WhatsApp) — Recent messages:\n\n${demoWhatsAppMsgs.map(m => `• ${m.from}: ${m.text}`).join('\n')}`;
      return buildAssistant(
        `Connected WhatsApp (demo).\n\n${content}`,
        [ { label: 'Show WhatsApp (demo) again', type: 'secondary' } ]
      );
    }
    if (action === 'Refresh Outlook (demo)') {
      const content = demoOutlookEvents.length === 0
        ? 'Demo (Outlook): No events for today.'
        : `Demo (Outlook) — Today\'s events:\n\n${demoOutlookEvents.map(e => `• ${formatTime(e.start)} - ${e.title}`).join('\n')}`;
      return buildAssistant(content);
    }
    if (action === 'Show WhatsApp (demo) again') {
      const content = demoWhatsAppMsgs.length === 0
        ? 'Demo (WhatsApp): No recent messages.'
        : `Demo (WhatsApp) — Recent messages:\n\n${demoWhatsAppMsgs.map(m => `• ${m.from}: ${m.text}`).join('\n')}`;
      return buildAssistant(content);
    }
    if (action === 'Not now') {
      return buildAssistant(
        'No problem. I\'ll run in demo mode. You can connect later anytime.',
        [ { label: 'Show my calendar', type: 'primary' }, { label: "Refresh today\'s events", type: 'secondary' } ]
      );
    }
    if (action === "Refresh today's events") {
      if (!googleToken) {
        const content = demoEvents.length === 0
          ? 'Demo: No events for today.'
          : `Demo — Today\'s events:\n\n${demoEvents.map(e => `• ${formatTime(e.start)} - ${e.title}`).join('\n')}`;
        return buildAssistant(content);
      }
      return buildAssistant('Okay, fetching today\'s events...');
    }
    if (action === 'Create an event for today at 3 PM') {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 0, 0).toISOString();
      const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30, 0).toISOString();
      if (!googleToken) {
        const newEvent = { id: `demo-${Date.now()}`, title: 'Focus block', start, end };
        setDemoEvents(prev => [...prev, newEvent]);
        const content = `Demo: Event created — Focus block, 3:00–3:30 PM today.\n\nUpdated list:\n\n${[...demoEvents, newEvent].sort((a,b)=> new Date(a.start)-new Date(b.start)).map(e => `• ${formatTime(e.start)} - ${e.title}`).join('\n')}`;
        return buildAssistant(content);
      }
      // Real API path handled in async branch above
      return buildAssistant('Creating an event at 3:00 PM today...');
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

  // Note: old local conflict helpers removed in favor of real provider data

  // Removed inline calendar UI helpers

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
            <div className="flex gap-1 mt-1">
              {connectedApps.google && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">Google</span>}
              {connectedApps.outlookDemo && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">Outlook (demo)</span>}
              {connectedApps.whatsappDemo && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">WhatsApp (demo)</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MoreVertical size={20} className="opacity-75" />
        </div>
      </div>

      {/* Main Body: Chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions Bar */}
      <div className="px-4 py-2 bg-white border-t">
        <div className="flex gap-2 overflow-x-auto">
          <button 
            onClick={() => handleSuggestionClick('Show my calendar')}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg text-sm whitespace-nowrap hover:bg-gray-200 transition-colors"
          >
            <Calendar size={14} />
            Show Calendar
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