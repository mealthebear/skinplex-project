const { ObjectId } = require("mongodb");
const { getDb } = require("../../db");

async function fetchRatingsAndReviews(userId) {
  if (!userId || !ObjectId.isValid(userId)) {
    return null;
  }

  const db = getDb();

  const user = await db
    .collection("users")
    .findOne(
      { _id: new ObjectId(userId) },
      { projection: { rating: 1, reviews: 1 } },
    );

  if (!user) return null;

  return {
    rating: user.rating || { average: 0, count: 0 },
    reviews: user.reviews || [],
  };
}

module.exports = fetchRatingsAndReviews;
