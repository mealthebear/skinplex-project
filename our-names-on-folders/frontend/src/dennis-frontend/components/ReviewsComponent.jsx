import { useState } from "react";

const API_URL = "http://localhost:3001";

function ReviewsComponent({
  userId,
  initialReviews,
  canReview,
  onReviewAdded,
  reviewerId,
}) {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Review submitted!");
        setComment("");
        setStars(5);
        setSubmitting(false);
        if (onReviewAdded) onReviewAdded();
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong");
        setSubmitting(false);
      });
  }

  return (
    <div
      style={{ padding: "16px", border: "1px solid #ccc", borderRadius: "8px" }}
    >
      <h3>Reviews</h3>

      {reviews.length == 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div style={{ marginBottom: "24px" }}>
          {reviews.map((review, idx) => (
            <div
              key={idx}
              style={{
                borderBottom: "1px solid #eee",
                paddingBottom: "8px",
                marginBottom: "8px",
              }}
            >
              <strong>{review.stars} / 5 Stars</strong>
              <p style={{ margin: "4px 0" }}>{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {canReview && (
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <h4>Leave a Review</h4>
          <label>
            Stars:
            <select
              value={stars}
              onChange={(e) => setStars(e.target.value)}
              style={{ marginLeft: "8px" }}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review here..."
            required
            rows="3"
            style={{ width: "100%" }}
          />
          <button
            type="submit"
            disabled={submitting}
            style={{ alignSelf: "flex-start" }}
          >
            {submitting ? "Submitting..." : "Post Review"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ReviewsComponent;
