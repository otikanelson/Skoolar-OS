// EduCore Color System - Institutional Professional Palette

export const colors = {
  // Primary Colors
  primary: {
    DEFAULT: '#1e3a8a', // Dark Blue (blue-900)
    dark: '#1e293b',    // Darker Blue (slate-800)
    light: '#3b82f6',   // Lighter Blue (blue-500)
  },
  
  // Neutral Colors
  neutral: {
    white: '#ffffff',
    offWhite: '#fafaf9', // Soft off-white background
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
  },
  
  // Semantic Colors
  success: '#059669',   // green-600
  warning: '#d97706',   // amber-600
  error: '#dc2626',     // red-600
  info: '#2563eb',      // blue-600
};

// Tailwind class mappings for easy use
export const tw = {
  // Backgrounds
  bg: {
    primary: 'bg-[#1e3a8a]',
    primaryDark: 'bg-[#1e293b]',
    primaryLight: 'bg-[#3b82f6]',
    white: 'bg-white',
    offWhite: 'bg-[#fafaf9]',
    gray50: 'bg-gray-50',
    gray100: 'bg-gray-100',
  },
  
  // Text
  text: {
    primary: 'text-[#1e3a8a]',
    primaryDark: 'text-[#1e293b]',
    white: 'text-white',
    gray600: 'text-gray-600',
    gray700: 'text-gray-700',
    gray900: 'text-gray-900',
  },
  
  // Borders
  border: {
    primary: 'border-[#1e3a8a]',
    gray200: 'border-gray-200',
    gray300: 'border-gray-300',
  },
  
  // Hover states
  hover: {
    primaryDark: 'hover:bg-[#1e293b]',
    gray50: 'hover:bg-gray-50',
    gray100: 'hover:bg-gray-100',
  },
};

export default colors;
