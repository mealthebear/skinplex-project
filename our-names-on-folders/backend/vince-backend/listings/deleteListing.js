const { ObjectId } = require('mongodb');
const { getDb } = require('../../db');

async function deleteListing(id) {
  const db = getDb();
  const res = await db.collection('listings').deleteOne({ _id: new ObjectId(id) });
  return res;
}

module.exports = deleteListing;