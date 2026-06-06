import { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import StarRating from '../../components/StarRating';
import API from '../../services/api';

const AdminDashboard = () => {
  // Global Telemetry Counts State
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sorting Control Configurations
  const [userSort, setUserSort] = useState({ key: 'name', direction: 'ASC' });
  const [storeSort, setStoreSort] = useState({ key: 'name', direction: 'ASC' });

  // Creation Input Form States
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'user', address: '' });
  const [storeForm, setStoreForm] = useState({ name: '', address: '' });
  const [formErrors, setFormErrors] = useState({});

  // Core Data Synchronization Pipeline
  const refreshAdminData = useCallback(async () => {
    try {
      const [statsRes, usersRes, storesRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users'),
        API.get('/admin/stores')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setStores(storesRes.data);
    } catch (err) {
      setError('Failed to extract master administration dataset streams.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAdminData();
  }, [refreshAdminData]);

  // Form Rules Constraint Checking
  const validateUserForm = () => {
    const localErrors = {};
    if (userForm.name.length < 20 || userForm.name.length > 60) {
      localErrors.userName = 'Name must be between 20 and 60 characters long.';
    }
    if (userForm.address.length > 400) {
      localErrors.userAddress = 'Address cannot cross over 400 characters.';
    }
    if (userForm.password.length < 8 || userForm.password.length > 16) {
      localErrors.userPassword = 'Password structural length must map 8-16 characters.';
    }
    if (!/[A-Z]/.test(userForm.password)) {
      localErrors.userPassword = 'Password requires at least one uppercase letter.';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(userForm.password)) {
      localErrors.userPassword = 'Password requires a special punctuation symbol.';
    }
    setFormErrors(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  // Create User Action Handlers
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!validateUserForm()) return;
    try {
      await API.post('/admin/users', userForm);
      alert('User record successfully committed to system node registry.');
      setUserForm({ name: '', email: '', password: '', role: 'user', address: '' });
      setFormErrors({});
      refreshAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing transactional asset registration.');
    }
  };

  // Create Store Action Handlers
  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/stores', storeForm);
      alert('Storefront metadata profile successfully registered.');
      setStoreForm({ name: '', address: '' });
      refreshAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating storefront entity.');
    }
  };

  // Clean Generic Client Sorter Engine
  const sortData = (dataArray, config) => {
    const sorted = [...dataArray];
    sorted.sort((a, b) => {
      let valA = a[config.key] ?? '';
      let valB = b[config.key] ?? '';
      
      if (typeof valA === 'string') {
        return config.direction === 'ASC' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return config.direction === 'ASC' ? valA - valB : valB - valA;
    });
    return sorted;
  };

  const handleUserSort = (key) => {
    setUserSort((prev) => ({ key, direction: prev.key === key && prev.direction === 'ASC' ? 'DESC' : 'ASC' }));
  };

  const handleStoreSort = (key) => {
    setStoreSort((prev) => ({ key, direction: prev.key === key && prev.direction === 'ASC' ? 'DESC' : 'ASC' }));
  };

  if (loading) return <div style={{ padding: '30px' }}>Mapping global database ecosystem layers...</div>;

  return (
    <div>
      <Navbar />
      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        <h2>System Administration Command Center</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* 1. Statistics Summary Row Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ padding: '20px', backgroundColor: '#007bff', color: 'white', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 5px 0', opacity: 0.8 }}>Total Managed Users</h4>
            <span style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.users}</span>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#28a745', color: 'white', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 5px 0', opacity: 0.8 }}>Registered Storefronts</h4>
            <span style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.stores}</span>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#17a2b8', color: 'white', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 5px 0', opacity: 0.8 }}>Total System Ratings Collected</h4>
            <span style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.ratings}</span>
          </div>
        </div>

        {/* 2. Side-by-Side Asset Entity Entry Forms Box */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px', marginBottom: '5px' }}>
          {/* Form A: Add User */}
          <div style={{ padding: '20px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
            <h3>Provision New Multi-Role User Profile</h3>
            <form onSubmit={handleUserSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label>Full Name ({userForm.name.length}/60 - Min 20)</label>
                <input type="text" style={{ width: '100%', padding: '8px', marginTop: '4px' }} value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} required />
                {formErrors.userName && <small style={{ color: 'red' }}>{formErrors.userName}</small>}
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label>Email Connection String</label>
                <input type="email" style={{ width: '100%', padding: '8px', marginTop: '4px' }} value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label>Password Policy Parameters</label>
                <input type="password" style={{ width: '100%', padding: '8px', marginTop: '4px' }} value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} required />
                {formErrors.userPassword && <small style={{ color: 'red' }}>{formErrors.userPassword}</small>}
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label>Application Access Authority Role Level</label>
                <select style={{ width: '100%', padding: '8px', marginTop: '4px' }} value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                  <option value="user">Normal Consumer Profile (User)</option>
                  <option value="store_owner">Merchant Business Owner</option>
                  <option value="admin">System Level Root Administrator</option>
                </select>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label>Physical Core Home Address ({userForm.address.length}/400)</label>
                <textarea style={{ width: '100%', padding: '8px', marginTop: '4px' }} value={userForm.address} onChange={(e) => setUserForm({ ...userForm, address: e.target.value })} required />
                {formErrors.userAddress && <small style={{ color: 'red' }}>{formErrors.userAddress}</small>}
              </div>
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Generate Active User</button>
            </form>
          </div>

          {/* Form B: Add Store */}
          <div style={{ padding: '20px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#f8f9fa', height: 'fit-content' }}>
            <h3>Register Corporate Storefront Profile</h3>
            <form onSubmit={handleStoreSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label>Business Trade Name</label>
                <input type="text" style={{ width: '100%', padding: '8px', marginTop: '4px' }} value={storeForm.name} onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })} required />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label>Physical Operational Destination Address</label>
                <textarea style={{ width: '100%', padding: '8px', marginTop: '4px', height: '108px' }} value={storeForm.address} onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })} required />
              </div>
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Publish Business Entity</button>
            </form>
          </div>
        </div>

        {/* 3. Global Dynamic Sorted Management Tables */}
        <div style={{ marginTop: '50px' }}>
          <h3>Master Users Account Register</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
            <thead>
              <tr style={{ backgroundColor: '#343a40', color: 'white', textAlign: 'left' }}>
                <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleUserSort('name')}>Account Name {userSort.key === 'name' ? (userSort.direction === 'ASC' ? '🔼' : '🔽') : ''}</th>
                <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleUserSort('email')}>Email Channel {userSort.key === 'email' ? (userSort.direction === 'ASC' ? '🔼' : '🔽') : ''}</th>
                <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleUserSort('role')}>System Role {userSort.key === 'role' ? (userSort.direction === 'ASC' ? '🔼' : '🔽') : ''}</th>
                <th style={{ padding: '10px' }}>Physical Home Base Address</th>
              </tr>
            </thead>
            <tbody>
              {sortData(users, userSort).map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '10px', fontWeight: '500' }}>{u.name}</td>
                  <td style={{ padding: '10px', color: '#007bff' }}>{u.email}</td>
                  <td style={{ padding: '10px' }}><span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '12px', backgroundColor: u.role === 'admin' ? '#f8d7da' : u.role === 'store_owner' ? '#d1ecf1' : '#e2e3e5', color: u.role === 'admin' ? '#721c24' : u.role === 'store_owner' ? '#0c5460' : '#383d41' }}>{u.role.toUpperCase()}</span></td>
                  <td style={{ padding: '10px', color: '#6c757d', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.address}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Master Storefronts Operational Profiles</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#343a40', color: 'white', textAlign: 'left' }}>
                <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleStoreSort('name')}>Business Entity Name {storeSort.key === 'name' ? (storeSort.direction === 'ASC' ? '🔼' : '🔽') : ''}</th>
                <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleStoreSort('address')}>Physical Domain Location {storeSort.key === 'address' ? (storeSort.direction === 'ASC' ? '🔼' : '🔽') : ''}</th>
                <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleStoreSort('overallRating')}>Aggregated Running Evaluation {storeSort.key === 'overallRating' ? (storeSort.direction === 'ASC' ? '🔼' : '🔽') : ''}</th>
              </tr>
            </thead>
            <tbody>
              {sortData(stores, storeSort).map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '10px', fontWeight: '500' }}>{s.name}</td>
                  <td style={{ padding: '10px', color: '#6c757d' }}>{s.address}</td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <StarRating rating={Math.round(s.overallRating || 0)} readOnly={true} />
                      <strong>({parseFloat(s.overallRating || 0).toFixed(1)})</strong>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;