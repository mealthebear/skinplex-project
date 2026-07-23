import { useState, useEffect } from "react";
import ListingCard from "../components/ListingCard";
import UserProfileOptions from "../components/UserProfileOptions";

const API_URL = "http://localhost:3001";

function UserProfile({ userId, viewerId, onListingClick }) {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = viewerId === userId;

  useEffect(() => {
    setLoading(true);
    fetch(API_URL + "/users/" + userId)
      .then((res) => res.json())
      .then((userData) => {
        setUser(userData);
        return fetch(API_URL + "/listings?sellerId=" + userId);
      })
      .then((res) => res.json())
      .then((listingsData) => {
        setListings(listingsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        setLoading(false);
      });
  }, [userId]);

  function handleBioUpdated(newBio) {
    setUser({ ...user, bio: newBio });
  }

  if (loading) {
    return (
      <p style={{ color: "#9aa3b5", textAlign: "left" }}>Loading profile...</p>
    );
  }

  if (!user) {
    return (
      <p style={{ color: "#9aa3b5", textAlign: "left" }}>User not found.</p>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1240px",
        margin: "0 auto",
        padding: "24px",
        textAlign: "left",
        backgroundColor: "#111823",
        color: "#f0f0f0",
        borderRadius: "12px",
      }}
    >
      <div
        style={{
          backgroundColor: "#111823",
          border: "1px solid #3a4255",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "8px" }}>{user.username}</h2>
        <p style={{ color: "#9aa3b5", marginBottom: "16px" }}>
          {user.bio || "No bio yet."}
        </p>

        <UserProfileOptions
          userId={userId}
          currentBio={user.bio}
          isOwnProfile={isOwnProfile}
          onUpdated={handleBioUpdated}
        />

        <div style={{ marginTop: "20px" }}>
          <p style={{ marginBottom: "8px" }}>
            <strong>Rating:</strong>{" "}
            <span style={{ color: "#ff4655" }}>
              {user.rating ? user.rating.average : 0} / 5
            </span>{" "}
            <span style={{ color: "#9aa3b5" }}>
              ({user.rating ? user.rating.count : 0} reviews)
            </span>
          </p>

          <span
            style={{
              color: "#ff4655",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => alert("Reviews page not yet implemented in App.js!")}
          >
            View or Add Reviews &rarr;
          </span>
        </div>
      </div>

      <h3 style={{ marginBottom: "12px" }}>
        Listings{" "}
        <span style={{ color: "#9aa3b5", fontWeight: "normal", fontSize: "14px" }}>
          ({listings.length})
        </span>
      </h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {listings.length === 0 && (
          <p style={{ color: "#9aa3b5" }}>No active listings.</p>
        )}
        {listings.map((listing) => (
          <ListingCard
            key={listing._id}
            listing={listing}
            onClick={() => onListingClick(listing._id)}
          />
        ))}
      </div>

      <h3 style={{ marginBottom: "12px" }}>Recent Reviews</h3>
      {(!user.reviews || user.reviews.length === 0) && (
        <p style={{ color: "#9aa3b5" }}>No reviews yet.</p>
      )}

      {user.reviews &&
        user.reviews.slice(0, 3).map((review, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#111823",
              border: "1px solid #3a4255",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "10px",
            }}
          >
            <p style={{ margin: "0 0 6px 0", color: "#ff4655" }}>
              <strong>{review.stars}/5 stars</strong>
            </p>
            <p style={{ margin: 0, color: "#c8ceda" }}>{review.comment}</p>
          </div>
        ))}
    </div>
  );
}

export default UserProfile;
