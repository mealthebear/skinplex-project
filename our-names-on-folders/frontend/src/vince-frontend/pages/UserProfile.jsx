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

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div>
      <h2>{user.username}</h2>
      <p>{user.bio || "No bio yet."}</p>

      <UserProfileOptions
        userId={userId}
        currentBio={user.bio}
        isOwnProfile={isOwnProfile}
        onUpdated={handleBioUpdated}
      />

      <div style={{ margin: "20px 0" }}>
        <p>
          <strong>Rating:</strong> {user.rating ? user.rating.average : 0} / 5 (
          {user.rating ? user.rating.count : 0} reviews)
        </p>

        <span
          style={{
            color: "#007bff",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={() => alert("Reviews page not yet implemented in App.js!")}
        >
          View or Add Reviews &rarr;
        </span>
      </div>

      <h3>Listings</h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        {listings.length === 0 && <p>No active listings.</p>}
        {listings.map((listing) => (
          <ListingCard
            key={listing._id}
            listing={listing}
            onClick={() => onListingClick(listing._id)}
          />
        ))}
      </div>

      <h3>Recent Reviews</h3>
      {(!user.reviews || user.reviews.length === 0) && <p>No reviews yet.</p>}

      {user.reviews &&
        user.reviews.slice(0, 3).map((review, i) => (
          <div
            key={i}
            style={{ borderTop: "1px solid #eee", padding: "8px 0" }}
          >
            <p>
              <strong>{review.stars}/5 stars</strong>
            </p>
            <p>{review.comment}</p>
          </div>
        ))}
    </div>
  );
}

export default UserProfile;
