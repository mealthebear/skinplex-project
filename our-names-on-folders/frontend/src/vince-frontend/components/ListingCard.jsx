function ListingCard({ listing, onClick }) {
  return (
    <div onClick={onClick} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '12px', cursor: 'pointer', width: '220px' }}>
      {listing.skins && listing.skins[0] &&
        <img src={listing.skins[0].icon} alt={listing.skins[0].name} style={{ width: '100%', height: 'auto' }} />
      }
      <h3>{listing.title}</h3>
      <p>{listing.game}</p>
      <p>${listing.price} - {listing.type == 'rent' ? 'Rent' : 'Sell'}</p>
      {listing.skins && listing.skins.length > 1 &&
        <p style={{ fontSize: '0.8em', color: '#666' }}>+{listing.skins.length - 1} more</p>
      }
    </div>
  );
}

export default ListingCard;