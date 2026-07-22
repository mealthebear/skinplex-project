require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectToDb } = require("./db");
const handleGoogleAuth = require("../backend/dennis-backend/auth/googleAuth");

const app = express();
const port = 3001;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Listing routes
const fetchUser = require("./vince-backend/user/fetchUser");
const updateUser = require("./vince-backend/user/updateUser");
const storeListing = require("./vince-backend/listings/storeListing");
const fetchListings = require("./vince-backend/listings/fetchListings");
const fetchListingById = require("./vince-backend/listings/fetchListingById");
const updateListing = require("./vince-backend/listings/updateListing");
const deleteListing = require("./vince-backend/listings/deleteListing");

app.get("/users/:id", async (req, res) => {
  try {
    const user = await fetchUser(req.params.id);
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user");
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    await updateUser(req.params.id, req.body);
    res.send("User updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating user");
  }
});

app.post("/listings", async (req, res) => {
  try {
    const listing = await storeListing(req.body);
    res.status(201).json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating listing");
  }
});

app.get("/listings", async (req, res) => {
  try {
    const listings = await fetchListings(req.query);
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching listings");
  }
});

app.get("/listings/:id", async (req, res) => {
  try {
    const listing = await fetchListingById(req.params.id);
    if (!listing) return res.status(404).send("Listing not found");
    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching listing");
  }
});

app.put("/listings/:id", async (req, res) => {
  try {
    await updateListing(req.params.id, req.body);
    res.send("Listing updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating listing");
  }
});

app.delete("/listings/:id", async (req, res) => {
  try {
    await deleteListing(req.params.id);
    res.send("Listing deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting listing");
  }
});

app.post("/api/auth/google", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "Google ID Token is required" });
  }

  try {
    const user = await handleGoogleAuth(idToken);
    res.json({ message: "Authentication successful", user: user });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ error: "Invalid Google token" });
  }
});

async function startServer() {
  await connectToDb();
  app.listen(port, () => {
    console.log(`Server is running and listening on http://localhost:${port}`);
  });
}

startServer();
