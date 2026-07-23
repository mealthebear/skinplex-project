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

        <button style={btn} onClick={() => setPage("create")}>
          Create Listing
        </button>
        <button style={btn} onClick={() => setPage("profile")}>
          My Profile
        </button>
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
