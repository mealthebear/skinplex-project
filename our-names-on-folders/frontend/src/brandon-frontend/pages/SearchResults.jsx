import { useState, useEffect } from 'react';
import ListingCard from '../../vince-frontend/components/ListingCard';
 
const API_URL = 'http://localhost:3001';
 
function SearchResults({ query, userId, onListingClick, onViewReviews }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gameFilter, setGameFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
 
  useEffect(() => {
    if (!query) return;
    setLoading(true);
 
    const params = new URLSearchParams();
    params.set('q', query);
    if (gameFilter) params.set('game', gameFilter);
    if (typeFilter) params.set('type', typeFilter);
 
    fetch(API_URL + '/search?' + params.toString())
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
 
    if (userId) {
      fetch(API_URL + '/search-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, query })
      }).catch(() => {});
    }
  }, [query, gameFilter, typeFilter, userId]);
 
  return (
    <div>
      <h2>Search Results for "{query}"</h2>
 
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <select value={gameFilter} onChange={e => setGameFilter(e.target.value)}>
          <option value="">All Games</option>
          <option value="Valorant">Valorant</option>
          <option value="CS2">CS2</option>
        </select>
 
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">Buy or Rent</option>
          <option value="sell">Buy</option>
          <option value="rent">Rent</option>
        </select>
      </div>
 
      {loading && <p>Searching...</p>}
 
      {!loading && results.length === 0 && (
        <p>No results found for "{query}".</p>
      )}
 
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {results.map(listing => (
          <ListingCard
            key={listing._id}
            listing={listing}
            onClick={() => onListingClick && onListingClick(listing._id)}
            onViewReviews={onViewReviews}
          />
        ))}
      </div>
    </div>
  );
}
 
export default SearchResults;