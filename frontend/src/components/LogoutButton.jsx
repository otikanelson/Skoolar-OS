import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

const LogoutButton = ({ className = '' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Confirm logout
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={className || 'text-sm text-gray-600 hover:text-gray-900'}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
