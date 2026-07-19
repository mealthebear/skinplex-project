const { getDb } = require('../../db');

async function fetchListings(filters = {}) {
  const db = getDb();
  let query = {};
  if (filters.game) query.game = filters.game;
  if (filters.type) query.type = filters.type;

  const results = await db.collection('listings').find(query).toArray();
  return results;
}

module.exports = fetchListings;