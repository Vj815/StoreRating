import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', backgroundColor: '#343a40', color: 'white', alignItems: 'center' }}>
      <h3 style={{ margin: 0 }}>Store Rating Metric Platform</h3>
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Welcome, <strong>{user.name}</strong> <small>({user.role.toUpperCase()})</small></span>
          <button onClick={handleLogout} style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;