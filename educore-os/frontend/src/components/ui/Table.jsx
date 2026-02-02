import React from 'react';

/**
 * Reusable Table Component
 * Provides consistent table styling across the app
 */
const Table = ({ children, className = '', ...props }) => (
  <div className="overflow-x-auto">
    <table className={`w-full ${className}`} {...props}>
      {children}
    </table>
  </div>
);

/**
 * Table Header Component
 */
export const TableHeader = ({ children, className = '', ...props }) => (
  <thead className={`bg-gray-100 border-b border-gray-300 ${className}`} {...props}>
    {children}
  </thead>
);

/**
 * Table Body Component
 */
export const TableBody = ({ children, className = '', ...props }) => (
  <tbody className={`divide-y divide-gray-200 ${className}`} {...props}>
    {children}
  </tbody>
);

/**
 * Table Row Component
 */
export const TableRow = ({ children, className = '', hover = true, ...props }) => (
  <tr className={`${hover ? 'hover:bg-gray-50' : ''} ${className}`} {...props}>
    {children}
  </tr>
);

/**
 * Table Head Cell Component
 */
export const TableHead = ({ children, className = '', align = 'left', ...props }) => {
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  
  return (
    <th 
      className={`px-4 py-3 ${alignments[align]} text-xs font-semibold text-gray-700 uppercase ${className}`} 
      {...props}
    >
      {children}
    </th>
  );
};

/**
 * Table Cell Component
 */
export const TableCell = ({ children, className = '', align = 'left', ...props }) => {
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  
  return (
    <td 
      className={`px-4 py-3 text-sm ${alignments[align]} ${className}`} 
      {...props}
    >
      {children}
    </td>
  );
};

/**
 * Table Footer Component
 */
export const TableFooter = ({ children, className = '', ...props }) => (
  <tfoot className={`bg-gray-50 border-t border-gray-300 ${className}`} {...props}>
    {children}
  </tfoot>
);

export default Table;
