import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListingCard from "../../vince-frontend/components/ListingCard";

const API_URL = "http://localhost:3001";

function HomeFeed() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(API_URL + "/listings")
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching listings:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading the storefront...</p>;

  return (
    <div>
      <h2>Global Skin Market</h2>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        Browse all available Valorant skins for rent or sale.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {listings.length === 0 && (
          <p>No skins listed yet. Be the first to create one!</p>
        )}

        {listings.map((listing) => (
          <ListingCard
            key={listing._id}
            listing={listing}
            onClick={() => navigate(`/listing/${listing._id}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default HomeFeed;
