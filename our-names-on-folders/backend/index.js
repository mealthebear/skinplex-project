require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDb } = require('./db');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Listing routes
const fetchUser = require('./vince-backend/user/fetchUser');
const updateUser = require('./vince-backend/user/updateUser');
const storeListing = require('./vince-backend/listings/storeListing');
const fetchListings = require('./vince-backend/listings/fetchListings');
const fetchListingById = require('./vince-backend/listings/fetchListingById');
const updateListing = require('./vince-backend/listings/updateListing');
const deleteListing = require('./vince-backend/listings/deleteListing');
const addToSearchHistory = require('./brandon-backend/searchHistory/addToSearchHistory');
const fetchSearchHistory = require('./brandon-backend/searchHistory/fetchSearchHistory');
const fetchSimilarItems = require('./brandon-backend/recommendation/fetchSimilarItems');
const purchaseListing = require('./brandon-backend/purchase/purchaseListing');
const handleGoogleAuth = require('./dennis-backend/auth/googleAuth');
const addReview = require('./dennis-backend/ratingsAndReviews/addReview');
const fetchRatingsAndReviews = require('./dennis-backend/ratingsAndReviews/fetchRatingsAndReviews');

app.get('/users/:id', async (req, res) => {
  try {
    const user = await fetchUser(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching user');
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    await updateUser(req.params.id, req.body);
    res.send('User updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating user');
  }
});

app.post('/listings', async (req, res) => {
  try {
    const listing = await storeListing(req.body);
    res.status(201).json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating listing');
  }
});

app.get('/listings', async (req, res) => {
  try {
    const listings = await fetchListings(req.query);
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching listings');
  }
});

app.get('/listings/:id', async (req, res) => {
  try {
    const listing = await fetchListingById(req.params.id);
    if (!listing) return res.status(404).send('Listing not found');
    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching listing');
  }
});

app.put('/listings/:id', async (req, res) => {
  try {
    await updateListing(req.params.id, req.body);
    res.send('Listing updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating listing');
  }
});

app.delete('/listings/:id', async (req, res) => {
  try {
    await deleteListing(req.params.id);
    res.send('Listing deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting listing');
  }
});

async function startServer() {
  await connectToDb();
  app.listen(port, () => {
    console.log(`Server is running and listening on http://localhost:${port}`);
  });
}

// --- Search (keyword search across listings) ---
app.get('/search', async (req, res) => {
  try {
    const db = require('./db').getDb();
    const query = {};
 
    // Keyword search: match against title, description, and skin names
    if (req.query.q) {
      const regex = new RegExp(req.query.q, 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { 'skins.name': regex }
      ];
    }
 
    if (req.query.game) query.game = req.query.game;
    if (req.query.type) query.type = req.query.type;
 
    const results = await db.collection('listings').find(query).toArray();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error searching listings');
  }
});
 
// Search History
app.post('/search-history', async (req, res) => {
  try {
    const { userId, query } = req.body;
    const entry = await addToSearchHistory(userId, query);
    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving search history');
  }
});
 
app.get('/search-history/:userId', async (req, res) => {
  try {
    const history = await fetchSearchHistory(req.params.userId);
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching search history');
  }
});
 
// Similar Items
app.get('/listings/:id/similar', async (req, res) => {
  try {
    const similar = await fetchSimilarItems(req.params.id);
    res.json(similar);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching similar items');
  }
});
 
// Recommended Listings for Home Page
app.get('/recommended/:userId', async (req, res) => {
  try {
    const db = require('./db').getDb();
    const history = await fetchSearchHistory(req.params.userId, 5);
 
    if (history.length === 0) {
      // return newest listings if no search history
      const recent = await db.collection('listings')
        .find({})
        .sort({ createdAt: -1 })
        .limit(8)
        .toArray();
      return res.json(recent);
    }
 
    // Build a regex from the user's recent search terms
    const terms = history.map(h => h.query);
    const regex = new RegExp(terms.join('|'), 'i');
 
    const recommended = await db.collection('listings')
      .find({
        $or: [
          { title: regex },
          { description: regex },
          { 'skins.name': regex }
        ]
      })
      .limit(12)
      .toArray();
 
    res.json(recommended);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching recommendations');
  }
});

app.post('/listings/:id/purchase', async (req, res) => {
  try {
    const { buyerId } = req.body;
    if (!buyerId) return res.status(400).send('Buyer ID is required');
    const result = await purchaseListing(req.params.id, buyerId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/google', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: 'Google ID Token is required' });
  }

  try {
    const user = await handleGoogleAuth(idToken);
    res.json({ message: 'Authentication successful', user: user });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

app.get('/users/:id/ratings-and-reviews', async (req, res) => {
  try {
    const data = await fetchRatingsAndReviews(req.params.id);
    if (!data) return res.status(404).send('User not found');
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching ratings and reviews');
  }
});

app.post('/users/:id/reviews', async (req, res) => {
  try {
    const result = await addReview(req.params.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding review');
  }
});

startServer();