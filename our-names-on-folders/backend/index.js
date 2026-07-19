require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDb } = require('./db');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Listing routes
const storeListing = require('./vince-backend/listings/storeListing');
const fetchListings = require('./vince-backend/listings/fetchListings');
const fetchListingById = require('./vince-backend/listings/fetchListingById');
const updateListing = require('./vince-backend/listings/updateListing');
const deleteListing = require('./vince-backend/listings/deleteListing');

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

startServer();