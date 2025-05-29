const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./tickets.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to tickets database.');
});

db.run(`CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    ticketType TEXT,
    quantity INTEGER,
    payment TEXT,
    cardNumber TEXT,
    expiryDate TEXT,
    cvv TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

module.exports = db;