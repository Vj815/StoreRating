import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

const UpdatePassword = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const localErrors = {};

    // Password criteria check
    const passwordIssues = [];
    if (formData.newPassword.length < 8 || formData.newPassword.length > 16) {
      passwordIssues.push('8-16 characters');
    }
    if (!/[A-Z]/.test(formData.newPassword)) {
      passwordIssues.push('1 uppercase letter');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)) {
      passwordIssues.push('1 special character');
    }

    if (passwordIssues.length > 0) {
      localErrors.newPassword = `Requires: ${passwordIssues.join(', ')}.`;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      localErrors.confirmPassword = 'Confirmation entries do not match.';
    }

    setErrors(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setErrors({});

    if (!validateForm()) return;

    try {
      setLoading(true);
      // Calls your Express backend router path
      const response = await API.patch('/auth/update-password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });

      setStatus({ 
        type: 'success', 
        message: response.data?.message || 'Credentials updated successfully!' 
      });
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || err.response?.data?.error || 'Failed to update credentials.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.cardContainer}>
      <div style={styles.headerArea}>
        <h2 style={styles.cardTitle}>🔒 Security Gateway</h2>
        <span style={styles.roleLabel}>{user?.role?.toUpperCase()}</span>
      </div>
      <p style={styles.cardSubtitle}>
        Hello <strong>{user?.name}</strong>, modify your login access keys below.
      </p>

      {status.message && (
        <div style={status.type === 'success' ? styles.successAlert : styles.errorAlert}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.inputLabel}>Current Password</label>
          <input
            type="password"
            name="oldPassword"
            style={styles.inputFields}
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.inputLabel}>New Password</label>
          <input
            type="password"
            name="newPassword"
            style={styles.inputFields}
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          {errors.newPassword && <small style={styles.fieldError}>{errors.newPassword}</small>}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.inputLabel}>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            style={styles.inputFields}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <small style={styles.fieldError}>{errors.confirmPassword}</small>}
        </div>

        <button type="submit" disabled={loading} style={styles.actionButton}>
          {loading ? 'Processing Update...' : 'Commit Password Modification'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  cardContainer: { maxWidth: '420px', margin: '30px auto', padding: '30px', background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', fontFamily: 'sans-serif' },
  headerArea: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
  cardTitle: { margin: 0, fontSize: '20px', fontWeight: '700', color: '#0f172a' },
  roleLabel: { fontSize: '10px', background: '#e2e8f0', padding: '4px 8px', borderRadius: '4px', fontWeight: '700', color: '#475569' },
  cardSubtitle: { margin: '0 0 24px 0', fontSize: '14px', color: '#64748b' },
  formGroup: { marginBottom: '16px' },
  inputLabel: { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569' },
  inputFields: { width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  fieldError: { display: 'block', color: '#ef4444', marginTop: '4px', fontSize: '12px', fontWeight: '500' },
  actionButton: { width: '100%', padding: '12px', backgroundColor: '#343a40', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginTop: '8px' },
  errorAlert: { color: '#ef4444', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', padding: '12px', borderRadius: '6px', fontSize: '14px', marginBottom: '20px', textAlign: 'center' },
  successAlert: { color: '#16a34a', backgroundColor: '#f0fdf4', border: '1px solid #dcfce7', padding: '12px', borderRadius: '6px', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }
};

export default UpdatePassword;