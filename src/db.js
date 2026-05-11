require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(process.env.DATABASE_PATH || process.env.DATABASE_URL || path.join(__dirname, 'data', 'ecommerce.db'));
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log(`Database connected at: ${dbPath}`);
  }
});

module.exports = db;
