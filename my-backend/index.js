require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const nodemailer = require('nodemailer');
const sqlite3 = require("sqlite3").verbose();
const app = express();
const PORT = process.env.PORT || 4000;

app.set('trust proxy', true);
const corsOptions = {
    origin: process.env.CLIENT_URL || "https://soundon-spa-nucd.vercel.app",
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
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
            blikCode TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
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

app.get("/", (req, res) => {
    res.send("Backend działa. Użyj POST na /api/buy_ticket");
});

app.get("/api/buy_ticket", (req, res) => {
    res.status(405).json({ message: "Metoda GET nie jest obsługiwana. Użyj POST." });
});
app.post("/api/buy_ticket", async (req, res) => {
    const { name, surname, email, phone, ticketType, quantity, payment, cardNumber, expiryDate, cvv } = req.body;
    if (!name || !surname || !email || !ticketType || !quantity || !payment) {
        return res.status(400).json({ error: "Brak wymaganych pól" });
    }
    try {
        const result = await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO tickets (name, surname, email, phone, ticketType, quantity, payment, cardNumber, expiryDate, cvv,blikCode) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, surname, email, phone, ticketType, quantity, payment, cardNumber, expiryDate, cvv, blikCode],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                }
            );
        });

        saveToFile(req.body);
        console.log(req.body);
        const mailOptions = {
            from: `"SoundON Tickets" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Your Ticket Confirmation',
            text: `Hello ${name} ${surname}, your ticket for ${ticketType} (quantity: ${quantity}) has been booked.`,
            html: `<p>Hello ${name} ${surname},</p>
                   <p>Your ticket for <strong>${ticketType}</strong> (quantity: ${quantity}) has been successfully booked.</p>`
        };

        await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent');

        res.json({
            message: "Zgłoszenie przyjęte!",
            ticketId: result
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ 
            error: "Błąd podczas zapisywania zgłoszenia",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: "Coś poszło nie tak!",
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});

process.on('SIGINT', () => {
    db.close();
    process.exit();
});