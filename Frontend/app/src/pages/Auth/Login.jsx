import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await API.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      login(user, token);

      // Fixed: Routes to the precise sub-paths defined in App.jsx
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'store_owner') navigate('/owner/dashboard');
      else navigate('/user/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password connection.');
    }
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.title}>Unified Portal Login</h2>
      {error && <p style={styles.errorAlert}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <input type="email" style={styles.inputField} value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input type="password" style={styles.inputField} value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" style={styles.submitBtn}>Sign In</button>
      </form>
      <p style={styles.footerText}>
        New consumer? <Link to="/signup" style={styles.link}>Create an account here</Link>
      </p>
    </div>
  );
};

const styles = {
  formContainer: { maxWidth: '400px', margin: '100px auto', padding: '30px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontFamily: 'sans-serif' },
  title: { margin: '0 0 20px 0', textAlign: 'center', color: '#0f172a', fontWeight: '700' },
  errorAlert: { color: '#ef4444', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', padding: '10px', borderRadius: '6px', fontSize: '14px', textAlign: 'center' },
  inputGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#475569' },
  inputField: { width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  submitBtn: { width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  footerText: { marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#64748b' },
  link: { color: '#2563eb', fontWeight: '600', textDecoration: 'none' }
};

export default Login;