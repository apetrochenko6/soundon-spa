require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const nodemailer = require('nodemailer');
const { Database } = require('sqlite3').verbose();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const app = express();
const PORT = process.env.PORT || 4000;

// Security Middleware
app.use(helmet());
app.set('trust proxy', 1);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'https://soundon-spa-nucd.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Database Setup
const db = new Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
  
  db.run(`CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    ticketType TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    payment TEXT NOT NULL,
    cardNumber TEXT,
    expiryDate TEXT,
    cvv TEXT,
    blikCode TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) console.error('Table creation error:', err);
  });
});

// Email Transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Utility Functions
const saveToFile = async (data) => {
  const filePath = path.join(__dirname, 'tickets.json');
  try {
    let tickets = [];
    try {
      const fileData = await fs.readFile(filePath, 'utf8');
      tickets = JSON.parse(fileData);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }

    tickets.push({
      ...data,
      createdAt: new Date().toISOString()
    });

    await fs.writeFile(filePath, JSON.stringify(tickets, null, 2));
  } catch (err) {
    console.error('Error saving ticket:', err);
  }
};

const sendConfirmationEmail = async (to, ticketData) => {
  try {
    const mailOptions = {
      from: `"SoundON Tickets" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject: 'Your Ticket Confirmation',
      text: `Hello ${ticketData.name} ${ticketData.surname},\n\nYour ticket for ${ticketData.ticketType} (quantity: ${ticketData.quantity}) has been booked.`,
      html: `<p>Hello ${ticketData.name} ${ticketData.surname},</p>
             <p>Your ticket for <strong>${ticketData.ticketType}</strong> (quantity: ${ticketData.quantity}) has been successfully booked.</p>`
    };

    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${to}`);
  } catch (err) {
    console.error('Email sending error:', err);
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend is running. Use POST /api/buy_ticket for ticket purchases.'
  });
});

app.post('/api/buy_ticket', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('surname').trim().notEmpty().withMessage('Surname is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('ticketType').trim().notEmpty().withMessage('Ticket type is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('payment').trim().notEmpty().withMessage('Payment method is required'),
  body('cardNumber').if(body('payment').equals('credit'))
    .trim().notEmpty().withMessage('Card number is required for credit payments'),
  body('expiryDate').if(body('payment').equals('credit'))
    .trim().notEmpty().withMessage('Expiry date is required for credit payments'),
  body('cvv').if(body('payment').equals('credit'))
    .trim().notEmpty().withMessage('CVV is required for credit payments'),
  body('blikCode').if(body('payment').equals('blik'))
    .trim().notEmpty().withMessage('BLIK code is required for BLIK payments')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 'error',
      errors: errors.array() 
    });
  }

  const {
    name,
    surname,
    email,
    phone,
    ticketType,
    quantity,
    payment,
    cardNumber,
    expiryDate,
    cvv,
    blikCode
  } = req.body;

  try {
    const result = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO tickets (
          name, surname, email, phone,
          ticketType, quantity, payment,
          cardNumber, expiryDate, cvv, blikCode
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name, surname, email, phone,
          ticketType, quantity, payment,
          payment === 'credit' ? cardNumber : null,
          payment === 'credit' ? expiryDate : null,
          payment === 'credit' ? cvv : null,
          payment === 'blik' ? blikCode : null
        ],
        function(err) {
          if (err) return reject(err);
          resolve({ id: this.lastID });
        }
      );
    });

    // Save backup and send email in parallel
    await Promise.all([
      saveToFile(req.body),
      sendConfirmationEmail(email, req.body)
    ]);

    res.status(201).json({
      status: 'success',
      data: {
        ticketId: result.id,
        message: 'Ticket purchased successfully'
      }
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
  }
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// Server Startup
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    db.close();
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    db.close();
    console.log('Server closed');
    process.exit(0);
  });
});