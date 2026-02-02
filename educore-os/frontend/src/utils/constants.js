/**
 * Application Constants
 * Centralized configuration and constant values
 */

// User Roles
export const ROLES = {
  ADMIN: 'admin',
  HOD: 'hod',
  TEACHER: 'teacher',
  PARENT: 'parent',
  STUDENT: 'student',
};

// Grade Scale
export const GRADE_SCALE = [
  { grade: 'A', min: 80, max: 100, remark: 'Excellent' },
  { grade: 'B', min: 70, max: 79, remark: 'Very Good' },
  { grade: 'C', min: 60, max: 69, remark: 'Good' },
  { grade: 'D', min: 50, max: 59, remark: 'Pass' },
  { grade: 'F', min: 0, max: 49, remark: 'Fail' },
];

// Score Limits
export const SCORE_LIMITS = {
  CA_MAX: 40,
  EXAM_MAX: 60,
  TOTAL_MAX: 100,
};

// Class Levels
export const CLASS_LEVELS = [
  { value: 'jss1', label: 'JSS 1' },
  { value: 'jss2', label: 'JSS 2' },
  { value: 'jss3', label: 'JSS 3' },
  { value: 'sss1', label: 'SSS 1' },
  { value: 'sss2', label: 'SSS 2' },
  { value: 'sss3', label: 'SSS 3' },
];

// Student Status
export const STUDENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  GRADUATED: 'graduated',
  SUSPENDED: 'suspended',
};

// Result Status
export const RESULT_STATUS = {
  DRAFT: 'draft',
  PENDING_HOD: 'pending_hod',
  PENDING_ADMIN: 'pending_admin',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Approval Stages
export const APPROVAL_STAGES = [
  { number: 1, label: 'Teacher Submitted', status: 'draft' },
  { number: 2, label: 'HOD Review', status: 'pending_hod' },
  { number: 3, label: 'Admin Approval', status: 'pending_admin' },
  { number: 4, label: 'Published', status: 'approved' },
];

// Terms
export const TERMS = [
  { value: '1st', label: '1st Term' },
  { value: '2nd', label: '2nd Term' },
  { value: '3rd', label: '3rd Term' },
];

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
};

// API Endpoints (for when backend is connected)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify',
    PROFILE: '/auth/profile',
  },
  STUDENTS: {
    LIST: '/students',
    CREATE: '/students',
    UPDATE: (id) => `/students/${id}`,
    DELETE: (id) => `/students/${id}`,
    GET: (id) => `/students/${id}`,
  },
  RESULTS: {
    LIST: '/results',
    SUBMIT: '/results/submit',
    APPROVE: (id) => `/results/${id}/approve`,
    REJECT: (id) => `/results/${id}/reject`,
    PENDING: '/results/pending',
  },
  TEACHERS: {
    LIST: '/teachers',
    SUBJECTS: (id) => `/teachers/${id}/subjects`,
  },
};

// School Information
export const SCHOOL_INFO = {
  NAME: 'Fieldgreen Secondary School',
  SHORT_NAME: 'Fieldgreen',
  ADDRESS: '123 Education Avenue, Lagos, Nigeria',
  PHONE: '+234 800 123 4567',
  EMAIL: 'info@fieldgreen.edu.ng',
  WEBSITE: 'www.fieldgreen.edu.ng',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

export default {
  ROLES,
  GRADE_SCALE,
  SCORE_LIMITS,
  CLASS_LEVELS,
  STUDENT_STATUS,
  RESULT_STATUS,
  APPROVAL_STAGES,
  TERMS,
  GENDER_OPTIONS,
  PAGINATION,
  DATE_FORMATS,
  API_ENDPOINTS,
  SCHOOL_INFO,
  NOTIFICATION_TYPES,
};
