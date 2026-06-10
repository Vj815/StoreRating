import React from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom'; // Added Outlet here
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.layoutContainer}>
      {/* 1. Global Fixed Navigation Bar */}
      <nav style={styles.navBar}>
        <h3 style={{ margin: 0 }}>Store Rating Metric Platform</h3>
        {user && (
          <div style={styles.controlCluster}>
            {/* Dynamic Dashboard Home Redirect Link depending on role */}
            <Link 
              to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'store_owner' ? '/owner/dashboard' : '/user/dashboard'} 
              style={styles.navLink}
            >
              🏠 Home
            </Link>

            {/* Your clear Update Password Link */}
            <Link to="/update-password" style={styles.navLink}>
              🔒 Update Password
            </Link>

            <span style={{ fontSize: '14px' }}>
              Welcome, <strong>{user.name}</strong> <small style={{ color: '#94a3b8' }}>({user.role.toUpperCase()})</small>
            </span>
            
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* 2. DYNAMIC WORKSPACE VIEWPORT */}
      <main style={styles.mainContentArea}>
        <Outlet /> {/* CRITICAL: Your dashboards and update password forms mount right here! */}
      </main>
    </div>
  );
};

// Polished internal styles to keep everything clean and separated
// const styles = {
//   layoutContainer: { display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif', background: '#f8fafc' },
//   navBar: { display: 'flex', justifyContent: 'space-between', padding: '15px 30px', backgroundColor: '#343a40', color: 'white', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
//   controlCluster: { display: 'flex', alignItems: 'center', gap: '20px' },
//   navLink: { color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '600' },
//   logoutBtn: { padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' },
//   mainContentArea: { padding: '40px 30px', flex: 1, boxSizing: 'border-box' }
// };
const styles = {
  // 1. Lock the outer layout container to exactly the height of the screen
  layoutContainer: { 
    display: 'flex', 
    flexDirection: 'column', 
    height: '100vh',        // Takes exactly 100% of viewport height
    fontFamily: 'sans-serif', 
    background: '#f8fafc',
    overflow: 'hidden'       // Prevents the main window scrollbar from appearing
  },

  // 2. The Navbar sits naturally at the top, taking only the space it needs
  navBar: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '15px 30px', 
    backgroundColor: '#343a40', 
    color: 'white', 
    alignItems: 'center', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    flexShrink: 0            // Prevents the navbar from compressing if content grows
  },

  controlCluster: { display: 'flex', alignItems: 'center', gap: '20px' },
  navLink: { color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '600' },
  logoutBtn: { padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' },

  // 3. The workspace container takes up all remaining vertical space and handles its own scrollbar
  mainContentArea: { 
    padding: '40px 30px', 
    flex: 1,                 // Fills the remaining screen height dynamically
    overflowY: 'auto',       // Shows a local scrollbar ONLY when content overflows
    boxSizing: 'border-box' 
  }
};
export default Navbar;