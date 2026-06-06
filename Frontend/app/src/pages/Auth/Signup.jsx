import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', address: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  // Enforces structural criteria constraint rules on the client view
  const validateForm = () => {
    const localErrors = {};
    if (formData.name.length < 20 || formData.name.length > 60) {
      localErrors.name = 'Name must be between 20 and 60 characters long.';
    }
    if (formData.address.length > 400) {
      localErrors.address = 'Address cannot cross over 400 characters.';
    }
    if (formData.password.length < 8 || formData.password.length > 16) {
      localErrors.password = 'Password structural length must map 8-16 characters.';
    }
    if (!/[A-Z]/.test(formData.password)) {
      localErrors.password = 'Password requires at least one uppercase letter.';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      localErrors.password = 'Password requires at least one special character punctuation symbol.';
    }
    setErrors(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validateForm()) return;

    try {
      await API.post('/auth/signup', formData);
      alert('Registration successful! Redirecting to credentials gateway...');
      navigate('/login');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Error executing transactional request registry pipeline.');
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Consumer Account Registration</h2>
      {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Full Name ({formData.name.length}/60 - Min 20)</label>
          <input type="text" name="name" style={{ width: '100%', padding: '8px', marginTop: '5px' }} value={formData.name} onChange={handleChange} required />
          {errors.name && <small style={{ color: 'red' }}>{errors.name}</small>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Email Address</label>
          <input type="email" name="email" style={{ width: '100%', padding: '8px', marginTop: '5px' }} value={formData.email} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Home Physical Address ({formData.address.length}/400)</label>
          <textarea name="address" style={{ width: '100%', padding: '8px', marginTop: '5px' }} value={formData.address} onChange={handleChange} required />
          {errors.address && <small style={{ color: 'red' }}>{errors.address}</small>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password (8-16 chars, 1 Upper, 1 Special)</label>
          <input type="password" name="password" style={{ width: '100%', padding: '8px', marginTop: '5px' }} value={formData.password} onChange={handleChange} required />
          {errors.password && <small style={{ color: 'red' }}>{errors.password}</small>}
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Register</button>
      </form>
      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Signup;