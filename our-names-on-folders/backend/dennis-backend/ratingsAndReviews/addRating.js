const { ObjectId } = require("mongodb");
const { getDb } = require("../../db");

async function addRating(userId, newStars) {
  const db = getDb();
  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });
  if (!user) throw new Error("User not found");

  const currentRating = user.rating || { average: 0, count: 0 };
  const newCount = currentRating.count + 1;
  const newAverage = Number(
    (
      (currentRating.average * currentRating.count + newStars) /
      newCount
    ).toFixed(1),
  );

  const res = await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(userId) },
      { $set: { rating: { average: newAverage, count: newCount } } },
    );
  return res;
}

module.exports = addRating;
