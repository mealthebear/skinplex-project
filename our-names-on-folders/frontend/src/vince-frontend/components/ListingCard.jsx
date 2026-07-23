function ListingCard({ listing, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: '1px solid #3a4255',
        borderRadius: '8px',
        padding: '12px',
        cursor: 'pointer',
        width: '240px',
        backgroundColor: '#111823',
        color: '#f0f0f0',
        textAlign: 'left'
      }}
    >
      {listing.skins && listing.skins[0] &&
        <img
          src={listing.skins[0].icon}
          alt={listing.skins[0].name}
          style={{
            width: '100%',
            height: '140px',
            objectFit: 'contain',
            backgroundColor: '#111823',
            borderRadius: '6px'
          }}
        />
      }
      <h3 style={{ marginBottom: '6px', fontSize: '17px' }}>{listing.title}</h3>
      <p style={{ margin: '4px 0', color: '#9aa3b5' }}>{listing.game}</p>
      <p style={{ margin: '4px 0', color: '#ff4655', fontWeight: 'bold' }}>
        ${listing.price} - {listing.type === 'rent' ? 'Rent' : 'Sell'}
      </p>
      {listing.skins && listing.skins.length > 1 &&
        <p style={{ fontSize: '0.8em', color: '#9aa3b5', marginBottom: 0 }}>
          +{listing.skins.length - 1} more skins
        </p>
      }
    </div>
  );
}

export default ListingCard;
