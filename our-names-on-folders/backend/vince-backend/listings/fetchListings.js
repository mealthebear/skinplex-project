const { getDb } = require('../../db');

async function fetchListings(filters) {
  const db = getDb();
  const query = {};

  if (filters) {
    if (filters.game) {
      query.game = filters.game;
    }
    if (filters.type) {
      query.type = filters.type;
    }
    if (filters.sellerId) {
      query.sellerId = filters.sellerId;
    }
  }

  const listings = await db.collection('listings').find(query).toArray();
  return listings;
}

module.exports = fetchListings;