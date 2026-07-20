import { useState, useEffect } from 'react';
import SkinSelector from '../components/SkinSelector';

const API_URL = 'http://localhost:3001';

function Listing({ listingId, sellerId, mode }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('sell');
  const [description, setDescription] = useState('');
  const [skins, setSkins] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [listing, setListingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mode == 'view') {
      fetch(API_URL + '/listings/' + listingId)
        .then(res => res.json())
        .then(data => {
          setListingData(data);
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

  if (mode == 'create') {
    return (
      <form onSubmit={handleSubmit}>
        <h2>Create New Listing</h2>

        <label>
          Title
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </label>

        <label>
          Price ($)
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} required />
        </label>

        <label>
          Listing Type
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="sell">Sell</option>
            <option value="rent">Rent</option>
          </select>
        </label>

        <label>
          Description
          <textarea value={description} onChange={e => setDescription(e.target.value)} />
        </label>

        <h3>Select Skins on This Account</h3>
        <SkinSelector selectedSkins={skins} onChange={setSkins} />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    );
  }

  if (loading) return <p>Loading listing...</p>;
  if (!listing) return <p>Listing not found.</p>;

  return (
    <div>
      <h2>{listing.title}</h2>
      <p>{listing.game}</p>
      <p>${listing.price} - {listing.type == 'rent' ? 'Rent' : 'Sell'}</p>
      <p>{listing.description}</p>

      <h3>Skins Included</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {listing.skins && listing.skins.map(skin => (
          <div key={skin.uuid} style={{ textAlign: 'center' }}>
            <img src={skin.icon} alt={skin.name} width="80" />
            <p>{skin.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Listing;