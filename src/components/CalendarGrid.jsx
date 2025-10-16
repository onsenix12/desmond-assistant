import React from 'react';
import { AlertCircle, Shield, Calendar } from 'lucide-react';
import { 
  generateCalendarGrid, 
  getShortDayName, 
  getBusynessLevel, 
  getBusynessColor,
  isToday as checkIsToday,
  getDateString,
  getEventColor
} from '../utils/helper';

const CalendarGrid = ({ 
  year, 
  month, 
  events, 
  conflicts, 
  selectedDate, 
  onDateSelect 
}) => {
  const calendarGrid = generateCalendarGrid(year, month);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  
  // Get events for a specific day
  const getEventsForDay = (day) => {
    if (!day) return [];
    // Create date string directly to avoid timezone issues
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.start.startsWith(dateStr));
  };

  // Get conflicts for a specific day
  const getConflictsForDay = (day) => {
    if (!day) return [];
    // Create date string directly to avoid timezone issues
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return conflicts.filter(conflict => conflict.date === dateStr);
  };

  // Check if day has protected time
  const hasProtectedTime = (day) => {
    const dayEvents = getEventsForDay(day);
    return dayEvents.some(event => event.protected === true);
  };

  // Day header row
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6" data-testid="calendar-grid">
      {/* Month/Year Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Calendar className="text-blue-600" size={18} />
          <h2 className="text-base sm:text-2xl font-bold text-gray-800">
            {monthNames[month]} {year}
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-50 border border-blue-200"></div>
            <span>Light</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-200 border border-blue-400"></div>
            <span>Busy</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-300 border border-blue-600"></div>
            <span>Very Busy</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gray-50">
          {dayHeaders.map((day, idx) => (
            <div 
              key={idx}
              className={`py-2 sm:py-4 text-center text-xs sm:text-base font-semibold ${
                idx === 0 || idx === 6 ? 'text-gray-500' : 'text-gray-700'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        {calendarGrid.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 border-t border-gray-200">
            {week.map((day, dayIdx) => {
              if (!day) {
                return (
                  <div 
                    key={dayIdx} 
                    className="min-h-[70px] sm:min-h-[110px] bg-gray-50 border-r border-gray-200 last:border-r-0"
                  />
                );
              }

              const dayEvents = getEventsForDay(day);
              const dayConflicts = getConflictsForDay(day);
              const busyness = getBusynessLevel(dayEvents.length);
              const busynessColor = getBusynessColor(busyness);
              const isCurrentDay = checkIsToday(year, month, day);
              const isSelected = selectedDate && 
                                 selectedDate.year === year && 
                                 selectedDate.month === month && 
                                 selectedDate.day === day;
              const hasConflicts = dayConflicts.length > 0;
              const isProtected = hasProtectedTime(day);

              return (
                <div
                  key={dayIdx}
                  onClick={() => onDateSelect({ year, month, day })}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onDateSelect({ year, month, day });
                    }
                  }}
                  className={`
                    min-h-[60px] sm:min-h-[110px] p-1 sm:p-3 border-r border-gray-200 last:border-r-0
                    cursor-pointer transition-all relative touch-manipulation
                    ${busynessColor}
                    ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}
                    ${isCurrentDay && !isSelected ? 'ring-2 ring-purple-400 ring-inset' : ''}
                    hover:bg-blue-100 active:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                  aria-label={`${day} ${monthNames[month]} ${year}${dayEvents.length > 0 ? `, ${dayEvents.length} events` : ''}`}
                >
                  {/* Day Number */}
                  <div className="flex items-start justify-between mb-1 sm:mb-3">
                    <span className={`
                      text-xs sm:text-base font-semibold
                      ${isCurrentDay ? 'bg-purple-600 text-white px-1.5 sm:px-3 py-0.5 sm:py-1.5 rounded-full' : 'text-gray-700'}
                      ${dayIdx === 0 || dayIdx === 6 ? 'text-gray-500' : ''}
                    `}>
                      {day}
                    </span>
                    
                    {/* Badges - Mobile optimized */}
                    <div className="flex flex-col gap-0.5">
                      {hasConflicts && (
                        <div className="bg-red-500 text-white text-xs px-1 py-0.5 rounded-full flex items-center gap-0.5 min-w-[16px] h-4">
                          <AlertCircle size={8} className="sm:w-3 sm:h-3" />
                          <span className="hidden sm:inline">{dayConflicts.length}</span>
                        </div>
                      )}
                      {isProtected && !hasConflicts && (
                        <div className="bg-purple-500 text-white text-xs px-1 py-0.5 rounded-full flex items-center gap-0.5 min-w-[16px] h-4">
                          <Shield size={8} className="sm:w-3 sm:h-3" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Event Indicators - Mobile Optimized */}
                  <div className="space-y-0.5 sm:space-y-1">
                    {dayEvents.slice(0, 2).map((event, idx) => {
                      const eventColorClasses = getEventColor(event.type); // Get the complete color classes
                      
                      return (
                        <div 
                          key={idx}
                          className={`calendar-event-tile text-xs px-1 py-0.5 rounded ${eventColorClasses} ${
                            event.conflict ? 'opacity-50 line-through' : ''
                          } ${
                            event.notes && (event.notes.includes('Rescheduled') || event.notes.includes('Shortened to respect') || event.notes.includes('Protected time')) ? 'ring-1 ring-green-400' : ''
                          }`}
                          title={event.title}
                        >
                          <div className="truncate">
                            <span className="hidden sm:inline">{event.title}</span>
                            <span className="sm:hidden">{event.title.length > 8 ? event.title.substring(0, 8) + '...' : event.title}</span>
                          </div>
                        </div>
                      );
                    })}
                    
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-800 font-semibold text-center">
                        +{dayEvents.length - 2}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-600 gap-2 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-600 rounded"></div>
            <span>Work</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-600 rounded"></div>
            <span>Family</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-600 rounded"></div>
            <span>Personal</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-600 rounded"></div>
            <span>Study</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <AlertCircle size={12} className="text-red-500 sm:w-3.5 sm:h-3.5" />
            <span>Conflict</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Shield size={12} className="text-purple-500 sm:w-3.5 sm:h-3.5" />
            <span>Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;