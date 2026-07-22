const { getDb } = require('../../db');
 
async function fetchSearchHistory(userId, limit = 10) {
  const db = getDb();
  const history = await db.collection('searchHistory')
    .find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray();
 
  return history;
}
 
module.exports = fetchSearchHistory;