const { ObjectId } = require('mongodb');
const { getDb } = require('../../db');

async function fetchListingById(id) {
  const db = getDb();
  const found = await db.collection('listings').findOne({ _id: new ObjectId(id) });
  return found;
}

module.exports = fetchListingById;