const { ObjectId } = require('mongodb');
const { getDb } = require('../../db');
 

async function fetchSimilarItems(listingId, limit = 6) {
  const db = getDb();
  const collection = db.collection('listings');
 
  const current = await collection.findOne({ _id: new ObjectId(listingId) });
  if (!current) return [];
 
  const candidates = await collection
    .find({
      _id: { $ne: current._id },
      game: current.game
    })
    .limit(50)
    .toArray();
 
  const priceLow = current.price * 0.75;
  const priceHigh = current.price * 1.25;
 
  const currentSkinIds = new Set();
  if (current.skins && current.skins.length > 0) {
    current.skins.forEach(s => currentSkinIds.add(s.uuid));
  }
 
  const scored = candidates.map(item => {
    let score = 3;
 
    if (item.type === current.type) score += 2;
 
    if (item.price >= priceLow && item.price <= priceHigh) score += 1;
 
    if (item.skins && item.skins.length > 0 && currentSkinIds.size > 0) {
      const hasOverlap = item.skins.some(s => currentSkinIds.has(s.uuid));
      if (hasOverlap) score += 2;
    }
 
    return { ...item, _relevanceScore: score };
  });
 
  scored.sort((a, b) => {
    if (b._relevanceScore !== a._relevanceScore) {
      return b._relevanceScore - a._relevanceScore;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
 
  return scored.slice(0, limit);
}
 
module.exports = fetchSimilarItems;