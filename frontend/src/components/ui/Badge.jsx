import React from 'react';

/**
 * Reusable Badge Component
 * For status indicators, labels, and tags
 */
const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '',
  ...props 
}) => {
  // Variant styles
  const variants = {
    default: 'bg-gray-200 text-gray-700',
    primary: 'bg-[#1e3a8a] text-white',
    success: 'bg-green-100 text-green-700 border border-green-300',
    warning: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    danger: 'bg-red-100 text-red-700 border border-red-300',
    info: 'bg-blue-100 text-blue-700 border border-blue-300',
  };
  
  // Size styles
  const sizes = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };
  
  return (
    <span 
      className={`inline-block font-medium ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
