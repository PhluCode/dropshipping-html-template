const sqlite3 = require('sqlite3').verbose();
const path = require('path');
// ชี้ไปที่ไฟล์ database ที่เราพึ่ง migrate ข้อมูลลงไป
const dbPath = path.join(__dirname, '../../ecommerce.db');
const db = new sqlite3.Database(dbPath);

const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    // ดึงข้อมูลทั้งหมดจาก table products
    const query = "SELECT * FROM products";
    
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
};

module.exports = { getAllProducts };