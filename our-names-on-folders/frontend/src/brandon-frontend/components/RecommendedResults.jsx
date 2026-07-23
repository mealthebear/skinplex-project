import { useState, useEffect } from 'react';
import ListingCard from '../../vince-frontend/components/ListingCard';
 
const API_URL = 'http://localhost:3001';
 
function RecommendedResults({ listingId, onListingClick }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    if (!listingId) {
      setLoading(false);
      return;
    }
 
    fetch(API_URL + '/listings/' + listingId + '/similar')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [listingId]);
 
  if (loading) return <p>Loading recommendations...</p>;
  if (items.length === 0) return null;
 
  return (
    <div style={{ marginTop: '32px' }}>
      <h3>Similar Listings</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {items.map(item => (
          <ListingCard
            key={item._id}
            listing={item}
            onClick={() => onListingClick && onListingClick(item._id)}
          />
        ))}
      </div>
    </div>
  );
}
 
export default RecommendedResults;