const { ObjectId } = require('mongodb');
const { getDb } = require('../../db');

async function fetchListingById(id) {
  const db = getDb();
  const listing = await db.collection('listings').findOne({ _id: new ObjectId(id) });
  return listing;
}

module.exports = fetchListingById;