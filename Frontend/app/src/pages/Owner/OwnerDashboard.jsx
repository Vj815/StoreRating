import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import StarRating from '../../components/StarRating';
import API from '../../services/api';

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Table sort configuration matching requirement: "All tables should support sorting"
  const [sortConfig, setSortConfig] = useState({ key: 'ratedAt', direction: 'DESC' });

  useEffect(() => {
    const fetchOwnerMetrics = async () => {
      try {
        const response = await API.get('/owner/dashboard');
        setDashboardData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to sync storefront metrics pipeline.');
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerMetrics();
  }, []);

  // Sorting handler for client-side feedback evaluation history matrix
  const handleSort = (key) => {
    let direction = 'ASC';
    if (sortConfig.key === key && sortConfig.direction === 'ASC') {
      direction = 'DESC';
    }
    setSortConfig({ key, direction });
  };

  const getSortedReviews = () => {
    if (!dashboardData || !dashboardData.reviews) return [];
    const sorted = [...dashboardData.reviews];
    
    sorted.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      // Convert to string comparisons clean handling
      if (typeof valA === 'string') {
        return sortConfig.direction === 'ASC' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      
      // Numbers or timestamps evaluation 
      return sortConfig.direction === 'ASC' ? valA - valB : valB - valA;
    });
    return sorted;
  };

  if (loading) return <div>Synchronizing telemetry configurations...</div>;

  return (
    <div>
      {/* <Navbar /> */}
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        {error ? (
          <div style={{ padding: '20px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
            {error}
          </div>
        ) : dashboardData ? (
          <>
            {/* Header Performance Metrics Sheet block */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e9ecef', padding: '25px', borderRadius: '8px', marginBottom: '30px' }}>
              <div>
                <h1 style={{ margin: '0 0 10px 0' }}>{dashboardData.store.name}</h1>
                <p style={{ margin: 0, color: '#495057' }}><strong>Location:</strong> {dashboardData.store.address}</p>
              </div>
              <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '15px 25px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#6c757d', textTransform: 'uppercase', fontSize: '12px' }}>Average Rating Score</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                  <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#212529' }}>
                    {dashboardData.store.averageRating}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <StarRating rating={Math.round(parseFloat(dashboardData.store.averageRating))} readOnly={true} />
                    <small style={{ color: '#6c757d' }}>Based on {dashboardData.totalRatingsCount} total reviews</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Consumer Submission Matrix Table */}
            <h3>Customer Feedback History</h3>
            {dashboardData.reviews.length === 0 ? (
              <p style={{ color: '#6c757d', fontStyle: 'italic' }}>No consumers have posted structural ratings to this storefront profile yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#343a40', color: 'white', textAlign: 'left' }}>
                    <th style={{ padding: '12px', cursor: 'pointer' }} onClick={() => handleSort('userName')}>
                      Customer Name {sortConfig.key === 'userName' ? (sortConfig.direction === 'ASC' ? '🔼' : '🔽') : ''}
                    </th>
                    <th style={{ padding: '12px', cursor: 'pointer' }} onClick={() => handleSort('userEmail')}>
                      Customer Email {sortConfig.key === 'userEmail' ? (sortConfig.direction === 'ASC' ? '🔼' : '🔽') : ''}
                    </th>
                    <th style={{ padding: '12px', cursor: 'pointer' }} onClick={() => handleSort('userAddress')}>
                      Physical Address {sortConfig.key === 'userAddress' ? (sortConfig.direction === 'ASC' ? '🔼' : '🔽') : ''}
                    </th>
                    <th style={{ padding: '12px', cursor: 'pointer' }} onClick={() => handleSort('rating')}>
                      Rating Given {sortConfig.key === 'rating' ? (sortConfig.direction === 'ASC' ? '🔼' : '🔽') : ''}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedReviews().map((review, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #dee2e6', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
                      <td style={{ padding: '12px', fontWeight: '500' }}>{review.userName}</td>
                      <td style={{ padding: '12px', color: '#007bff' }}>{review.userEmail}</td>
                      <td style={{ padding: '12px', color: '#6c757d', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {review.userAddress}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <StarRating rating={review.rating} readOnly={true} />
                          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>({review.rating})</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        ) : (
          <p>No telemetry data stream maps matching current system node context found.</p>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;