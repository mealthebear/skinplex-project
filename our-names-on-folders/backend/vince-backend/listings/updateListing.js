const { ObjectId } = require('mongodb');
const { getDb } = require('../../db');

async function updateListing(id, updates) {
  const db = getDb();
  const result = await db.collection('listings').updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
  return result;
}

module.exports = updateListing;