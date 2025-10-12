// Demo Data for Desmond's Calendar Assistant
// Based on real persona insights: SAF executive, MITB student, family man

export const desmondProfile = {
    name: "Desmond",
    age: 49,
    role: "Head of Office, Strategic Management (SAF)",
    family: {
      wife: "Emily", // Finance industry, independent
      son: "Jayden", // 17, Polytechnic student
    },
    preferences: {
      coffeeTime: "3:30 PM", // Café latte, no sugar - sacred "me time"
      exerciseSlots: ["7:00 AM", "Weekend mornings"], // Running at Marina Bay Sands, gym
      peakFocusHours: ["9:00 AM - 11:00 AM", "7:00 PM - 9:00 PM"],
      cuisines: ["Japanese", "Korean"],
      weekendActivities: ["Hiking", "Pokémon GO", "Family dinners"],
    },
    stressors: [
      "Fragmented schedules requiring context switching",
      "Boss-driven calendar changes",
      "Decision fatigue (especially restaurant selection)",
      "Work disrupting family plans",
      "Learning new apps/tools",
    ],
    values: "Work > Family > Self (but wants better balance)",
  };
  
  // October 2025 Calendar Events
  // Realistic distribution: busy weekdays, family weekends
  export const calendarEvents = [
    // MONDAY Oct 13 - Typical busy start
    {
      id: "e1",
      title: "Weekly Team Sync",
      start: "2025-10-13T09:00:00",
      end: "2025-10-13T10:00:00",
      type: "work",
      location: "SAF Office",
      attendees: ["Boss", "Team leads"],
    },
    {
      id: "e2",
      title: "Budget Planning Review",
      start: "2025-10-13T10:30:00",
      end: "2025-10-13T12:00:00",
      type: "work",
      priority: "high",
    },
    {
      id: "e3",
      title: "Coffee Break ☕",
      start: "2025-10-13T15:30:00",
      end: "2025-10-13T16:00:00",
      type: "personal",
      protected: true, // This should NEVER be overridden
      notes: "Sacred me-time: café latte, current affairs reading",
    },
    {
      id: "e4",
      title: "Boss wants to meet (NEW)", // CONFLICT!
      start: "2025-10-13T18:00:00",
      end: "2025-10-13T19:00:00",
      type: "work",
      conflict: true,
      conflictsWith: ["e5"],
      addedBy: "Boss",
      tentative: true,
      priority: "high",
      notes: "Budget discussion - needs to be today"
    },
    {
      id: "e5",
      title: "Family Dinner",
      start: "2025-10-13T18:30:00",
      end: "2025-10-13T19:30:00",
      type: "family",
      attendees: ["Emily", "Jayden"],
      recurring: "weekly",
    },
  
    // TUESDAY Oct 14
    {
      id: "e6",
      title: "Morning Run 🏃",
      start: "2025-10-14T07:00:00",
      end: "2025-10-14T08:00:00",
      type: "personal",
      location: "Marina Bay Sands",
      protected: true,
    },
    {
      id: "e7",
      title: "Resource Allocation Meeting",
      start: "2025-10-14T14:00:00",
      end: "2025-10-14T15:30:00",
      type: "work",
    },
    {
      id: "e8",
      title: "Coffee Break ☕",
      start: "2025-10-14T15:30:00",
      end: "2025-10-14T16:00:00",
      type: "personal",
      protected: true,
    },
    {
      id: "e9",
      title: "MITB Study Time",
      start: "2025-10-14T20:00:00",
      end: "2025-10-14T22:00:00",
      type: "study",
      subject: "Data Analytics module",
    },
  
    // WEDNESDAY Oct 15 - Class night
    {
      id: "e10",
      title: "Strategic Planning Session",
      start: "2025-10-15T09:00:00",
      end: "2025-10-15T11:00:00",
      type: "work",
      priority: "high",
    },
    {
      id: "e11",
      title: "Coffee Break ☕",
      start: "2025-10-15T15:30:00",
      end: "2025-10-15T16:00:00",
      type: "personal",
      protected: true,
    },
    {
      id: "e12",
      title: "URGENT: Meeting overlap", // CONFLICT with coffee!
      start: "2025-10-15T15:00:00",
      end: "2025-10-15T16:30:00",
      type: "work",
      conflict: true,
      conflictsWith: ["e11"],
      addedBy: "Boss",
      priority: "high",
    },
    {
      id: "e13",
      title: "MITB Class - SMU",
      start: "2025-10-15T19:00:00",
      end: "2025-10-15T22:00:00",
      type: "study",
      location: "SMU Campus",
      recurring: "weekly",
    },
  
    // FRIDAY Oct 17 - End of week
    {
      id: "e14",
      title: "Week Review with Boss",
      start: "2025-10-17T10:00:00",
      end: "2025-10-17T11:00:00",
      type: "work",
    },
    {
      id: "e15",
      title: "Coffee Break ☕",
      start: "2025-10-17T15:30:00",
      end: "2025-10-17T16:00:00",
      type: "personal",
      protected: true,
    },
    {
      id: "e16",
      title: "MITB Class - SMU",
      start: "2025-10-17T19:00:00",
      end: "2025-10-17T22:00:00",
      type: "study",
      location: "SMU Campus",
    },
  
    // SATURDAY Oct 18 - Family time
    {
      id: "e17",
      title: "Gym Session 💪",
      start: "2025-10-18T08:00:00",
      end: "2025-10-18T09:30:00",
      type: "personal",
    },
    {
      id: "e18",
      title: "Emily - Spa Appointment",
      start: "2025-10-18T10:00:00",
      end: "2025-10-18T12:00:00",
      type: "family",
      person: "wife",
    },
    {
      id: "e19",
      title: "Jayden - Pokémon GO Event",
      start: "2025-10-18T14:00:00",
      end: "2025-10-18T16:00:00",
      type: "family",
      person: "son",
      notes: "Consider joining him",
    },
    {
      id: "e20",
      title: "Family Dinner - TBD",
      start: "2025-10-18T18:30:00",
      end: "2025-10-18T20:00:00",
      type: "family",
      needsDecision: true,
      decisionType: "restaurant",
    },
  
    // SUNDAY Oct 19
    {
      id: "e21",
      title: "Family Hiking",
      start: "2025-10-19T08:00:00",
      end: "2025-10-19T11:00:00",
      type: "family",
      location: "MacRitchie Reservoir",
      attendees: ["Emily", "Jayden"],
    },
    {
      id: "e22",
      title: "MITB Assignment Work",
      start: "2025-10-19T14:00:00",
      end: "2025-10-19T17:00:00",
      type: "study",
    },
  
    // MONDAY Oct 20 - Next week preview
    {
      id: "e23",
      title: "Monday Team Sync",
      start: "2025-10-20T09:00:00",
      end: "2025-10-20T10:00:00",
      type: "work",
      recurring: "weekly",
    },
  ];
  
  // Detected Conflicts with Smart Resolution Options
  export const conflicts = [
    {
      id: "c1",
      title: "Monday Evening Crunch",
      severity: "high",
      date: "2025-10-13",
      description: "Boss scheduled 6pm meeting, overlaps with family dinner at 6:30pm",
      events: ["e4", "e5"],
      impact: "Will miss family dinner or disappoint boss",
      pattern: "Boss often schedules late Mondays (last 3 weeks)",
      resolutionOptions: [
        {
          id: "r1",
          label: "Move boss meeting to 4:30pm",
          action: "reschedule",
          reasoning: "Frees you for family dinner, still before EOD",
          autoMessage: "Can we move to 4:30pm? Have family commitment at 6:30pm.",
        },
        {
          id: "r2",
          label: "Ask family to shift dinner to 7pm",
          action: "family_adjust",
          reasoning: "One-time adjustment, minimal disruption",
          autoMessage: "WhatsApp to Emily: Can we do 7pm dinner tonight? Work meeting ran over.",
        },
        {
          id: "r3",
          label: "Decline meeting, suggest Tuesday",
          action: "decline",
          reasoning: "Protects family time, offers alternative",
          autoMessage: "Can't make 6pm today. Tuesday morning work?",
        },
        {
          id: "r4",
          label: "Set Monday dinner blocker (prevent future conflicts)",
          action: "permanent_block",
          reasoning: "Prevents this recurring pattern",
          impact: "Creates permanent 6-8pm Monday family block",
        },
      ],
    },
    {
      id: "c2",
      title: "Coffee Time Invasion",
      severity: "medium",
      date: "2025-10-15",
      description: "Meeting scheduled 3-4:30pm overlaps your sacred coffee break (3:30pm)",
      events: ["e12", "e11"],
      impact: "No decompression time, increased afternoon stress",
      pattern: "3rd time this month someone booked over coffee time",
      resolutionOptions: [
        {
          id: "r5",
          label: "Shorten meeting to 3-3:30pm",
          action: "reschedule",
          reasoning: "Still get coffee break, meeting gets 30min",
        },
        {
          id: "r6",
          label: "Move coffee to 4:30pm (after meeting)",
          action: "personal_adjust",
          reasoning: "One-time shift, still get break",
        },
        {
          id: "r7",
          label: "Block 3:30pm permanently as 'Focus Time'",
          action: "permanent_block",
          reasoning: "Prevents future invasions, protects wellbeing",
          impact: "Calendar shows as busy 3:30-4pm daily",
          recommended: true,
        },
      ],
    },
    {
      id: "c3",
      title: "Weekend Schedule Jam",
      severity: "low",
      date: "2025-10-18",
      description: "Emily's spa (10am), your gym (8am), Jayden's event (2pm) - no family time till dinner",
      events: ["e17", "e18", "e19"],
      impact: "Fragmented day, everyone separate till evening",
      pattern: "Happens most Saturdays",
      resolutionOptions: [
        {
          id: "r8",
          label: "Join Jayden's Pokémon event (2-4pm)",
          action: "join",
          reasoning: "Shared activity, he'd appreciate it",
          autoMessage: "WhatsApp to Jayden: Mind if I join your Pokémon hunt?",
        },
        {
          id: "r9",
          label: "Suggest family lunch at 12pm",
          action: "create_event",
          reasoning: "Breaks up solo time, midday connection",
          autoSuggest: "Send group chat: Lunch together at 12? Between spa & Pokémon event.",
        },
        {
          id: "r10",
          label: "Keep as is (everyone needs solo time)",
          action: "accept",
          reasoning: "Valid rest/recharge pattern",
        },
      ],
    },
  ];
  
  // Pattern Insights - AI detected patterns
  export const patterns = [
    {
      id: "p1",
      type: "conflict_risk",
      title: "Monday Evening Pattern",
      insight: "Last 3 Mondays: Boss scheduled meetings past 6pm",
      prediction: "60% chance of late meeting next Monday",
      recommendation: "Block 6-8pm Mondays as 'Family Time' to prevent future conflicts",
      action: "create_recurring_block",
    },
    {
      id: "p2",
      type: "wellbeing",
      title: "Exercise Frequency Dropping",
      insight: "You've gone to gym only 1x in the last 2 weeks (target: 2x/week)",
      prediction: "MITB workload increasing, exercise time shrinking",
      recommendation: "Lock in Tuesday 7am and Saturday 8am as non-negotiable gym slots",
      action: "protect_time",
    },
    {
      id: "p3",
      type: "family_time",
      title: "Family Dinner Success Rate: 60%",
      insight: "Missed 4 out of last 10 family dinners due to work",
      prediction: "Target improvement: 80% attendance",
      recommendation: "Enable 'Family Dinner Shield': Auto-declines meetings 6-8pm Mon-Fri",
      action: "enable_shield",
    },
    {
      id: "p4",
      type: "decision_fatigue",
      title: "Restaurant Selection Paralysis",
      insight: "You've visited same 3 restaurants in last month",
      data: "Last 4 choices: Tanuki (2x), Koma, Tanuki again",
      recommendation: "Enable smart restaurant suggestions for weekend dinners to avoid repetition",
      action: "enable_restaurant_ai",
    },
  ];
  
  // Smart Suggestions - One-click actionable recommendations
  export const smartSuggestions = [
    {
      id: "s1",
      category: "restaurant",
      title: "Weekend Dinner - Avoid Repetition",
      description: "Saturday, Oct 18 dinner needs a place. You've done Tanuki twice recently.",
      options: [
        {
          name: "Nami",
          cuisine: "Japanese",
          reason: "Haven't been in 3 months, Emily liked it",
          action: "Book 6:30pm Saturday",
        },
        {
          name: "Jinjja Chicken",
          cuisine: "Korean",
          reason: "New opening, matches your Korean preference",
          action: "Book 6:30pm Saturday",
        },
        {
          name: "Koma",
          cuisine: "Japanese",
          reason: "Been once, safe choice, Jayden enjoyed",
          action: "Book 6:30pm Saturday",
        },
      ],
      oneClickBooking: true,
    },
    {
      id: "s2",
      category: "exercise",
      title: "Exercise Goal Tracking",
      description: "You've only exercised 1x this week. Consider adding a gym session?",
      action: "suggest_exercise",
      availableSlots: [
        {
          date: "2025-10-15",
          time: "7:00 AM - 8:00 AM",
          reason: "Wednesday morning - no conflicts"
        },
        {
          date: "2025-10-16", 
          time: "7:00 AM - 8:00 AM",
          reason: "Thursday morning - clear schedule"
        }
      ],
      impact: "Keeps you on track for 2x/week goal",
    },
    {
      id: "s3",
      category: "family",
      title: "Perfect Weather for Your Hiking Plan",
      description: "Sunday, Oct 19 - forecast: 26°C, sunny. Great conditions for your planned MacRitchie hike!",
      action: "confirm_weather",
      autoMessage: "Group chat: Weather's perfect for Sunday's MacRitchie hike - everyone still good to go?",
      familyLikelihood: "High - did this 2 weeks ago, everyone enjoyed",
      impact: "Confirms your existing hiking plan with family",
    },
    {
      id: "s4",
      category: "study",
      title: "MITB Assignment Due Soon",
      description: "Data Analytics assignment due Thursday, Oct 24 (4 days). Need more time?",
      currentAllocation: "Sunday 2-5pm only",
      recommendation: "Add Thursday night session (2 hours)?",
      action: "create_study_block",
    },
    {
      id: "s5",
      category: "productivity",
      title: "Protected Time Recommendation",
      description: "Coffee break invaded 3x this month. Make it permanent?",
      action: "permanent_block",
      blockDetails: {
        title: "Focus Time ☕",
        time: "3:30-4:00pm daily",
        type: "No meetings",
      },
      benefit: "Guaranteed daily decompression, reduces stress",
    },
  ];
  
  // Connected Apps Status
  export const connectedApps = [
    {
      id: "google_calendar",
      name: "Google Calendar",
      icon: "📅",
      status: "not_connected",
      description: "Work meetings, family events",
      syncFrequency: "Real-time",
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: "💬",
      status: "not_connected",
      description: "Family group chat, coordination",
      syncFrequency: "Every 5 minutes",
    },
    {
      id: "outlook",
      name: "Outlook Calendar",
      icon: "📧",
      status: "not_connected",
      description: "Work emails, SAF calendar",
      syncFrequency: "Real-time",
    },
    {
      id: "notes",
      name: "Upload Notes",
      icon: "📝",
      status: "not_connected",
      description: "Physical diary, to-do lists",
      syncFrequency: "Manual upload",
    },
  ];
  
  // WhatsApp Mock Messages (for context)
  export const whatsappMessages = [
    {
      from: "Emily",
      message: "Dinner this Saturday? Thinking Japanese again?",
      timestamp: "2025-10-15T10:30:00",
      chat: "Family",
    },
    {
      from: "Jayden",
      message: "Pokemon event at Vivo this Sat 2pm. You guys joining?",
      timestamp: "2025-10-15T11:00:00",
      chat: "Family",
    },
    {
      from: "Boss",
      message: "Need to discuss budget revisions. Monday 6pm ok?",
      timestamp: "2025-10-13T08:00:00",
      chat: "Work",
    },
  ];
  
  // Helper to get events for a specific date
  export const getEventsForDate = (dateString) => {
    return calendarEvents.filter(event => 
      event.start.startsWith(dateString)
    );
  };
  
  // Helper to get conflicts for a date
  export const getConflictsForDate = (dateString) => {
    return conflicts.filter(conflict => conflict.date === dateString);
  };
  
  // Calendar month data for October 2025
  export const october2025 = {
    month: "October",
    year: 2025,
    firstDay: 3, // Wednesday (0 = Sunday)
    daysInMonth: 31,
    today: 11, // Oct 11 is today
  };
