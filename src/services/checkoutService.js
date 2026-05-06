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
        order_date TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
};

const ensureOrderItemsTable = () => {
    db.run(`CREATE TABLE IF NOT EXISTS orderItems (
        order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
    )`);
};

const migrateOrdersSchema = () => {
    db.all(`PRAGMA table_info(orders)`, (err, columns) => {
        if (err || !columns) {
            return;
        }

        const hasItemsColumn = columns.some(column => column.name === 'items');
        if (!hasItemsColumn) {
            return;
        }

        db.serialize(() => {
            console.log('Migrating orders table schema to use orderItems...');
            db.run('PRAGMA foreign_keys = OFF');
            db.run('ALTER TABLE orders RENAME TO orders_old');
            db.run(`CREATE TABLE orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                email TEXT NOT NULL,
                credit_card_last4 TEXT NOT NULL,
                total REAL NOT NULL,
                order_date TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`);
            db.run(`INSERT INTO orders (id, user_id, email, credit_card_last4, total, order_date)
                    SELECT id, user_id, email, credit_card_last4, total, order_date FROM orders_old`);
            db.run(`CREATE TABLE IF NOT EXISTS orderItems (
                order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                price REAL NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            )`);

            db.all(`SELECT id, items FROM orders_old`, (selectErr, rows) => {
                if (selectErr || !rows) {
                    db.run('DROP TABLE IF EXISTS orders_old');
                    db.run('PRAGMA foreign_keys = ON');
                    return;
                }

                const insertItemSql = `INSERT INTO orderItems (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;
                rows.forEach(order => {
                    try {
                        const items = JSON.parse(order.items);
                        if (!Array.isArray(items)) {
                            return;
                        }

                        items.forEach(item => {
                            const productId = item.id || item.product_id;
                            const quantity = Number(item.quantity);
                            const price = Number(item.price);
                            if (!productId || !Number.isInteger(quantity) || quantity <= 0 || Number.isNaN(price)) {
                                return;
                            }
                            db.run(insertItemSql, [order.id, productId, quantity, price]);
                        });
                    } catch (parseErr) {
                        console.error('Failed to parse order items for order', order.id, parseErr);
                    }
                });

                db.run('DROP TABLE IF EXISTS orders_old');
                db.run('PRAGMA foreign_keys = ON');
            });
        });
    });
};

ensureOrdersTable();
ensureOrderItemsTable();
migrateOrdersSchema();

const saveOrder = (userId, email, creditCardLast4, total, items) => {
    return new Promise((resolve, reject) => {
        const orderDate = new Date().toISOString();
        const sql = `INSERT INTO orders (user_id, email, credit_card_last4, total, order_date) VALUES (?, ?, ?, ?, ?)`;

        db.run(sql, [userId, email, creditCardLast4, total, orderDate], function(err) {
            if (err) {
                return reject(err);
            }

            const orderId = this.lastID;
            const insertItemSql = `INSERT INTO orderItems (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;
            const itemPromises = items.map(item => {
                return new Promise((itemResolve, itemReject) => {
                    const productId = item.id || item.product_id;
                    const quantity = Number(item.quantity);
                    const price = Number(item.price);

                    if (!productId || !Number.isInteger(quantity) || quantity <= 0 || Number.isNaN(price)) {
                        return itemReject(new Error('Invalid order item data'));
                    }

                    db.run(insertItemSql, [orderId, productId, quantity, price], function(itemErr) {
                        if (itemErr) {
                            return itemReject(itemErr);
                        }
                        itemResolve();
                    });
                });
            });

            Promise.all(itemPromises)
                .then(() => resolve({ id: orderId }))
                .catch(reject);
        });
    });
};

module.exports = {
    saveOrder
};