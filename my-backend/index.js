const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose(); 

const app = express();
const PORT = process.env.PORT || 4000;

const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            surname TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            ticketType TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            payment TEXT NOT NULL,
            cardNumber TEXT,
            expiryDate TEXT,
            cvv TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Table creation error:', err);
            }
        });
    }
});

// Helper function to save to JSON file
const saveToFile = (data) => {
    const filePath = path.join(__dirname, 'tickets.json');
    let tickets = [];
    
    try {
        if (fs.existsSync(filePath)) {
            tickets = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
        
        tickets.push({
            ...data,
            createdAt: new Date().toISOString()
        });
        
        fs.writeFileSync(filePath, JSON.stringify(tickets, null, 2));
    } catch (err) {
        console.error('Error saving ticket:', err);
    }
};

// Routes
app.get("/", (req, res) => {
    res.send("Backend działa. Użyj POST na /api/buy_ticket");
});

app.get("/api/buy_ticket", (req, res) => {
    res.status(405).json({ message: "Metoda GET nie jest obsługiwana. Użyj POST." });
});

app.post("/api/buy_ticket", async (req, res) => {
    const { name, surname, email, phone, ticketType, quantity, payment, cardNumber, expiryDate, cvv } = req.body;
    
    // Validation
    if (!name || !surname || !email || !ticketType || !quantity || !payment) {
        return res.status(400).json({ error: "Brak wymaganych pól" });
    }

    try {
        const result = await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO tickets (name, surname, email, phone, ticketType, quantity, payment, cardNumber, expiryDate, cvv) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, surname, email, phone, ticketType, quantity, payment, cardNumber, expiryDate, cvv],
                function(err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                }
            );
        });

        saveToFile(req.body);

        res.json({ 
            message: "Zgłoszenie przyjęte!",
            ticketId: result
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: "Błąd podczas zapisywania zgłoszenia" });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Coś poszło nie tak!" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});