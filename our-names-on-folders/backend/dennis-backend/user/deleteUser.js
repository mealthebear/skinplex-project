const { ObjectId } = require("mongodb");
const { getDb } = require("../../db");

async function deleteUser(id) {
  const db = getDb();
  const res = await db.collection("users").deleteOne({ _id: new ObjectId(id) });
  return res;
}

module.exports = deleteUser;
