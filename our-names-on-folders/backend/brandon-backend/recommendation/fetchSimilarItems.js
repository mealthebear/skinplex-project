const { ObjectId } = require("mongodb");
const { getDb } = require("../../db");

/**
 * Find listings similar to the given one.
 *
 * Scoring:
 *   +3  same game           (already filtered in query)
 *   +2  same listing type   (sell / rent)
 *   +1  price within 25%
 *   +2  overlapping skins   (shares at least one skin with the viewed listing)
 */
async function fetchSimilarItems(listingId, limit = 6) {
  const db = getDb();
  const collection = db.collection("listings");

  const current = await collection.findOne({ _id: new ObjectId(listingId) });
  if (!current) return [];

  // Pull candidates: same game, exclude the current listing
  const candidates = await collection
    .find({
      _id: { $ne: current._id },
      game: current.game,
    })
    .limit(50)
    .toArray();

  const priceLow = current.price * 0.75;
  const priceHigh = current.price * 1.25;

  // Build a set of skin uuids from the current listing for overlap check
  const currentSkinIds = new Set();
  if (current.skins && current.skins.length > 0) {
    current.skins.forEach((s) => currentSkinIds.add(s.uuid));
  }

  const scored = candidates.map((item) => {
    let score = 3; // already matched on game

    if (item.type === current.type) score += 2;

    if (item.price >= priceLow && item.price <= priceHigh) score += 1;

    // Check for overlapping skins
    if (item.skins && item.skins.length > 0 && currentSkinIds.size > 0) {
      const hasOverlap = item.skins.some((s) => currentSkinIds.has(s.uuid));
      if (hasOverlap) score += 2;
    }

    return { ...item, _relevanceScore: score };
  });

  // Sort by score descending, then newest first as tiebreaker
  scored.sort((a, b) => {
    if (b._relevanceScore !== a._relevanceScore) {
      return b._relevanceScore - a._relevanceScore;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return scored.slice(0, limit);
}

module.exports = fetchSimilarItems;
