import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// View Components Imports
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import UpdatePassword from './pages/Auth/UpdatePassword';
import AdminDashboard from './pages/Admin/AdminDashboard';
import OwnerDashboard from './pages/Owner/OwnerDashboard';
import UserDashboard from './pages/User/UserDashboard';

// Guard & Layout Wrappers
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ================= PUBLIC GATEWAY ROUTES ================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ================= PROTECTED CORE APPLICATION FRAME ================= */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'store_owner', 'user']} />}>
            <Route element={<Navbar />}>
              
              {/* Global shared route inside the Navbar shell */}
              <Route path="/update-password" element={<UpdatePassword />} />

              {/* 1. Admin Restricted Group */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>

              {/* 2. Store Owner Restricted Group */}
              <Route element={<ProtectedRoute allowedRoles={['store_owner']} />}>
                <Route path="/owner/dashboard" element={<OwnerDashboard />} />
              </Route>

              {/* 3. Normal Consumer Restricted Group */}
              <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                <Route path="/user/dashboard" element={<UserDashboard />} />
              </Route>

            </Route>
          </Route>

          {/* ================= FALLBACK ERROR & CATCH-ALL ROUTING ================= */}
          <Route path="/unauthorized" element={
            <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
              <h2 style={{ color: '#dc3545' }}>403 - Access Denied</h2>
              <p style={{ color: '#64748b' }}>Your profile permissions don't allow you to access this workspace section.</p>
              <button 
                onClick={() => window.location.href = '/login'} 
                style={{ padding: '10px 20px', backgroundColor: '#343a40', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}
              >
                Return to Login Gateway
              </button>
            </div>
          } />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;