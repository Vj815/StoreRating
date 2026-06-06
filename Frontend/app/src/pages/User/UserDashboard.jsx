import { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import StarRating from '../../components/StarRating';
import API from '../../services/api';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [error, setError] = useState('');

  // Fetch data cleanly from our Express user-store listing endpoint
  const fetchStores = useCallback(async () => {
    try {
      const response = await API.get('/user/stores', {
        params: {
          name: searchName,
          address: searchAddress,
          sortBy,
          order
        }
      });
      setStores(response.data);
    } catch (err) {
      setError('Could not download store listings data stream.');
    }
  }, [searchName, searchAddress, sortBy, order]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // Handles updating or creating store ratings dynamically
  const handleRatingSubmit = async (storeId, newRating, existingRating) => {
    try {
      if (existingRating !== null) {
        // If they already have a rating record, override it with PUT
        await API.put(`/user/stores/${storeId}/rating`, { rating: newRating });
      } else {
        // First-time rating submission uses POST
        await API.post(`/user/stores/${storeId}/rating`, { rating: newRating });
      }
      fetchStores(); // Refresh metrics UI state instantly
    } catch (err) {
      alert(err.response?.data?.message || 'Error executing transactional rating.');
    }
  };

  const toggleOrder = () => {
    setOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2>Registered Business Stores Catalog</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Search Modifiers & Filter Box Controls */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search by Store Name..."
            style={{ padding: '8px', minWidth: '250px' }}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by Address Location..."
            style={{ padding: '8px', minWidth: '250px' }}
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />

          {/* Sort Controls */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label>Sort By:</label>
            <select style={{ padding: '8px' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Store Name</option>
              <option value="address">Physical Location Address</option>
            </select>
            <button onClick={toggleOrder} style={{ padding: '8px 12px', cursor: 'pointer' }}>
              {order === 'ASC' ? '🔼 Ascending' : '🔽 Descending'}
            </button>
          </div>
        </div>

        {/* Data Grid Presenter */}
        {stores.length === 0 ? (
          <p>No stores matched your search filter criteria.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px' }}>Store Name</th>
                <th style={{ padding: '12px' }}>Physical Address</th>
                <th style={{ padding: '12px' }}>Community Average Rating</th>
                <th style={{ padding: '12px' }}>Your Rating Assignment Status</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{store.name}</td>
                  <td style={{ padding: '12px', color: '#6c757d' }}>{store.address}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StarRating rating={Math.round(store.overallRating)} readOnly={true} />
                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                        ({parseFloat(store.overallRating).toFixed(1)})
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <StarRating
                        rating={store.userSubmittedRating || 0}
                        onChange={(newStarValue) => 
                          handleRatingSubmit(store.id, newStarValue, store.userSubmittedRating)
                        }
                      />
                      <small style={{ color: store.userSubmittedRating ? '#28a745' : '#6c757d' }}>
                        {store.userSubmittedRating 
                          ? `You rated this: ${store.userSubmittedRating}★ (Click to modify)` 
                          : 'Not evaluated yet'}
                      </small>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;