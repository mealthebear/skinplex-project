const { ObjectId } = require("mongodb");
const { getDb } = require("../../db");

async function updateUser(id, changes) {
  const db = getDb();

  const okFields = ["bio", "username"];
  const cleanChanges = {};
  for (const field of okFields) {
    if (changes[field] !== undefined) {
      cleanChanges[field] = changes[field];
    }
  }

  const res = await db
    .collection("users")
    .updateOne({ _id: new ObjectId(id) }, { $set: cleanChanges });
  return res;
}

module.exports = updateUser;
