import { useState } from "react";

const API_URL = "http://localhost:3001";

function ReviewsComponent({
  userId,
  reviews = [],
  canReview,
  onReviewAdded,
  reviewerId,
  listingId,
}) {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const inputStyle = {
    backgroundColor: "#1a2235",
    color: "#f0f0f0",
    border: "1px solid #3a4255",
    padding: "12px",
    borderRadius: "6px",
    width: "100%",
    boxSizing: "border-box",
    marginTop: "8px",
  };

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    fetch(`${API_URL}/users/${userId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stars: Number(stars),
        comment: comment,
        reviewerId: reviewerId,
        listingId: listingId,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Something went wrong");
        }
        return res.json();
      })
      .then(() => {
        alert("Review submitted!");
        setComment("");
        setStars(5);
        setSubmitting(false);
        if (onReviewAdded) onReviewAdded();
      })
      .catch((err) => {
        alert(err.message);
        setSubmitting(false);
      });
  }

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #3a4255",
        borderRadius: "8px",
        backgroundColor: "#111823",
      }}
    >
      <h3 style={{ marginTop: 0, color: "#f0f0f0" }}>Reviews</h3>

      {reviews.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No reviews yet.</p>
      ) : (
        <div style={{ marginBottom: "24px" }}>
          {reviews.map((review, idx) => (
            <div
              key={idx}
              style={{
                borderBottom: "1px solid #3a4255",
                paddingBottom: "12px",
                marginBottom: "12px",
              }}
            >
              <strong style={{ color: "#ff4655" }}>
                {review.stars} / 5 Stars
              </strong>
              <p
                style={{
                  margin: "8px 0 0",
                  color: "#f0f0f0",
                  lineHeight: "1.5",
                }}
              >
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}

      {canReview && (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          <h4 style={{ margin: 0, color: "#f0f0f0" }}>Rate & Review Seller</h4>

          <label style={{ color: "#94a3b8" }}>
            Stars:
            <select
              value={stars}
              onChange={(e) => setStars(e.target.value)}
              style={{ ...inputStyle, width: "auto", marginLeft: "12px" }}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>

          <label style={{ color: "#94a3b8", width: "100%" }}>
            Comment:
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review here..."
              required
              rows="3"
              style={inputStyle}
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            style={{
              alignSelf: "flex-start",
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#ff4655",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {submitting ? "Submitting..." : "Post Review"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ReviewsComponent;
