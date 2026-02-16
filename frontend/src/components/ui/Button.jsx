import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable Button Component
 * Supports different variants, sizes, and can render as Link or button
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  to, 
  href,
  onClick, 
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
  ...props 
}) => {
  // Base styles
  const baseStyles = 'font-semibold transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variant styles
  const variants = {
    primary: 'bg-[#1e3a8a] text-white hover:bg-[#1e293b]',
    secondary: 'bg-white border-2 border-[#1e3a8a] text-gray-900 hover:bg-gray-50',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-gray-700 hover:bg-gray-100',
  };
  
  // Size styles
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';
  
  // Combine all styles
  const combinedStyles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyles} ${className}`;
  
  // Render as Link if 'to' prop is provided
  if (to) {
    return (
      <Link to={to} className={combinedStyles} {...props}>
        {children}
      </Link>
    );
  }
  
  // Render as anchor if 'href' prop is provided
  if (href) {
    return (
      <a href={href} className={combinedStyles} {...props}>
        {children}
      </a>
    );
  }
  
  // Render as button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedStyles}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
