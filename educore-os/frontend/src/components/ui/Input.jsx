import React from 'react';

/**
 * Reusable Input Component
 * Supports different types and includes label and error handling
 */
const Input = ({ 
  label,
  error,
  helperText,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  ...props 
}) => {
  const inputStyles = `
    w-full px-3 py-2 border text-sm 
    focus:outline-none focus:border-[#1e3a8a]
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${className}
  `;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={inputStyles}
        {...props}
      />
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
};

/**
 * Textarea Component
 */
export const Textarea = ({ 
  label,
  error,
  helperText,
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  rows = 3,
  className = '',
  ...props 
}) => {
  const textareaStyles = `
    w-full px-3 py-2 border text-sm 
    focus:outline-none focus:border-[#1e3a8a]
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${className}
  `;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        rows={rows}
        className={textareaStyles}
        {...props}
      />
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
};

/**
 * Select Component
 */
export const Select = ({ 
  label,
  error,
  helperText,
  value,
  onChange,
  disabled = false,
  required = false,
  options = [],
  placeholder = 'Select an option',
  className = '',
  ...props 
}) => {
  const selectStyles = `
    w-full px-3 py-2 border text-sm 
    focus:outline-none focus:border-[#1e3a8a]
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${className}
  `;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={selectStyles}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
