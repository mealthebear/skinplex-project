import { useState, useEffect, useRef } from 'react';
import ListingCard from '../../vince-frontend/components/ListingCard';
 
const API_URL = 'http://localhost:3001';
 
function Home({ userId, onListingClick, onSearch, onViewReviews }) {
  const [searchText, setSearchText] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [recommended, setRecommended] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchRef = useRef(null);
 
  useEffect(() => {
    if (!userId) return;
    fetch(API_URL + '/search-history/' + userId)
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(() => {});
  }, [userId]);
 
  useEffect(() => {
    if (!userId) {
      fetch(API_URL + '/listings')
        .then(res => res.json())
        .then(data => {
          setRecent(data.slice(0, 12));
          setLoading(false);
        })
        .catch(() => setLoading(false));
      return;
    }
 
    fetch(API_URL + '/recommended/' + userId)
      .then(res => res.json())
      .then(data => {
        setRecommended(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
 
    fetch(API_URL + '/listings')
      .then(res => res.json())
      .then(data => setRecent(data.slice(0, 12)))
      .catch(() => {});
  }, [userId]);
 
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowHistory(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
 
  function handleSubmit(e) {
    e.preventDefault();
    if (searchText.trim() && onSearch) {
      onSearch(searchText.trim());
    }
  }
 
  function handleHistoryClick(query) {
    setSearchText(query);
    setShowHistory(false);
    if (onSearch) onSearch(query);
  }
 
  const filteredHistory = searchText
    ? history.filter(h => h.query.toLowerCase().includes(searchText.toLowerCase()))
    : history;
 
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h1>Skinplex</h1>
        <p>Buy, sell, and rent Valorant skins and accounts</p>
 
        <div ref={searchRef} style={{ position: 'relative', maxWidth: '500px', margin: '20px auto' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
            <input
              type="text"
              placeholder="Search for skins, accounts..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onFocus={() => setShowHistory(true)}
              style={{ flex: 1, padding: '10px 14px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '6px 0 0 6px' }}
            />
            <button
              type="submit"
              style={{ padding: '10px 20px', fontSize: '16px', border: '1px solid #ccc', borderLeft: 'none', borderRadius: '0 6px 6px 0', cursor: 'pointer' }}
            >
              Search
            </button>
          </form>
 
          {showHistory && filteredHistory.length > 0 && (
            <ul style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#fff',
              border: '1px solid #ccc',
              borderTop: 'none',
              borderRadius: '0 0 6px 6px',
              listStyle: 'none',
              padding: 0,
              margin: 0,
              zIndex: 10,
              maxHeight: '250px',
              overflowY: 'auto'
            }}>
              {filteredHistory.map(item => (
                <li
                  key={item._id}
                  onClick={() => handleHistoryClick(item.query)}
                  style={{ padding: '8px 14px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}
                  onMouseEnter={e => e.target.style.background = '#f5f5f5'}
                  onMouseLeave={e => e.target.style.background = '#fff'}
                >
                  {item.query}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
 
      {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
 
      {recommended.length > 0 && (
        <div style={{ padding: '0 20px', marginBottom: '32px' }}>
          <h2>Recommended for You</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {recommended.map(listing => (
              <ListingCard
                key={listing._id}
                listing={listing}
                onClick={() => onListingClick && onListingClick(listing._id)}
              />
            ))}
          </div>
        </div>
      )}
 
      {recent.length > 0 && (
        <div style={{ padding: '0 20px' }}>
          <h2>Recent Listings</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {recent.map(listing => (
              <ListingCard
                key={listing._id}
                listing={listing}
                onClick={() => onListingClick && onListingClick(listing._id)}
                onViewReviews={onViewReviews}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
 
export default Home;