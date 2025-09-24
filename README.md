Desmond Assistant (Family Butler)
================================

A lightweight React app that feels like a true personal assistant for planning and family coordination. It syncs a mock calendar, detects conflicts with smart resolution options, remembers preferences locally, proposes thoughtful surprises, and offers a built-in calendar view for quick scanning.

Repo: https://github.com/onsenix12/desmond-assistant

Features
--------

- Chat-first experience with actionable suggestions and decisions left to you
- Local memory (via localStorage) for preferences and routines
- Mock calendar sync with conflict detection and one-click auto-resolve
- Brainstorming-style responses (the assistant proposes; you decide)
- Surprise planning flows for wife and son (logistics-ready suggestions)
- Built-in Calendar view (weekly strip + daily agenda) with a Chat/Calendar toggle
- Quick Actions bar for Today’s Focus, Family Sync, Weekend Plans, Conflicts, and Surprises

Tech Stack
---------

- React 18
- Tailwind CSS
- lucide-react (icons)

Getting Started
---------------

Prerequisites:
- Node.js 18+ (LTS recommended)
- npm 9+

Install and run:

```
npm install
npm start
```

The app will start in development mode (usually http://localhost:3000).

Build for production:

```
npm run build
```

Project Structure
-----------------

```
.
├─ public/
├─ src/
│  ├─ App.jsx
│  ├─ FamilyButlerChat.jsx   # Main assistant + calendar view
│  ├─ index.css              # Tailwind setup
│  └─ index.js
├─ tailwind.config.js
├─ postcss.config.js
├─ package.json
└─ README.md
```

Usage Tips
----------

- Open the Calendar view using the header toggle or the Calendar quick action.
- Use Conflicts to scan overlaps; choose Auto-resolve with smart moves to let the assistant tidy up.
- Try Plan a surprise for my family for tailored ideas and ready-to-schedule flows.
- Say Show today’s optimized view to switch to today’s agenda automatically.
- The assistant protects routines (e.g., coffee break) and respects peak focus hours.

Data and Memory
---------------

- Preferences, calendar (mock), and conversation history are stored locally in your browser via localStorage.
- No server or external storage is used in this demo.

Customization
-------------

Inside src/FamilyButlerChat.jsx:
- Tune the initial memory object (names, cuisines, peak hours, surprise ideas)
- Adjust the mock calendar array for different demo scenarios (add overlaps to showcase conflict resolution)
- Extend the response generators for more domains (fitness, learning, finances, etc.)

Roadmap Ideas
-------------

- Month grid calendar and event creation/editing
- Real provider sync (Google/Microsoft) and two-way updates
- Natural language event creation and smart reminders
- Multi-user presence and shared plans
- Cloud sync with account sign-in

License
-------

This project is provided as-is for demo and personal use. Add a LICENSE file if you plan to open-source formally (MIT is a good default).


