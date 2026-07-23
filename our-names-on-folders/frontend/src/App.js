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

  const btn = {
    marginRight: "8px",
    marginBottom: "8px",
    padding: "8px 14px",
    borderRadius: "6px",
    border: "1px solid #3a4255",
    backgroundColor: "#111823",
    color: "#f0f0f0",
    cursor: "pointer",
  };

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
        <div style={{ marginBottom: "12px" }}>
          <strong>Welcome, {user.username}!</strong>
          <button
            onClick={() => setUser(null)}
            style={{
              marginLeft: "15px",
              color: "#ff4655",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        <button style={btn} onClick={() => setPage("home")}>
          Home
        </button>
        <button style={btn} onClick={() => setPage("create")}>
          Create Listing
        </button>
        <button style={btn} onClick={() => setPage("profile")}>
          My Profile
        </button>
        <button style={btn} onClick={() => setPage("history")}>
          Search History
        </button>
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
