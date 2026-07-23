import { useState, useEffect } from 'react';
import SkinSelector from '../components/SkinSelector';

const API_URL = 'http://localhost:3001';

function Listing({ listingId, sellerId, mode, userId }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('sell');
  const [description, setDescription] = useState('');
  const [skins, setSkins] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [listing, setListingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    if (mode === 'view') {
      fetch(API_URL + '/listings/' + listingId)
        .then(res => res.json())
        .then(data => {
          setListingData(data);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [mode, listingId]);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    fetch(API_URL + '/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title,
        game: 'Valorant',
        price: Number(price),
        type: type,
        sellerId: sellerId,
        description: description,
        skins: skins
      })
    })
      .then(res => res.json())
      .then(data => {
        alert('Listing created!');
        setTitle('');
        setPrice('');
        setDescription('');
        setSkins([]);
        setSubmitting(false);
      })
      .catch(err => {
        console.log(err);
        alert('something went wrong');
        setSubmitting(false);
      });
  }

  if (mode === 'create') {
    return (
      <div style={{
        maxWidth: '1140px',
        margin: '0 auto',
        padding: '24px',
        textAlign: 'left',
        backgroundColor: '#111823',
        color: '#f0f0f0',
        borderRadius: '12px'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '8px' }}>Create New Listing</h2>
        <p style={{ color: '#9aa3b5', marginBottom: '24px' }}>
          Add your Valorant account skins and set a price.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
              Title
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="ex: Full Reaver Collection Account"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #3a4255',
                backgroundColor: '#111823',
                color: '#fff',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
                Price ($)
              </label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
                placeholder="0"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #3a4255',
                  backgroundColor: '#111823',
                  color: '#fff',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
                Listing Type
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #3a4255',
                  backgroundColor: '#111823',
                  color: '#fff'
                }}
              >
                <option value="sell">Sell</option>
                <option value="rent">Rent</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              placeholder="Tell buyers whats on this account..."
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #3a4255',
                backgroundColor: '#111823',
                color: '#fff',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>

          <h3 style={{ marginBottom: '8px' }}>
            Select Skins on This Account
            <span style={{ color: '#9aa3b5', fontWeight: 'normal', fontSize: '14px' }}>
              {' '}({skins.length} selected)
            </span>
          </h3>
          <div style={{
            backgroundColor: '#111823',
            border: '1px solid #3a4255',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px'
          }}>
            <SkinSelector selectedSkins={skins} onChange={setSkins} />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '12px 28px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: submitting ? '#555' : '#ff4655',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: submitting ? 'not-allowed' : 'pointer'
            }}
          >
            {submitting ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <p style={{ color: '#9aa3b5', textAlign: 'left' }}>Loading listing...</p>
    );
  }

  if (!listing) {
    return (
      <p style={{ color: '#9aa3b5', textAlign: 'left' }}>Listing not found.</p>
    );
  }

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '24px',
      textAlign: 'left',
      backgroundColor: '#111823',
      color: '#f0f0f0',
      borderRadius: '12px'
    }}>
      <div style={{
        backgroundColor: '#111823',
        border: '1px solid #3a4255',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '8px' }}>{listing.title}</h2>
        <p style={{ color: '#9aa3b5', marginBottom: '8px' }}>{listing.game}</p>
        <p style={{ color: '#ff4655', fontWeight: 'bold', fontSize: '20px', marginBottom: '12px' }}>
          ${listing.price} - {listing.type === 'rent' ? 'Rent' : 'Sell'}
        </p>

        {listing.status === 'sold' || listing.status === 'rented' || purchased ? (
          <p style={{
            color: '#9aa3b5',
            fontWeight: 'bold',
            fontSize: '16px',
            marginBottom: '12px',
            padding: '10px 20px',
            backgroundColor: '#1a2332',
            borderRadius: '6px',
            display: 'inline-block'
          }}>
            {listing.type === 'rent' ? '✓ Rented' : '✓ Sold'}
          </p>
        ) : (
          <button
            onClick={() => {
              if (!userId) {
                alert('You must be logged in to ' + (listing.type === 'rent' ? 'rent' : 'buy'));
                return;
              }
              setPurchasing(true);
              fetch(API_URL + '/listings/' + listingId + '/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ buyerId: userId })
              })
                .then(res => res.json())
                .then(data => {
                  if (data.error) {
                    alert(data.error);
                  } else {
                    setPurchased(true);
                    alert(listing.type === 'rent' ? 'Successfully rented!' : 'Successfully purchased!');
                  }
                  setPurchasing(false);
                })
                .catch(() => {
                  alert('Something went wrong');
                  setPurchasing(false);
                });
            }}
            disabled={purchasing}
            style={{
              padding: '12px 28px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: purchasing ? '#555' : '#ff4655',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: purchasing ? 'not-allowed' : 'pointer',
              marginBottom: '12px'
            }}
          >
            {purchasing ? 'Processing...' : (listing.type === 'rent' ? 'Rent Now' : 'Buy Now')}
          </button>
        )}
        <p style={{ color: '#c8ceda', marginBottom: 0 }}>
          {listing.description || 'No description.'}
        </p>
      </div>

      <h3 style={{ marginBottom: '12px' }}>
        Skins Included{' '}
        <span style={{ color: '#9aa3b5', fontWeight: 'normal', fontSize: '14px' }}>
          ({listing.skins ? listing.skins.length : 0})
        </span>
      </h3>

      {(!listing.skins || listing.skins.length === 0) && (
        <p style={{ color: '#9aa3b5' }}>No skins listed.</p>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {listing.skins && listing.skins.map(skin => (
          <div
            key={skin.uuid}
            style={{
              width: '190px',
              textAlign: 'center',
              backgroundColor: '#111823',
              border: '1px solid #3a4255',
              borderRadius: '8px',
              padding: '10px'
            }}
          >
            <img
              src={skin.icon}
              alt={skin.name}
              style={{ width: '170px', height: '170px', objectFit: 'contain' }}
            />
            <p style={{ marginTop: '8px', marginBottom: 0, fontSize: '16px' }}>{skin.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Listing;