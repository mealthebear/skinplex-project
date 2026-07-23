import { useState, useEffect, useCallback } from "react";
import ReviewsComponent from "../components/ReviewsComponent";

const API_URL = "http://localhost:3001";

function RatingsAndReviews({ targetUserId, currentUserId, listingId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(() => {
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
  }, [targetUserId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading)
    return (
      <p style={{ textAlign: "center", color: "#94a3b8" }}>
        Loading feedback...
      </p>
    );
  if (!data)
    return (
      <p style={{ textAlign: "center", color: "#94a3b8" }}>
        Failed to load user data.
      </p>
    );

  const isOwnProfile = currentUserId === targetUserId;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ color: "#f0f0f0" }}>Community Feedback</h2>
      <p style={{ color: "#94a3b8", marginBottom: "24px" }}>
        See what others are saying about this seller.
      </p>

      <div
        style={{
          padding: "24px",
          border: "1px solid #3a4255",
          borderRadius: "8px",
          marginBottom: "24px",
          backgroundColor: "#111823",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#94a3b8",
            fontSize: "1rem",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Seller Rating
        </h3>
        <p
          style={{
            fontSize: "3em",
            fontWeight: "bold",
            color: "#ff4655",
            margin: "12px 0",
          }}
        >
          {data.rating.average}{" "}
          <span style={{ fontSize: "0.4em", color: "#f0f0f0" }}>/ 5</span>
        </p>
        <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.95rem" }}>
          Based on {data.rating.count} reviews
        </p>
      </div>

      <ReviewsComponent
        userId={targetUserId}
        reviews={data.reviews}
        canReview={!isOwnProfile}
        reviewerId={currentUserId}
        listingId={listingId}
        onReviewAdded={fetchStats}
      />
    </div>
  );
}

export default RatingsAndReviews;
