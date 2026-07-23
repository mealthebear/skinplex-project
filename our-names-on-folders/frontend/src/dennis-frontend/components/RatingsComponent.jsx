import { useState } from "react";

const API_URL = "http://localhost:3001";

function RatingsComponent({ userId, initialRating, canRate, onRatingAdded }) {
  const [rating, setRating] = useState(
    initialRating || { average: 0, count: 0 },
  );
  const [newStars, setNewStars] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  function handleRate() {
    setSubmitting(true);
    fetch(`${API_URL}/users/${userId}/rating`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stars: Number(newStars) }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Rating submitted!");
        setSubmitting(false);
        if (onRatingAdded) onRatingAdded(); // Refresh data
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong");
        setSubmitting(false);
      });
  }

  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginBottom: "16px",
      }}
    >
      <h3>User Rating</h3>
      <p style={{ fontSize: "1.2em", fontWeight: "bold" }}>
        {rating.average} / 5{" "}
        <span
          style={{ fontSize: "0.8em", fontWeight: "normal", color: "#666" }}
        >
          ({rating.count} ratings)
        </span>
      </p>

      {canRate && (
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <label>
            Rate User:
            <select
              value={newStars}
              onChange={(e) => setNewStars(e.target.value)}
              style={{ marginLeft: "8px" }}
            >
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </label>
          <button onClick={handleRate} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      )}
    </div>
  );
}

export default RatingsComponent;
