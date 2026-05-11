const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'your_dev_secret_key';

const ensureUsersTable = () => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT NOT NULL,
        registration_date TEXT NOT NULL
    )`);
};

ensureUsersTable();

const hashPassword = async (password) => {
    return bcrypt.hash(password, 10);
};

const comparePassword = async (password, passwordHash) => {
    if (!passwordHash) {
        return false;
    }

    const isBcrypt = passwordHash.startsWith('$2a$') || passwordHash.startsWith('$2b$') || passwordHash.startsWith('$2y$');
    if (isBcrypt) {
        return bcrypt.compare(password, passwordHash);
    }

    const md5Hash = crypto.createHash('md5').update(password).digest('hex');
    return md5Hash === passwordHash;
};

const authenticateUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, username, password_hash, first_name FROM users WHERE username = ?';

        db.get(sql, [email], async (err, user) => {
            if (err) return reject(err);

            if (!user) {
                return resolve({ success: false, message: 'Unauthorized: User not found.' });
            }

            const isMatch = await comparePassword(password, user.password_hash);
            if (!isMatch) {
                return resolve({ success: false, message: 'Unauthorized: Wrong password.' });
            }

            const token = jwt.sign(
                { userId: user.id, username: user.username, first_name: user.first_name },
                JWT_SECRET,
                { expiresIn: '2h' }
            );

            resolve({ success: true, token, user: { username: user.username, first_name: user.first_name } });
        });
    });
};

const registerUser = async ({ email, password, first_name }) => {
    const hashedPassword = await hashPassword(password);
    const registrationDate = new Date().toISOString().split('T')[0];

    return new Promise((resolve, reject) => {
        const stmt = `INSERT INTO users (username, password_hash, first_name, registration_date) VALUES (?, ?, ?, ?)`;

        db.run(stmt, [email, hashedPassword, first_name, registrationDate], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return resolve({ success: false, message: 'User already exists.' });
                }
                return reject(err);
            }

            resolve({ success: true, userId: this.lastID });
        });
    });
};

module.exports = { authenticateUser, registerUser };