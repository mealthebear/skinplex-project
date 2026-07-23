import { useState, useEffect } from 'react';
 
const API_URL = 'http://localhost:3001';
 
function SearchHistory({ userId, onSearchClick }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
 
    fetch(API_URL + '/search-history/' + userId)
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);
 
  if (loading) return <p>Loading search history...</p>;
 
  return (
    <div>
      <h2>Recent Searches</h2>
      {history.length === 0 && <p>No recent searches.</p>}
 
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {history.map(item => (
          <li
            key={item._id}
            onClick={() => onSearchClick && onSearchClick(item.query)}
            style={{
              padding: '10px 16px',
              borderBottom: '1px solid #eee',
              cursor: 'pointer'
            }}
          >
            <span>{item.query}</span>
            <span style={{ float: 'right', color: '#999', fontSize: '0.85em' }}>
              {new Date(item.timestamp).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
 
export default SearchHistory;
 