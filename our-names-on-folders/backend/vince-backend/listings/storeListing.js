const { getDb } = require('../../db');

async function storeListing(data) {
  const db = getDb();
  const newListing = {
    title: data.title,
    game: data.game,
    price: data.price,
    type: data.type,
    sellerId: data.sellerId,
    description: data.description || '',
    skins: data.skins || [],
    createdAt: new Date()
  };
  const result = await db.collection('listings').insertOne(newListing);
  newListing._id = result.insertedId;
  return newListing;
}

module.exports = storeListing;