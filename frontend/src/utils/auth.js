// Authentication utility functions

export const AUTH_TOKEN_KEY = 'skoolar_auth_token';
export const REFRESH_TOKEN_KEY = 'skoolar_refresh_token';
export const USER_DATA_KEY = 'skoolar_user_data';

// Store authentication data
export const setAuthToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const setRefreshToken = (token) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const setUserData = (userData) => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

// Retrieve authentication data
export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
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
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

// Login function
export const login = (accessToken, refreshToken, userData) => {
  setAuthToken(accessToken);
  setRefreshToken(refreshToken);
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
  
  try {
    // Decode JWT token (basic decode, not verification)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    
    // Consider token expired if it expires in less than 1 minute
    // This gives us time to refresh before it actually expires
    return now >= (expirationTime - 60000);
  } catch (error) {
    // If token can't be decoded, consider it expired
    return true;
  }
};

// Check if refresh token is expired
export const isRefreshTokenExpired = () => {
  const token = getRefreshToken();
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    return Date.now() >= expirationTime;
  } catch (error) {
    return true;
  }
};

// Verify token with backend
export const verifyToken = async () => {
  const token = getAuthToken();
  if (!token) return false;
  
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
