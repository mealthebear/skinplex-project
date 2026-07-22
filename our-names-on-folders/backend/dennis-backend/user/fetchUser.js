const { ObjectId } = require("mongodb");
const { getDb } = require("../../db");

async function fetchUser(id) {
  const db = getDb();
  const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
  return user;
}

module.exports = fetchUser;
