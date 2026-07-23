import { useState } from "react";
import Listing from "./vince-frontend/pages/Listing";
import UserProfile from "./vince-frontend/pages/UserProfile";
import AuthPage from "./dennis-frontend/pages/AuthPage";
import Home from "./brandon-frontend/pages/Home";
import SearchResults from "./brandon-frontend/pages/SearchResults";
import SearchHistory from "./brandon-frontend/pages/SearchHistory";
import RecommendedResults from "./brandon-frontend/components/RecommendedResults";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [viewId, setViewId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  if (!user) {
    return <AuthPage onAuthSuccess={(userData) => setUser(userData)} />;
  }

  const currentUserId = user._id || user.id;

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage("search");
  };

  const handleViewListing = (id) => {
    setViewId(id);
    setPage("view");
  };

  return (
    <div className="App">
      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <strong>Welcome, {user.username}!</strong>
          <button
            onClick={() => setUser(null)}
            style={{ marginLeft: "15px", color: "red" }}
          >
            Logout
          </button>
        </div>

        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("create")}>Create Listing</button>
        <button onClick={() => setPage("profile")}>My Profile</button>
        <button onClick={() => setPage("history")}>Search History</button>
        <button onClick={() => setPage("view")}>
          View Listing (enter id below)
        </button>
        <br />
        <br />
        <input
          placeholder="listing id to view"
          value={viewId}
          onChange={(e) => setViewId(e.target.value)}
        />
      </div>

      {page === "home" && (
        <Home
          userId={currentUserId}
          onListingClick={handleViewListing}
          onSearch={handleSearch}
        />
      )}

      {page === "search" && (
        <SearchResults
          query={searchQuery}
          userId={currentUserId}
          onListingClick={handleViewListing}
        />
      )}

      {page === "history" && (
        <SearchHistory userId={currentUserId} onSearchClick={handleSearch} />
      )}

      {page === "create" && <Listing mode="create" sellerId={currentUserId} />}

      {page === "profile" && (
        <UserProfile
          userId={currentUserId}
          viewerId={currentUserId}
          onListingClick={handleViewListing}
        />
      )}

      {page === "view" && viewId && (
        <div>
          <Listing mode="view" listingId={viewId} />

          <hr style={{ margin: "40px 0" }} />

          <RecommendedResults
            listingId={viewId}
            onListingClick={handleViewListing}
          />
        </div>
      )}
    </div>
  );
}

export default App;
