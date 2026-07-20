import { useState, useEffect } from 'react';
import ListingCard from '../components/ListingCard';
import UserProfileOptions from '../components/UserProfileOptions';

const API_URL = 'http://localhost:3001';

function UserProfile({ userId, viewerId, onListingClick }) {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = viewerId == userId;

  useEffect(() => {
    fetch(API_URL + '/users/' + userId)
      .then(res => res.json())
      .then(userData => {
        setUser(userData);
        return fetch(API_URL + '/listings?sellerId=' + userId);
      })
      .then(res => res.json())
      .then(listingsData => {
        setListings(listingsData);
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
      <p>{user.bio || 'No bio yet.'}</p>

      <UserProfileOptions
        userId={userId}
        currentBio={user.bio}
        isOwnProfile={isOwnProfile}
        onUpdated={handleBioUpdated}
      />

      <p>Rating: {user.rating ? user.rating.average : 0} / 5 ({user.rating ? user.rating.count : 0} reviews)</p>

      <h3>Listings</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {listings.length == 0 && <p>No active listings.</p>}
        {listings.map(listing => (
          <ListingCard key={listing._id} listing={listing} onClick={() => onListingClick && onListingClick(listing._id)} />
        ))}
      </div>

      <h3>Reviews</h3>
      {(!user.reviews || user.reviews.length == 0) && <p>No reviews yet.</p>}
      {user.reviews && user.reviews.map((review, i) => (
        <div key={i} style={{ borderTop: '1px solid #eee', padding: '8px 0' }}>
          <p>{review.stars}/5 stars</p>
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  );
}

export default UserProfile;