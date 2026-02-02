import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  isAuthenticated, 
  getUserData, 
  getUserRole, 
  login as authLogin, 
  logout as authLogout,
  DEMO_MODE,
  demoLogin 
} from '../utils/auth';

/**
 * Custom hook for authentication
 * Provides auth state and methods
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated on mount
    if (isAuthenticated()) {
      setUser(getUserData());
    }
    setIsLoading(false);
  }, []);
  
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      
      let response;
      
      // Use demo mode if enabled
      if (DEMO_MODE) {
        response = await demoLogin(email, password);
      } else {
        // Call real API
        const { authAPI } = await import('../services/api');
        response = await authAPI.login(email, password);
      }
      
      // Store auth data
      authLogin(response.access_token, response.user);
      setUser(response.user);
      
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    authLogout();
    setUser(null);
    navigate('/login');
  };
  
  const hasRole = (role) => {
    return getUserRole() === role;
  };
  
  return {
    user,
    isAuthenticated: isAuthenticated(),
    isLoading,
    login,
    logout,
    hasRole,
    role: getUserRole(),
  };
};
