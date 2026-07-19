const { ObjectId } = require('mongodb');
const { getDb } = require('../../db');

async function deleteListing(id) {
  const db = getDb();
  const result = await db.collection('listings').deleteOne({ _id: new ObjectId(id) });
  return result;
}

module.exports = deleteListing;