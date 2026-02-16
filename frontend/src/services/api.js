import { getAuthToken, getRefreshToken, setAuthToken, logout, isTokenExpired, isRefreshTokenExpired } from '../utils/auth';

// Remove trailing slash from API_URL to prevent double slashes
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise = null;

// Refresh the access token
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken || isRefreshTokenExpired()) {
    logout();
    throw new Error('Session expired. Please login again.');
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    setAuthToken(data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    logout();
    throw error;
  }
};

// API request wrapper with authentication and automatic token refresh
const apiRequest = async (endpoint, options = {}) => {
  // Don't try to refresh token for login/register endpoints
  const isAuthEndpoint = endpoint.includes('/auth/login') || 
                         endpoint.includes('/auth/register') || 
                         endpoint.includes('/auth/refresh') ||
                         endpoint.includes('/auth/check-portal');

  console.log('🔍 API Request:', { endpoint, isAuthEndpoint, hasToken: !!getAuthToken() });

  // Check if token needs refresh before making the request (skip for auth endpoints)
  if (!isAuthEndpoint && getAuthToken() && isTokenExpired() && !isRefreshTokenExpired()) {
    console.log('🔄 Token expired, attempting refresh...');
    // If already refreshing, wait for that to complete
    if (isRefreshing) {
      await refreshPromise;
    } else {
      // Start refresh process
      isRefreshing = true;
      refreshPromise = refreshAccessToken().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
      await refreshPromise;
    }
  }

  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Only add auth header if we have a token AND it's not an auth endpoint (except refresh)
      ...(token && !isAuthEndpoint && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    console.log('📡 Response:', { endpoint, status: response.status, isAuthEndpoint });
    
    // Handle rate limiting (429)
    if (response.status === 429) {
      console.log('⏱️ Rate limited - too many requests');
      throw new Error('Too many login attempts. Please wait a few minutes and try again.');
    }
    
    // Handle unauthorized (401) - token expired or invalid
    if (response.status === 401) {
      // For auth endpoints (login/register), don't try to refresh - just return the error
      if (isAuthEndpoint) {
        const data = await response.json();
        console.log('❌ Auth endpoint failed with 401:', data);
        throw new Error(data.message || 'Invalid credentials. Please check your email and password.');
      }

      // For protected endpoints, try to refresh token once
      if (!isRefreshTokenExpired()) {
        console.log('🔄 Protected endpoint 401, trying to refresh token...');
        try {
          await refreshAccessToken();
          // Retry the original request with new token
          const newToken = getAuthToken();
          config.headers['Authorization'] = `Bearer ${newToken}`;
          const retryResponse = await fetch(`${API_URL}${endpoint}`, config);
          
          if (retryResponse.ok) {
            return await retryResponse.json();
          }
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
        }
      }
      
      // Only logout and show "session expired" for protected endpoints
      console.log('❌ Session expired, logging out...');
      logout();
      throw new Error('Session expired. Please login again.');
    }
    
    // Handle forbidden (403) - insufficient permissions
    if (response.status === 403) {
      throw new Error('You do not have permission to perform this action.');
    }
    
    // Parse response
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    
    // Provide more helpful error messages
    if (error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please ensure the backend is running at ' + API_URL);
    }
    
    throw error;
  }
};

// Authentication API
export const authAPI = {
  // Check portal/school exists
  checkPortal: async (identifier) => {
    return apiRequest('/auth/check-portal', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    });
  },
  
  // Register school
  registerSchool: async (schoolData) => {
    return apiRequest('/auth/register-school', {
      method: 'POST',
      body: JSON.stringify(schoolData),
    });
  },
  
  // Get pending registrations (manufacturer only)
  getPendingRegistrations: async () => {
    return apiRequest('/auth/registrations/pending', {
      method: 'GET',
    });
  },
  
  // Approve school registration (manufacturer only)
  approveRegistration: async (schoolId) => {
    return apiRequest(`/auth/registrations/${schoolId}/approve`, {
      method: 'POST',
    });
  },
  
  // Reject school registration (manufacturer only)
  rejectRegistration: async (schoolId, reason) => {
    return apiRequest(`/auth/registrations/${schoolId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
  
  // Login with email and password
  login: async (email, password, rememberMe = false, portalId = null) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, rememberMe, portalId }),
    });
  },
  
  // Refresh access token
  refreshToken: async (refreshToken) => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },
  
  // Logout
  logout: async (refreshToken) => {
    return apiRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },
  
  // Forgot password
  forgotPassword: async (email) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  
  // Reset password
  resetPassword: async (token, newPassword) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },
  
  // Change password
  changePassword: async (currentPassword, newPassword) => {
    return apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
  
  // Check if password change required
  checkRequirePasswordChange: async () => {
    return apiRequest('/auth/require-password-change', {
      method: 'GET',
    });
  },
  
  // Verify token
  verifyToken: async () => {
    return apiRequest('/auth/verify', {
      method: 'GET',
    });
  },
  
  // Get user profile
  getProfile: async () => {
    return apiRequest('/auth/profile', {
      method: 'GET',
    });
  },
};

// Portal API
export const portalAPI = {
  // Validate portal exists
  validatePortal: async (portalId) => {
    // Mock for now - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ exists: true, name: `${portalId} Secondary School` });
      }, 500);
    });
  },
};

// Students API
export const studentsAPI = {
  // Get all students
  getAll: async (filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    return apiRequest(`/students?${queryString}`, {
      method: 'GET',
    });
  },
  
  // Get student by ID
  getById: async (id) => {
    return apiRequest(`/students/${id}`, {
      method: 'GET',
    });
  },
  
  // Create student
  create: async (studentData) => {
    return apiRequest('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },
  
  // Update student
  update: async (id, studentData) => {
    return apiRequest(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  },
  
  // Delete student
  delete: async (id) => {
    return apiRequest(`/students/${id}`, {
      method: 'DELETE',
    });
  },
};

// Results API
export const resultsAPI = {
  // Get pending approvals
  getPendingApprovals: async () => {
    return apiRequest('/results/pending', {
      method: 'GET',
    });
  },
  
  // Submit results
  submit: async (resultData) => {
    return apiRequest('/results/submit', {
      method: 'POST',
      body: JSON.stringify(resultData),
    });
  },
  
  // Approve results
  approve: async (resultId) => {
    return apiRequest(`/results/${resultId}/approve`, {
      method: 'POST',
    });
  },
  
  // Reject results
  reject: async (resultId, reason) => {
    return apiRequest(`/results/${resultId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
};

export default {
  auth: authAPI,
  portal: portalAPI,
  students: studentsAPI,
  results: resultsAPI,
};
