import React from 'react';
import { HelpCircle, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { CalendarHeaderProps } from '../types';

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ connectedCount }) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg">
              <CalendarIcon size={20} className="text-white sm:w-7 sm:h-7" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">
                Time Tetris
              </h1>
              <p className="text-xs text-gray-600">
                Smart scheduling for Desmond
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-sm font-bold text-gray-800">
                Time Tetris
              </h1>
            </div>
          </div>

          {/* Center: Connected Apps Status - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            {connectedCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-green-700">
                  {connectedCount} app{connectedCount > 1 ? 's' : ''} connected
                </span>
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-white bg-[#119BFE] hover:brightness-95 font-semibold"
              aria-label="New event"
              onClick={(e) => {
                e.preventDefault();
                if (typeof window !== 'undefined') {
                  const ev = new CustomEvent('tt:new-event');
                  window.dispatchEvent(ev);
                }
              }}
            >
              <span className="hidden sm:inline">New event</span>
              <span className="sm:hidden flex items-center gap-1"><Plus size={14} /> New</span>
            </button>
            <button 
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
              aria-label="Help"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const ev = new CustomEvent('tt:replay-tutorial');
                  window.dispatchEvent(ev);
                }
              }}
            >
              <HelpCircle size={16} className="text-gray-600 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
        
        {/* Mobile: Connected Apps Status */}
        {connectedCount > 0 && (
          <div className="md:hidden mt-2 flex items-center justify-center">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-green-700">
                {connectedCount} app{connectedCount > 1 ? 's' : ''} connected
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarHeader;
