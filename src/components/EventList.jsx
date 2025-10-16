import React from 'react';
import { formatTime, formatDate, getEventColor } from '../utils/helper';

const EventList = ({ 
  selectedDate, 
  selectedDayEvents, 
  setSelectedDate, 
  shouldEventShowStrikethrough 
}) => {
  if (!selectedDate) return null;

  return (
    <div className="lg:hidden mb-4 bg-white rounded-xl shadow-lg p-4" data-testid="day-event-list">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          {formatDate(new Date(selectedDate.year, selectedDate.month, selectedDate.day))}
        </h3>
        <button
          onClick={() => setSelectedDate(null)}
          className="text-sm text-gray-600 hover:text-gray-800 px-2 py-1"
        >
          Close
        </button>
      </div>
      {selectedDayEvents.length === 0 ? (
        <div className="text-center py-6">
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
                className={`p-3 rounded-lg border-l-4 ${event.conflict ? 'border-red-500 bg-red-50' : `border-${colorName}-500 ${eventColorClasses}`}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold text-sm ${event.conflict ? 'text-red-800' : 'text-gray-800'}`}>
                      {event.title}
                    </h4>
                    <p className={`text-xs mb-1 ${event.conflict ? 'text-red-700' : 'text-gray-700'}`}>
                      {formatTime(event.start)} - {formatTime(event.end)}
                    </p>
                    {event.location && (
                      <p className={`text-xs ${event.conflict ? 'text-red-600' : 'text-gray-600'}`}>
                        📍 {event.location}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${event.conflict ? 'bg-red-200 text-red-800' : `bg-${colorName}-200 text-${colorName}-800`}`}>
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

export default EventList;
