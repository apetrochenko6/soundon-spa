require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const nodemailer = require('nodemailer');
const sqlite3 = require("sqlite3").verbose();
const { MailtrapClient } = require('mailtrap');
const app = express();
const PORT = process.env.PORT || 4000;

const corsOptions = {
    origin: process.env.CLIENT_URL || "https://soundon-spa-nucd.vercel.app",
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
const client = new MailtrapClient({ token: process.env.MAILTRAP_TOKEN });

app.use(cors(corsOptions));
app.use(express.json());

const db = new sqlite3.Database('./database.sqlite', (err) => {
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
        )`);
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
        // First insert into database
        const result = await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO tickets (name, surname, email, phone, ticketType, quantity, payment, cardNumber, expiryDate, cvv) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, surname, email, phone, ticketType, quantity, payment, cardNumber, expiryDate, cvv],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                }
            );
        });

        console.log('Received JSON:', req.body);
        saveToFile(req.body);
        console.log("saved");

        // Then send email
        const transport = nodemailer.createTransport({
            host: "live.smtp.mailtrap.io",
            port: 587,
            auth: {
                user: "api",
                pass: "c90f9d62de572f1680e18ea08adda1d5"
            }
        });

        const messageToSend = {
            from: 'hello@sound-on.com',
            to: email,
            subject: 'Your Ticket Confirmation',
            text: `Hello ${name} ${surname}, your ticket for ${ticketType} (quantity: ${quantity}) has been booked.`
        };

        await transport.sendMail(messageToSend);
        console.log('Email sent...');

        // Send single response
        res.json({
            message: "Zgłoszenie przyjęte!",
            ticketId: result
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Błąd podczas zapisywania zgłoszenia" });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Coś poszło nie tak!" });
});

app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});