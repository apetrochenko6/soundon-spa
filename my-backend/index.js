require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const nodemailer = require('nodemailer');
const sqlite3 = require("sqlite3").verbose();
const { MailtrapClient } = require('mailtrap');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 4000;

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || "https://soundon-spa-nucd.vercel.app",
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database Setup
const db = new sqlite3.Database('./database.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
    console.log('Connected to the SQLite database.');
    initializeDatabase();
});

function initializeDatabase() {
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
        if (err) console.error('Error creating table:', err);
    });
}

// Email Service
class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "live.smtp.mailtrap.io",
            port: 587,
            auth: {
                user: "api",
                pass: process.env.MAILTRAP_TOKEN
            }
        });
        this.mailtrapClient = new MailtrapClient({ token: process.env.MAILTRAP_TOKEN });
    }

    async sendConfirmationEmail(recipientEmail, name, surname, ticketType, quantity) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM || 'hello@sound-on.com',
                to: recipientEmail,
                subject: 'Your Ticket Confirmation',
                text: `Hello ${name} ${surname}, your ticket for ${ticketType} (quantity: ${quantity}) has been booked.`,
                html: `<p>Hello ${name} ${surname},</p>
                       <p>Your ticket for <strong>${ticketType}</strong> (quantity: ${quantity}) has been successfully booked.</p>`
            };

            await this.transporter.sendMail(mailOptions);
            console.log('Confirmation email sent');
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

// Ticket Service
class TicketService {
    constructor(db, emailService) {
        this.db = db;
        this.emailService = emailService;
    }

    async createTicket(ticketData) {
        const { name, surname, email, phone, ticketType, quantity, payment, cardNumber, expiryDate, cvv } = ticketData;

        return new Promise((resolve, reject) => {
            this.db.run(
                `INSERT INTO tickets (
                    name, surname, email, phone, ticketType, 
                    quantity, payment, cardNumber, expiryDate, cvv
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, surname, email, phone, ticketType, quantity, payment, cardNumber, expiryDate, cvv],
                function (err) {
                    if (err) return reject(err);
                    
                    // Send confirmation email
                    this.emailService.sendConfirmationEmail(email, name, surname, ticketType, quantity)
                        .then(() => resolve(this.lastID))
                        .catch(reject);
                }.bind(this)
            );
        });
    }
}

// Initialize services
const emailService = new EmailService();
const ticketService = new TicketService(db, emailService);

// Routes
app.get("/", (req, res) => {
    res.send("SoundON Ticket Booking API is running");
});

app.post("/api/buy_ticket", async (req, res) => {
    const requiredFields = ['name', 'surname', 'email', 'ticketType', 'quantity', 'payment'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ 
            error: "Missing required fields",
            missingFields 
        });
    }
       
    try {
        const ticketId = await ticketService.createTicket(req.body);
        res.json({
            success: true,
            message: "Ticket booked successfully!",
            ticketId
        });
    } catch (error) {
        console.error('Ticket booking error:', error);
        res.status(500).json({ 
            success: false,
            error: "Failed to book ticket",
            details: error.message 
        });
        console.log("saved");
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: "Internal server error",
        message: err.message 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', () => {
    db.close();
    process.exit();
});