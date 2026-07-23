const { getDb } = require('../../db');
 
const MAX_HISTORY = 10;
 
async function addToSearchHistory(userId, query) {
  const trimmed = query.trim();
  if (!trimmed) return null;
 
  const db = getDb();
  const collection = db.collection('searchHistory');
 
  await collection.deleteOne({ userId, query: trimmed });
 
  const entry = {
    userId,
    query: trimmed,
    timestamp: new Date()
  };
  await collection.insertOne(entry);
 
  const count = await collection.countDocuments({ userId });
  if (count > MAX_HISTORY) {
    const oldest = await collection
      .find({ userId })
      .sort({ timestamp: 1 })
      .limit(count - MAX_HISTORY)
      .toArray();
    const idsToRemove = oldest.map(doc => doc._id);
    await collection.deleteMany({ _id: { $in: idsToRemove } });
  }
 
  return entry;
}