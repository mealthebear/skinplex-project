import { useState, useEffect } from "react";
import RatingsComponent from "../components/RatingsComponent";
import ReviewsComponent from "../components/ReviewsComponent";

const API_URL = "http://localhost:3001";

function RatingsAndReviews({ targetUserId, currentUserId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    setLoading(true);
    fetch(`${API_URL}/users/${targetUserId}/ratings-and-reviews`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStats();
  }, [targetUserId]);

  if (loading) return <p>Loading feedback...</p>;
  if (!data) return <p>Failed to load user data.</p>;

  const isOwnProfile = currentUserId == targetUserId;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>Community Feedback</h2>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        See what others are saying about this seller.
      </p>

      <RatingsComponent
        userId={targetUserId}
        initialRating={data.rating}
        canRate={!isOwnProfile}
        onRatingAdded={fetchStats}
      />

      <ReviewsComponent
        userId={targetUserId}
        initialReviews={data.reviews}
        canReview={!isOwnProfile}
        reviewerId={currentUserId}
        onReviewAdded={fetchStats}
      />
    </div>
  );
}

export default RatingsAndReviews;
