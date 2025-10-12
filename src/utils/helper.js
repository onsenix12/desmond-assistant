// Utility Helper Functions

// Format time from ISO string
export const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  // Format date from ISO string
  export const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };
  
// Get date string in YYYY-MM-DD format
export const getDateString = (date) => {
  const d = new Date(date);
  // Use UTC methods to avoid timezone issues
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
  
  // Check if two events overlap
  export const eventsOverlap = (event1, event2) => {
    const start1 = new Date(event1.start);
    const end1 = new Date(event1.end);
    const start2 = new Date(event2.start);
    const end2 = new Date(event2.end);
    
    return (start1 < end2 && end1 > start2);
  };
  
  // Get event color based on type
  export const getEventColor = (type) => {
    const colors = {
      work: 'bg-blue-100 border-blue-400 text-blue-800',
      family: 'bg-green-100 border-green-400 text-green-800',
      personal: 'bg-purple-100 border-purple-400 text-purple-800',
      study: 'bg-orange-100 border-orange-400 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 border-gray-400 text-gray-800';
  };
  
  // Get event icon based on type
  export const getEventIcon = (type) => {
    const icons = {
      work: '💼',
      family: '👨‍👩‍👦',
      personal: '⭐',
      study: '📚',
    };
    return icons[type] || '📌';
  };
  
  // Calculate busyness level for a day (0-5+ events)
  export const getBusynessLevel = (eventCount) => {
    if (eventCount === 0) return 'free';
    if (eventCount === 1) return 'light';
    if (eventCount <= 2) return 'moderate';
    if (eventCount <= 4) return 'busy';
    return 'very-busy';
  };
  
  // Get busyness color for calendar grid
  export const getBusynessColor = (level) => {
    const colors = {
      free: 'bg-white',
      light: 'bg-blue-50',
      moderate: 'bg-blue-100',
      busy: 'bg-blue-200',
      'very-busy': 'bg-blue-300',
    };
    return colors[level] || 'bg-white';
  };
  
  // Generate calendar grid for a month
  export const generateCalendarGrid = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const grid = [];
    let week = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      week.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      
      if (week.length === 7) {
        grid.push(week);
        week = [];
      }
    }
    
    // Add remaining empty cells
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      grid.push(week);
    }
    
    return grid;
  };
  
  // Get day of week name
  export const getDayName = (dayIndex) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
  };
  
  // Get short day name
  export const getShortDayName = (dayIndex) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex];
  };
  
  // Check if date is today
  export const isToday = (year, month, day) => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };
  
  // Get conflict severity color
  export const getConflictColor = (severity) => {
    const colors = {
      high: 'bg-red-100 border-red-400 text-red-800',
      medium: 'bg-yellow-100 border-yellow-400 text-yellow-800',
      low: 'bg-blue-100 border-blue-400 text-blue-800',
    };
    return colors[severity] || 'bg-gray-100 border-gray-400 text-gray-800';
  };
  
  // Count events by type for a day
  export const countEventsByType = (events) => {
    return events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {});
  };
  
  // Check if time slot is protected
  export const isProtectedTime = (event) => {
    return event.protected === true;
  };
  
// Sort events by start time
export const sortEventsByTime = (events) => {
  return [...events].sort((a, b) => 
    new Date(a.start) - new Date(b.start)
  );
};

// Format conflict date for display
export const formatConflictDate = (dateString) => {
  const date = new Date(dateString);
  const options = { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
};

// Color mapping for dynamic Tailwind classes
export const getColorClasses = (color, variant = 'default') => {
  const colorMap = {
    red: {
      default: 'bg-red-100 border-red-400 text-red-800',
      light: 'bg-red-50 border-red-200 text-red-700',
      dark: 'bg-red-200 border-red-600 text-red-900',
      border: 'border-red-500',
      bg: 'bg-red-500',
      text: 'text-red-600'
    },
    yellow: {
      default: 'bg-yellow-100 border-yellow-400 text-yellow-800',
      light: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      dark: 'bg-yellow-200 border-yellow-600 text-yellow-900',
      border: 'border-yellow-500',
      bg: 'bg-yellow-500',
      text: 'text-yellow-600'
    },
    blue: {
      default: 'bg-blue-100 border-blue-400 text-blue-800',
      light: 'bg-blue-50 border-blue-200 text-blue-700',
      dark: 'bg-blue-200 border-blue-600 text-blue-900',
      border: 'border-blue-500',
      bg: 'bg-blue-500',
      text: 'text-blue-600'
    },
    green: {
      default: 'bg-green-100 border-green-400 text-green-800',
      light: 'bg-green-50 border-green-200 text-green-700',
      dark: 'bg-green-200 border-green-600 text-green-900',
      border: 'border-green-500',
      bg: 'bg-green-500',
      text: 'text-green-600'
    },
    purple: {
      default: 'bg-purple-100 border-purple-400 text-purple-800',
      light: 'bg-purple-50 border-purple-200 text-purple-700',
      dark: 'bg-purple-200 border-purple-600 text-purple-900',
      border: 'border-purple-500',
      bg: 'bg-purple-500',
      text: 'text-purple-600'
    },
    orange: {
      default: 'bg-orange-100 border-orange-400 text-orange-800',
      light: 'bg-orange-50 border-orange-200 text-orange-700',
      dark: 'bg-orange-200 border-orange-600 text-orange-900',
      border: 'border-orange-500',
      bg: 'bg-orange-500',
      text: 'text-orange-600'
    },
    emerald: {
      default: 'bg-emerald-100 border-emerald-400 text-emerald-800',
      light: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      dark: 'bg-emerald-200 border-emerald-600 text-emerald-900',
      border: 'border-emerald-500',
      bg: 'bg-emerald-500',
      text: 'text-emerald-600'
    }
  };
  
  return colorMap[color]?.[variant] || colorMap.blue.default;
};
