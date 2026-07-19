const { getDb } = require('../../db');

async function storeListing(listingData) {
  const db = getDb();
  const listing = {
    title: listingData.title,
    game: listingData.game,
    price: listingData.price,
    type: listingData.type, // 'sell' or 'rent'
    sellerId: listingData.sellerId,
    description: listingData.description || '',
    createdAt: new Date(),
  };
  const result = await db.collection('listings').insertOne(listing);
  return { ...listing, _id: result.insertedId };
}

module.exports = storeListing;