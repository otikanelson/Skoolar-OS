// Authentication utility functions

// DEMO MODE - Set to true to bypass backend for presentations
export const DEMO_MODE = true; // Change to false to use real backend

// Demo users for presentation
export const DEMO_USERS = {
  'admin@fieldgreen.edu': {
    email: 'admin@fieldgreen.edu',
    name: 'Admin User',
    role: 'admin',
    token: 'demo-token-admin-123'
  },
  'teacher@fieldgreen.edu': {
    email: 'teacher@fieldgreen.edu',
    name: 'John Teacher',
    role: 'teacher',
    token: 'demo-token-teacher-123'
  },
  'parent@fieldgreen.edu': {
    email: 'parent@fieldgreen.edu',
    name: 'Jane Parent',
    role: 'parent',
    token: 'demo-token-parent-123'
  },
  'student@fieldgreen.edu': {
    email: 'student@fieldgreen.edu',
    name: 'Student User',
    role: 'student',
    token: 'demo-token-student-123'
  }
};

// Demo login function
export const demoLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = DEMO_USERS[email.toLowerCase()];
      
      if (!user) {
        reject(new Error('Invalid email or password'));
        return;
      }
      
      // Accept any password in demo mode
      if (password) {
        resolve({
          access_token: user.token,
          user: {
            email: user.email,
            name: user.name,
            role: user.role
          }
        });
      } else {
        reject(new Error('Password required'));
      }
    }, 500); // Simulate network delay
  });
};

export const AUTH_TOKEN_KEY = 'educore_auth_token';
export const USER_DATA_KEY = 'educore_user_data';

// Store authentication data
export const setAuthToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const setUserData = (userData) => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

// Retrieve authentication data
export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const getUserData = () => {
  const data = localStorage.getItem(USER_DATA_KEY);
  return data ? JSON.parse(data) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  const userData = getUserData();
  return !!(token && userData);
};

// Get user role
export const getUserRole = () => {
  const userData = getUserData();
  return userData?.role || null;
};

// Clear authentication data (logout)
export const clearAuth = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

// Login function
export const login = (token, userData) => {
  setAuthToken(token);
  setUserData(userData);
};

// Logout function
export const logout = () => {
  clearAuth();
  window.location.href = '/login';
};

// Check if token is expired (basic check)
export const isTokenExpired = () => {
  const token = getAuthToken();
  if (!token) return true;
  
  // Demo mode tokens don't expire
  if (DEMO_MODE && token.startsWith('demo-token-')) {
    return false;
  }
  
  try {
    // Decode JWT token (basic decode, not verification)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch (error) {
    // If token can't be decoded, consider it expired
    return true;
  }
};

// Verify token with backend
export const verifyToken = async () => {
  const token = getAuthToken();
  if (!token) return false;
  
  // Demo mode tokens are always valid
  if (DEMO_MODE && token.startsWith('demo-token-')) {
    return true;
  }
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
};

// Check if user has required role
export const hasRole = (requiredRole) => {
  const userRole = getUserRole();
  if (!userRole) return false;
  
  // Role hierarchy
  const roleHierarchy = {
    'admin': ['admin', 'teacher', 'hod', 'parent', 'student'],
    'hod': ['hod', 'teacher'],
    'teacher': ['teacher'],
    'parent': ['parent'],
    'student': ['student'],
  };
  
  return roleHierarchy[userRole]?.includes(requiredRole) || false;
};
