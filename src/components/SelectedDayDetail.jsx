import React from 'react';
import { formatTime, formatDate, getEventColor } from '../utils/helper';

const SelectedDayDetail = ({ 
  selectedDate, 
  selectedDayEvents, 
  setSelectedDate, 
  shouldEventShowStrikethrough 
}) => {
  if (!selectedDate) return null;

  return (
    <div className="hidden lg:block mt-4 sm:mt-6 bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">
          {formatDate(new Date(selectedDate.year, selectedDate.month, selectedDate.day))}
        </h3>
        <button
          onClick={() => setSelectedDate(null)}
          className="text-sm text-gray-600 hover:text-gray-800 touch-manipulation px-2 py-1"
          aria-label="Close selected day details"
        >
          Close
        </button>
      </div>

      {selectedDayEvents.length === 0 ? (
        <div className="text-center py-6 sm:py-8">
          <p className="text-gray-600">No events scheduled</p>
        </div>
      ) : (
        <div className="space-y-3">
          {selectedDayEvents.map((event) => {
            const eventColorClasses = getEventColor(event.type);
            const colorName = event.type === 'work' ? 'blue' :
                             event.type === 'family' ? 'green' :
                             event.type === 'personal' ? 'purple' :
                             'orange';
            
            return (
              <div 
                key={event.id}
                className={`p-3 sm:p-4 rounded-lg border-l-4 ${event.conflict ? 'border-red-500 bg-red-50' : `border-${colorName}-500 ${eventColorClasses}`}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className={`font-bold text-sm sm:text-base ${
                        shouldEventShowStrikethrough(event) ? 'line-through' : ''
                      } ${event.conflict ? 'text-red-800' : 'text-gray-800'}`}>
                        {event.title}
                      </h4>
                      {event.protected && (
                        <span className="text-xs px-2 py-0.5 rounded bg-purple-200 text-purple-800 font-semibold whitespace-nowrap">
                          PROTECTED
                        </span>
                      )}
                      {event.conflict && (
                        <span className="text-xs px-2 py-0.5 rounded bg-red-200 text-red-800 font-semibold whitespace-nowrap">
                          CONFLICT
                        </span>
                      )}
                      {event.notes && event.notes.includes('Rescheduled') && (
                        <span className="text-xs px-2 py-0.5 rounded bg-green-200 text-green-800 font-semibold whitespace-nowrap">
                          RESOLVED
                        </span>
                      )}
                    </div>
                    <p className={`text-xs sm:text-sm mb-2 ${event.conflict ? 'text-red-700' : 'text-gray-700'}`}>
                      {formatTime(event.start)} - {formatTime(event.end)}
                    </p>
                    {event.location && (
                      <p className={`text-xs truncate ${event.conflict ? 'text-red-600' : 'text-gray-600'}`}>
                        📍 {event.location}
                      </p>
                    )}
                    {event.notes && (
                      <p className={`text-xs italic mt-1 line-clamp-2 ${event.conflict ? 'text-red-600' : 'text-gray-600'}`}>
                        {event.notes}
                      </p>
                    )}
                    {event.attendees && (
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        👥 {event.attendees.join(', ')}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ml-2 flex-shrink-0 ${event.conflict ? 'bg-red-200 text-red-800' : `bg-${colorName}-200 text-${colorName}-800`}`}>
                    {event.conflict ? 'conflict' : event.type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SelectedDayDetail;
