const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;
const path = require('path');

const dbPath = path.resolve(__dirname, 'src/data/ecommerce.db');
const db = new sqlite3.Database(dbPath);

async function migrateUsers() {
  try {
    // Read the auth_user.json file
    const data = await fs.readFile(path.join(__dirname, 'src/data/auth_user.json'), 'utf8');
    const users = JSON.parse(data);

    db.serialize(() => {
      // Drop table if exists
      db.run(`DROP TABLE IF EXISTS users`);

      // Create users table
      db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT NOT NULL,
        registration_date TEXT NOT NULL
      )`);

      // Prepare insert statement
      const stmt = db.prepare(`
        INSERT INTO users (username, password_hash, first_name, registration_date)
        VALUES (?, ?, ?, ?)
      `);

      users.forEach((user) => {
        stmt.run(
          user.username,
          user.password_hash,
          user.first_name,
          user.registration_date
        );
      });

      stmt.finalize();
      console.log('✅ Users migration completed successfully!');
    });
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    db.close();
  }
}

migrateUsers();