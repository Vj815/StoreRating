import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Authentication Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

// Role-Based Dashboards
import AdminDashboard from './pages/Admin/AdminDashboard';
import OwnerDashboard from './pages/Owner/OwnerDashboard';
import UserDashboard from './pages/User/UserDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Gateway Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 1. Admin Protected Group */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* 2. Store Owner Protected Group */}
          <Route element={<ProtectedRoute allowedRoles={['store_owner']} />}>
            <Route path="/owner" element={<OwnerDashboard />} />
          </Route>

          {/* 3. Normal Consumer Protected Group */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/dashboard" element={<UserDashboard />} />
          </Route>

          {/* Fallback Redirection for Unauthorized Routes */}
          <Route path="/unauthorized" element={
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
              <h2>403 - Access Denied</h2>
              <p>Your user profile does not have permission keys to access this node domain area.</p>
              <button onClick={() => window.location.href = '/login'} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                Return to Login Gateway
              </button>
            </div>
          } />

          {/* Catch-all Fallback Routine */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;