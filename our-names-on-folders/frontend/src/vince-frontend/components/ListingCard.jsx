import { useState, useEffect } from "react";

const API_URL = "http://localhost:3001";

function ListingCard({ listing, onClick, onViewReviews }) {
  const [rating, setRating] = useState(null);

  useEffect(() => {
    if (listing.sellerId) {
      fetch(`${API_URL}/users/${listing.sellerId}/ratings-and-reviews`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.rating) {
            setRating(data.rating);
          }
        })
        .catch((err) => console.error("Failed to fetch card rating", err));
    }
  }, [listing.sellerId]);

  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid #3a4255",
        borderRadius: "8px",
        padding: "12px",
        cursor: "pointer",
        width: "240px",
        backgroundColor: "#111823",
        color: "#f0f0f0",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {listing.skins && listing.skins[0] && (
        <img
          src={listing.skins[0].icon}
          alt={listing.skins[0].name}
          style={{
            width: "100%",
            height: "140px",
            objectFit: "contain",
            backgroundColor: "#111823",
            borderRadius: "6px",
            marginBottom: "8px",
          }}
        />
      )}
      <h3 style={{ margin: "0 0 6px 0", fontSize: "17px" }}>{listing.title}</h3>
      <p style={{ margin: "0 0 4px 0", color: "#9aa3b5", fontSize: "0.9em" }}>
        {listing.game}
      </p>
      <p style={{ margin: "0 0 8px 0", color: "#ff4655", fontWeight: "bold" }}>
        ${listing.price} - {listing.type === "rent" ? "Rent" : "Sell"}
      </p>

      <div style={{ marginTop: "auto" }}>
        {listing.skins && listing.skins.length > 1 && (
          <p
            style={{
              fontSize: "0.8em",
              color: "#9aa3b5",
              marginBottom: "12px",
            }}
          >
            +{listing.skins.length - 1} more skins
          </p>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "12px",
            borderTop: "1px solid #3a4255",
            marginTop: "8px",
          }}
        >
          <span style={{ fontSize: "0.85em", color: "#f0f0f0" }}>
            {rating && rating.count > 0
              ? `⭐ ${rating.average} (${rating.count})`
              : "⭐ New Seller"}
          </span>

          {onViewReviews && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewReviews(listing.sellerId);
              }}
              style={{
                fontSize: "0.8em",
                backgroundColor: "transparent",
                border: "1px solid #9aa3b5",
                color: "#9aa3b5",
                borderRadius: "4px",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              Reviews
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListingCard;
