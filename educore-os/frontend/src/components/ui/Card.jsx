import React from 'react';

/**
 * Reusable Card Component
 * Provides consistent card styling across the app
 */
const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  hover = false,
  ...props 
}) => {
  // Padding variants
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };
  
  // Hover effect
  const hoverStyles = hover ? 'hover:border-[#1e3a8a] transition-colors cursor-pointer' : '';
  
  return (
    <div 
      className={`bg-white border border-gray-300 ${paddings[padding]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card Header Component
 */
export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`border-b border-gray-300 pb-4 mb-4 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * Card Title Component
 */
export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-sm font-semibold text-gray-900 ${className}`} {...props}>
    {children}
  </h3>
);

/**
 * Card Description Component
 */
export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-xs text-gray-600 ${className}`} {...props}>
    {children}
  </p>
);

/**
 * Card Footer Component
 */
export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`border-t border-gray-300 pt-4 mt-4 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
