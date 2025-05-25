const { MongoClient } = require('mongodb');
// const uri = 'mongodb://127.0.0.1:27017';
const uri = process.env.MONGO_URI || "";
// const dbName = 'tuition_center_db';
let db;

function connectToDB(callback) {
  const client = new MongoClient(uri);
  client.connect()
    .then(() => {
      // db = client.db(dbName);
      db = client.db(process.env.DB_NAME || ''); // Use environment variable or default
      console.log('Connected to MongoDB');
      callback(); // Call the callback so server starts
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1); // Exit if DB connection fails
    });
}

function getDB() {
  if (!db) throw new Error('DB not initialized! Call connectToDB first.');
  return db;
}

module.exports = { connectToDB, getDB };
