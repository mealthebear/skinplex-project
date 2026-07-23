const { getDb } = require("../../db");

async function addUser(userData) {
  const db = getDb();
  const newUser = {
    username: userData.username,
    email: userData.email,
    bio: userData.bio || "",
    rating: { average: 0, count: 0 },
    reviews: [],
    createdAt: new Date(),
  };
  const result = await db.collection("users").insertOne(newUser);
  newUser._id = result.insertedId;
  return newUser;
}

module.exports = addUser;
