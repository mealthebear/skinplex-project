const { ObjectId } = require('mongodb');
const { getDb } = require('../../db');
 
/**
 * Process a purchase or rental.
 * - Updates the listing status to 'sold' or 'rented'
 * - Records the buyer's ID and transaction date
 * - Stores a transaction record so we can verify who bought/rented
 *   (used to control who can leave reviews)
 */
async function purchaseListing(listingId, buyerId) {
  const db = getDb();
 
  const listing = await db.collection('listings').findOne({
    _id: new ObjectId(listingId)
  });
 
  if (!listing) throw new Error('Listing not found');
  if (listing.status === 'sold' || listing.status === 'rented') {
    throw new Error('This listing is no longer available');
  }
  if (listing.sellerId === buyerId) {
    throw new Error('You cannot buy your own listing');
  }
 
  const newStatus = listing.type === 'rent' ? 'rented' : 'sold';
 
  // Update the listing status
  await db.collection('listings').updateOne(
    { _id: new ObjectId(listingId) },
    {
      $set: {
        status: newStatus,
        buyerId: buyerId,
        transactionDate: new Date()
      }
    }
  );
 
  // Store a transaction record
  const transaction = {
    listingId: new ObjectId(listingId),
    sellerId: listing.sellerId,
    buyerId: buyerId,
    type: listing.type,
    price: listing.price,
    title: listing.title,
    createdAt: new Date()
  };
 
  await db.collection('transactions').insertOne(transaction);
 
  return { status: newStatus, transaction };
}
 
module.exports = purchaseListing;