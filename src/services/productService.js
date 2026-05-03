const sqlite3 = require('sqlite3').verbose();
const path = require('path');
// ชี้ไปที่ไฟล์ database ที่เราพึ่ง migrate ข้อมูลลงไป
const dbPath = path.join(__dirname, '../../ecommerce.db');
const db = new sqlite3.Database(dbPath);

const getProducts = (category) => {
  return new Promise((resolve, reject) => {
    let query = "SELECT * FROM products";
    let params = [];
    
    if (category) {
      query += " WHERE category = ?";
      params = [category];
    }
    
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
};

module.exports = { getProducts };