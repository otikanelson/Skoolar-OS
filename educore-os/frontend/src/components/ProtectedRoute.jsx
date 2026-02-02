import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserRole, isTokenExpired, DEMO_MODE } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  
  console.log('🛡️ ProtectedRoute check:', {
    path: location.pathname,
    isAuthenticated: isAuthenticated(),
    isTokenExpired: isTokenExpired(),
    userRole: getUserRole(),
    allowedRoles,
    demoMode: DEMO_MODE
  });
  
  // Check if user is authenticated
  if (!isAuthenticated()) {
    console.log('❌ Not authenticated, redirecting to login');
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if token is expired
  if (isTokenExpired()) {
    console.log('❌ Token expired, redirecting to login');
    // Clear expired token and redirect to login
    localStorage.clear();
    return <Navigate to="/login" state={{ from: location, expired: true }} replace />;
  }
  
  // Check if user has required role
  if (allowedRoles.length > 0) {
    const userRole = getUserRole();
    if (!allowedRoles.includes(userRole)) {
      console.log('❌ Insufficient permissions, redirecting to unauthorized');
      // Redirect to unauthorized page or appropriate dashboard
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  console.log('✅ Access granted');
  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;
