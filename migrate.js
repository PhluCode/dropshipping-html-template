const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;
const path = require('path');

const dbPath = path.resolve(__dirname, 'src/data/ecommerce.db');
const db = new sqlite3.Database(dbPath);

async function migrateData() {
  try {
    // อ่านไฟล์ JSON จาก path ที่ถูกต้อง
    const data = await fs.readFile(path.join(__dirname, 'src/data/products.json'), 'utf8');
    const products = JSON.parse(data);

    db.serialize(() => {
      // 1. ลบ Table เก่าทิ้งก่อน (เพื่อความสะอาดในการเริ่มใหม่)
      db.run(`DROP TABLE IF EXISTS products`);

      // 2. สร้าง Table ใหม่ให้มี Column ครบตาม JSON
      db.run(`CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image TEXT,
        image_alt TEXT,
        badge TEXT,
        title TEXT NOT NULL,
        rating INTEGER,
        current_price REAL NOT NULL,
        original_price REAL,
        category TEXT
      )`);

      // 3. เตรียมคำสั่ง Insert โดยใช้ชื่อ Field ให้ตรงกับ JSON
      const stmt = db.prepare(`
        INSERT INTO products (image, image_alt, badge, title, rating, current_price, original_price, category) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      products.forEach((p) => {
        stmt.run(
          p.image,
          p.image_alt,
          p.badge,
          p.title, // ใช้ title ให้ตรงกับ JSON
          p.rating,
          p.current_price, // ใช้ current_price ให้ตรงกับ JSON
          p.original_price,
          p.category
        );
      });

      stmt.finalize();
      console.log('✅ Migration completed successfully with all fields!');
    });
    db.close();
  } catch (err) {
    console.error('❌ Migration error:', err);
    db.close();
  }
}

migrateData();