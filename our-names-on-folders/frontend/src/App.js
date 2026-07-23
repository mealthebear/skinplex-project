import { useState } from 'react';
import Listing from './vince-frontend/pages/Listing';
import UserProfile from './vince-frontend/pages/UserProfile';
import Home from './brandon-frontend/pages/Home';
import SearchResults from './brandon-frontend/pages/SearchResults';
import RecommendedResults from './brandon-frontend/components/RecommendedResults';


function App() {
  const testUserId = '6a5d6fa00a233fa181007a67';
  const [page, setPage] = useState('home');
  const [viewId, setViewId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="App">
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setPage('home')}>Home</button>
        <button onClick={() => setPage('create')}>Create Listing</button>
        <button onClick={() => setPage('profile')}>My Profile</button>
      </div>

      {page === 'home' && (
        <Home
          userId={testUserId}
          onListingClick={(id) => { setViewId(id); setPage('view'); }}
          onSearch={(q) => { setSearchQuery(q); setPage('search'); }}
        />
      )}

      {page === 'search' && (
        <SearchResults
          query={searchQuery}
          userId={testUserId}
          onListingClick={(id) => { setViewId(id); setPage('view'); }}
        />
      )}

      {page === 'create' && <Listing mode="create" sellerId={testUserId} />}

      {page === 'profile' && (
        <UserProfile
          userId={testUserId}
          viewerId={testUserId}
          onListingClick={(id) => { setViewId(id); setPage('view'); }}
        />
      )}

      {page === 'view' && viewId && (
        <>
          <Listing mode="view" listingId={viewId} />
          <RecommendedResults
            listingId={viewId}
            onListingClick={(id) => { setViewId(id); setPage('view'); }}
          />
        </>
      )}
    </div>
  );
}

export default App;