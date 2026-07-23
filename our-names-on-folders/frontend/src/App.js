import { useState } from "react";
import Listing from "./vince-frontend/pages/Listing";
import UserProfile from "./vince-frontend/pages/UserProfile";
import AuthPage from "./dennis-frontend/pages/AuthPage";

function App() {
  const [user, setUser] = useState(null);

  const [page, setPage] = useState("create");
  const [viewId, setViewId] = useState("");

  if (!user) {
    return <AuthPage onAuthSuccess={(userData) => setUser(userData)} />;
  }

  const currentUserId = user._id || user.id;

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

        <button onClick={() => setPage("create")}>Create Listing</button>
        <button onClick={() => setPage("profile")}>My Profile</button>
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

      {page === "create" && <Listing mode="create" sellerId={currentUserId} />}

      {page === "profile" && (
        <UserProfile
          userId={currentUserId}
          viewerId={currentUserId}
          onListingClick={(id) => {
            setViewId(id);
            setPage("view");
          }}
        />
      )}

      {page === "view" && viewId && <Listing mode="view" listingId={viewId} />}
    </div>
  );
}

export default App;
