import { useState } from 'react';
import Listing from './vince-frontend/pages/Listing';
import UserProfile from './vince-frontend/pages/UserProfile';

function App() {
  const testUserId = '6a5d6fa00a233fa181007a67';
  const [page, setPage] = useState('create');
  const [viewId, setViewId] = useState('');

  return (
    <div className="App">
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setPage('create')}>Create Listing</button>
        <button onClick={() => setPage('profile')}>My Profile</button>
        <button onClick={() => setPage('view')}>View Listing (enter id below)</button>
        <br />
        <input
          placeholder="listing id to view"
          value={viewId}
          onChange={e => setViewId(e.target.value)}
        />
      </div>

      {page == 'create' && <Listing mode="create" sellerId={testUserId} />}
      {page == 'profile' && (
        <UserProfile
          userId={testUserId}
          viewerId={testUserId}
          onListingClick={(id) => { setViewId(id); setPage('view'); }}
        />
      )}
      {page == 'view' && viewId && <Listing mode="view" listingId={viewId} />}
    </div>
  );
}

export default App;