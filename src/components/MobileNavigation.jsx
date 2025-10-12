import React from 'react';
import { Settings, Calendar as CalendarIcon } from 'lucide-react';

const MobileNavigation = ({ showMobileChat, setShowMobileChat }) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
      <div className="flex items-center justify-around py-2">
        <button 
          className="flex flex-col items-center gap-1 p-2 touch-manipulation"
          aria-label="Calendar view"
        >
          <CalendarIcon size={20} className="text-blue-600" />
          <span className="text-xs font-medium text-blue-600">Calendar</span>
        </button>
        <button 
          onClick={() => setShowMobileChat(!showMobileChat)}
          className={`flex flex-col items-center gap-1 p-2 touch-manipulation transition-colors ${
            showMobileChat ? 'bg-blue-50' : ''
          }`}
          aria-label="Ask anything"
        >
          <svg className={`w-5 h-5 ${showMobileChat ? "text-blue-600" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className={`text-xs font-medium ${showMobileChat ? 'text-blue-600' : 'text-gray-600'}`}>
            Ask Anything
          </span>
        </button>
        <button 
          className="flex flex-col items-center gap-1 p-2 touch-manipulation"
          aria-label="Settings"
        >
          <Settings size={20} className="text-gray-600" />
          <span className="text-xs font-medium text-gray-600">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNavigation;
