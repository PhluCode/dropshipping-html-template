const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, '../data/ecommerce.db');
const db = new sqlite3.Database(dbPath);

const ensureOrdersTable = () => {
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        email TEXT NOT NULL,
        credit_card_last4 TEXT NOT NULL,
        total REAL NOT NULL,
        items TEXT NOT NULL,
        order_date TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
};

ensureOrdersTable();

const saveOrder = (userId, email, creditCardLast4, total, items) => {
    return new Promise((resolve, reject) => {
        const orderDate = new Date().toISOString();
        const itemsJson = JSON.stringify(items);
        const sql = `INSERT INTO orders (user_id, email, credit_card_last4, total, items, order_date) VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(sql, [userId, email, creditCardLast4, total, itemsJson, orderDate], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID });
            }
        });
    });
};

module.exports = {
    saveOrder
};