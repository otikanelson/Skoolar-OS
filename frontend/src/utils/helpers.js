import { GRADE_SCALE, SCORE_LIMITS } from './constants';

/**
 * Utility Helper Functions
 * Reusable functions for common operations
 */

/**
 * Calculate grade based on total score
 */
export const calculateGrade = (total) => {
  const gradeInfo = GRADE_SCALE.find(
    (scale) => total >= scale.min && total <= scale.max
  );
  return gradeInfo || { grade: 'F', remark: 'Fail' };
};

/**
 * Calculate total score from CA and Exam
 */
export const calculateTotal = (ca, exam) => {
  const caScore = Math.min(Number(ca) || 0, SCORE_LIMITS.CA_MAX);
  const examScore = Math.min(Number(exam) || 0, SCORE_LIMITS.EXAM_MAX);
  return caScore + examScore;
};

/**
 * Validate score within limits
 */
export const validateScore = (score, max) => {
  const numScore = Number(score);
  if (isNaN(numScore)) return 0;
  return Math.min(Math.max(numScore, 0), max);
};

/**
 * Format date to readable string
 */
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year)
    .replace('HH', hours)
    .replace('mm', minutes);
};

/**
 * Format time ago (e.g., "2 hours ago")
 */
export const timeAgo = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(date);
};

/**
 * Format currency (Nigerian Naira)
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₦0';
  return `₦${Number(amount).toLocaleString('en-NG')}`;
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (!value && value !== 0) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

/**
 * Capitalize first letter
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Convert to title case
 */
export const toTitleCase = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Generate initials from name
 */
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Calculate class average
 */
export const calculateAverage = (scores) => {
  if (!scores || scores.length === 0) return 0;
  const sum = scores.reduce((acc, score) => acc + Number(score), 0);
  return (sum / scores.length).toFixed(1);
};

/**
 * Calculate position/rank
 */
export const calculatePosition = (scores, currentScore) => {
  const sorted = [...scores].sort((a, b) => b - a);
  const position = sorted.indexOf(currentScore) + 1;
  return position;
};

/**
 * Get ordinal suffix (1st, 2nd, 3rd, etc.)
 */
export const getOrdinal = (number) => {
  const num = Number(number);
  if (isNaN(num)) return '';
  
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Nigerian format)
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+234|0)[789]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * Generate random ID
 */
export const generateId = (prefix = 'ID') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
};

/**
 * Debounce function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Download file
 */
export const downloadFile = (data, filename, type = 'text/plain') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Copy to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

/**
 * Sleep/delay function
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export default {
  calculateGrade,
  calculateTotal,
  validateScore,
  formatDate,
  timeAgo,
  formatCurrency,
  formatPercentage,
  truncate,
  capitalize,
  toTitleCase,
  getInitials,
  calculateAverage,
  calculatePosition,
  getOrdinal,
  isValidEmail,
  isValidPhone,
  generateId,
  deepClone,
  isEmpty,
  debounce,
  throttle,
  downloadFile,
  copyToClipboard,
  sleep,
};
