/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {},
  },
  safelist: [
    // Colors for event types
    'bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-300', 'bg-blue-600', 'bg-blue-700',
    'bg-green-50', 'bg-green-100', 'bg-green-200', 'bg-green-600', 'bg-green-700',
    'bg-purple-50', 'bg-purple-100', 'bg-purple-200', 'bg-purple-600', 'bg-purple-700',
    'bg-orange-50', 'bg-orange-100', 'bg-orange-200', 'bg-orange-600', 'bg-orange-700',
    'bg-red-50', 'bg-red-100', 'bg-red-200', 'bg-red-300', 'bg-red-400', 'bg-red-500', 'bg-red-600',
    'bg-yellow-50', 'bg-yellow-100', 'bg-yellow-200',
    'bg-emerald-50', 'bg-emerald-100', 'bg-emerald-600', 'bg-emerald-700',
    
    // Border colors
    'border-blue-200', 'border-blue-400', 'border-blue-500', 'border-blue-600',
    'border-green-200', 'border-green-400', 'border-green-600',
    'border-purple-200', 'border-purple-400', 'border-purple-600',
    'border-orange-200', 'border-orange-400', 'border-orange-600',
    'border-red-200', 'border-red-300', 'border-red-400', 'border-red-500',
    'border-yellow-200', 'border-yellow-300', 'border-yellow-400',
    'border-emerald-200', 'border-emerald-400',
    
    // Text colors
    'text-blue-600', 'text-blue-700', 'text-blue-800',
    'text-green-600', 'text-green-700', 'text-green-800',
    'text-purple-600', 'text-purple-700', 'text-purple-800',
    'text-orange-600', 'text-orange-700', 'text-orange-800',
    'text-red-600', 'text-red-700', 'text-red-800',
    'text-yellow-700', 'text-yellow-800',
    'text-emerald-600', 'text-emerald-700',
    
    // Ring colors
    'ring-blue-500', 'ring-purple-400',
  ],
  plugins: [],
};


