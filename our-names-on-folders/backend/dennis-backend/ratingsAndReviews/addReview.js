const { ObjectId } = require("mongodb");
const { getDb } = require("../../db");

async function addReview(userId, reviewData) {
  const db = getDb();
  const { stars, comment, reviewerId } = reviewData;

  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });
  if (!user) throw new Error("User not found");

  const reviews = user.reviews || [];
  reviews.push({ stars, comment, reviewerId, createdAt: new Date() });

  const count = reviews.length;
  const totalStars = reviews.reduce((sum, r) => sum + r.stars, 0);
  const average = Number((totalStars / count).toFixed(1));

  const res = await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        reviews: reviews,
        rating: { average, count },
      },
    },
  );
  return res;
}

module.exports = addReview;
