const { ObjectId } = require('mongodb');
const { getDb } = require('../../db');

async function updateListing(id, changes) {
  const db = getDb();
  const res = await db.collection('listings').updateOne(
    { _id: new ObjectId(id) },
    { $set: changes }
  );
  return res;
}

module.exports = updateListing;