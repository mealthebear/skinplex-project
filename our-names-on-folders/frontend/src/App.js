import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import Listing from "./vince-frontend/pages/Listing";
import UserProfile from "./vince-frontend/pages/UserProfile";
import AuthPage from "./dennis-frontend/pages/AuthPage";
import RatingsAndReviews from "./dennis-frontend/pages/RatingsAndReviews";
import HomeFeed from "./dennis-frontend/pages/HomeFeed.jsx";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  if (!currentUser) {
    return <AuthPage onAuthSuccess={setCurrentUser} />;
  }

  return (
    <Router>
      <div
        className="App"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "20px",
          fontFamily: "sans-serif",
        }}
      >
        <nav
          style={{
            display: "flex",
            gap: "20px",
            paddingBottom: "20px",
            marginBottom: "20px",
            borderBottom: "1px solid #ddd",
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#007bff",
              fontWeight: "bold",
            }}
          >
            Browse Skins
          </Link>
          <Link
            to={`/user/${currentUser._id}`}
            style={{
              textDecoration: "none",
              color: "#007bff",
              fontWeight: "bold",
            }}
          >
            My Profile
          </Link>
          <Link
            to="/create"
            style={{
              textDecoration: "none",
              color: "#007bff",
              fontWeight: "bold",
            }}
          >
            Create Listing
          </Link>
          <button
            onClick={() => setCurrentUser(null)}
            style={{
              marginLeft: "auto",
              cursor: "pointer",
              background: "transparent",
              border: "1px solid #ccc",
              padding: "4px 12px",
              borderRadius: "4px",
            }}
          >
            Log Out
          </button>
        </nav>

        <Routes>
          <Route path="/" element={<HomeFeed />} />
          <Route
            path="/"
            element={<Navigate to={`/user/${currentUser._id}`} replace />}
          />

          <Route
            path="/create"
            element={<Listing mode="create" currentUser={currentUser} />}
          />

          <Route
            path="/listing/:id"
            element={<Listing mode="view" currentUser={currentUser} />}
          />

          <Route
            path="/user/:id"
            element={<UserProfile currentUser={currentUser} />}
          />

          <Route
            path="/user/:id/reviews"
            element={<RatingsAndReviews currentUser={currentUser} />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
