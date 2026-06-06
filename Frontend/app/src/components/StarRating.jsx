import { useState } from 'react';

const StarRating = ({ rating, onChange, readOnly = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'inline-block' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        return (
          <button
            type="button"
            key={star}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              cursor: readOnly ? 'default' : 'pointer',
              fontSize: '24px',
              color: star <= (hover || rating) ? '#ffc107' : '#e4e5e9',
              padding: '0 2px'
            }}
            onClick={() => !readOnly && onChange && onChange(star)}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(0)}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;