const { OAuth2Client } = require("google-auth-library");
const { getDb } = require("../../db");

const CLIENT_ID =
  "702851582781-c9j6t98aptdam1eiko8qudftc5d6m6h4.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

async function handleGoogleAuth(idToken) {
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { sub: googleId, email, name, picture } = payload;

  const db = getDb();

  let user = await db.collection("users").findOne({
    $or: [{ googleId: googleId }, { email: email }],
  });

  if (!user) {
    const newUser = {
      googleId: googleId,
      username: name,
      email: email,
      avatar: picture,
      bio: "",
      rating: { average: 0, count: 0 },
      reviews: [],
      createdAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);
    newUser._id = result.insertedId;
    user = newUser;
  } else if (!user.googleId) {
    await db
      .collection("users")
      .updateOne(
        { _id: user._id },
        { $set: { googleId: googleId, avatar: user.avatar || picture } },
      );
    user.googleId = googleId;
  }

  return user;
}

module.exports = handleGoogleAuth;
