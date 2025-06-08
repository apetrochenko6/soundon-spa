require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const nodemailer = require('nodemailer');
const sqlite3 = require("sqlite3").verbose();
const app = express();
const PORT = process.env.PORT || 4000;
const { body, validationResult } = require('express-validator');

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
    const { name, surname, email, phone, ticketType, quantity, payment, cardNumber, expiryDate, cvv,blikCode } = req.body;
    if (!name || !surname || !email || !ticketType || !quantity || !payment) {
        return res.status(400).json({ error: "Brak wymaganych pól" });
    }
    try {
        const result = await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO tickets (name, surname, email, phone, ticketType, quantity, payment, cardNumber, expiryDate, cvv,blikCode) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
  subject: `Potwierdzenie zakupu biletu na SoundON 2025 - ${ticketType}`,
  text: `Dzień dobry ${name} ${surname},\n\nTwój bilet na SoundON 2025 (${ticketType}, ilość: ${quantity}) został zarezerwowany.\n\nDziękujemy!`,
  html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Work Sans', sans-serif;
            background-color: #FFFFFF;
            margin: 0;
            padding: 0;
            color: #000000;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            border: 4px solid #000;
        }
        .header {
            background-color: #000;
            padding: 20px;
            text-align: center;
        }
        .logo {
            color: #FFD700;
            font-size: 36px;
            font-weight: 900;
            text-transform: uppercase;
            font-family: 'Bebas Neue', sans-serif;
        }
        .content {
            padding: 30px;
        }
        .divider {
            height: 20px;
            background-color: #000;
            margin: 20px 0;
        }
        .yellow-divider {
            height: 20px;
            background-color: #FFD700;
            margin: 20px 0;
        }
        h1 {
            font-size: 28px;
            color: #000;
            margin-bottom: 20px;
            font-weight: 900;
        }
        .ticket-info {
            margin-bottom: 30px;
        }
        .ticket-info p {
            margin: 10px 0;
            font-size: 16px;
        }
        .ticket-info strong {
            color: #000;
        }
        .footer {
            background-color: #000;
            color: #FFF;
            padding: 20px;
            text-align: center;
            font-size: 14px;
        }
        .highlight {
            background-color: #FFD700;
            padding: 3px 5px;
            font-weight: bold;
        }
        .button {
            display: inline-block;
            background-color: #FFD700;
            color: #000;
            text-decoration: none;
            padding: 10px 20px;
            font-weight: bold;
            margin: 20px 0;
            border: 2px solid #000;
            font-size: 18px;
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Work+Sans:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">#SOUNDON 2025</div>
        </div>
        
        <div class="content">
            <h1>DZIĘKUJEMY ZA ZAKUP BILETU!</h1>
            
            <div class="ticket-info">
                <p><strong>Imię i nazwisko:</strong> ${name} ${surname}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
                <p><strong>Typ biletu:</strong> ${ticketType === '1day' ? '1-dniowy' : ticketType === '3day' ? '3-dniowy' : 'VIP'}</p>
                <p><strong>Ilość biletów:</strong> ${quantity}</p>
                <p><strong>Cena:</strong> ${ticketType === '1day' ? '10 PLN' : ticketType === '3day' ? '25 PLN' : '60 PLN'} za sztukę</p>
                <p><strong>Łączna kwota:</strong> ${ticketType === '1day' ? 10*quantity : ticketType === '3day' ? 25*quantity : 60*quantity} PLN</p>
            </div>

            <div class="yellow-divider"></div>
            
            <p>Twój bilet zostanie wysłany w oddzielnej wiadomości w ciągu 24 godzin.</p>
            
            <p>W przypadku pytań prosimy o kontakt na adres: <a href="mailto:kontakt@soundon.pl">kontakt@soundon.pl</a></p>
            
            <div class="divider"></div>
            
            <p>Do zobaczenia na SoundON 2025!</p>
        </div>
        
        <div class="footer">
            © 2025 SoundON Festival. Wszelkie prawa zastrzeżone.
        </div>
    </div>
</body>
</html>`
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
const validateBandSubmission = [
  body('band_name').trim().notEmpty().withMessage('Nazwa zespołu jest wymagana')
    .isLength({ max: 100 }).withMessage('Nazwa zespołu może mieć maksymalnie 100 znaków'),
  body('location').trim().notEmpty().withMessage('Miejscowość jest wymagana'),
  body('genre').trim().notEmpty().withMessage('Gatunek muzyczny jest wymagany'),
  body('demo').trim().notEmpty().withMessage('Link do demo jest wymagany')
    .isURL().withMessage('Podaj poprawny URL'),
  body('description').optional().trim(),
  body('email').trim().notEmpty().withMessage('Email jest wymagany')
    .isEmail().withMessage('Podaj poprawny adres email'),
  body('phone').optional().trim()
    .matches(/^[0-9]{9,15}$/).withMessage('Podaj poprawny numer telefonu')
];

const db2 = new sqlite3.Database('./bands.db', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to bands database');
    db2.run(`CREATE TABLE IF NOT EXISTS bands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      band_name TEXT NOT NULL,
      location TEXT NOT NULL,
      genre TEXT NOT NULL,
      demo TEXT NOT NULL,
      description TEXT,
      email TEXT NOT NULL,
      phone TEXT,
      submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'pending'
    )`);
  }
});
app.post('/api/band-submission', validateBandSubmission, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { band_name, location, genre, demo, description, email, phone } = req.body;

  try {
    // Save to database
    const result = await new Promise((resolve, reject) => {
      db2.run(
        `INSERT INTO bands 
        (band_name, location, genre, demo, description, email, phone) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [band_name, location, genre, demo, description, email, phone],
        function(err) {
          if (err) return reject(err);
          resolve(this.lastID);
        }
      );
    });

    // Send confirmation email
    const mailOptions = {
  from: `"SoundON Festival" <${process.env.EMAIL_FROM}>`,
  to: email,
  subject: `Potwierdzenie zgłoszenia zespołu ${band_name}`,
  text: `Dzień dobry,\n\nDziękujemy za zgłoszenie zespołu ${band_name} do udziału w SoundON Festival.\n\nSzczegóły zgłoszenia:\nZespół: ${band_name}\nPochodzenie: ${location}\nGatunek: ${genre}\nDemo: ${demo}\n${description ? `Opis: ${description}` : ''}\n\nSkontaktujemy się z Tobą w ciągu najbliższych dni.\n\nPozdrawiamy,\nZespół SoundON Festival`,
  html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Work Sans', sans-serif;
            background-color: #FFFFFF;
            margin: 0;
            padding: 0;
            color: #000000;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            border: 4px solid #000;
        }
        .header {
            background-color: #000;
            padding: 20px;
            text-align: center;
        }
        .logo {
            color: #FFD700;
            font-size: 36px;
            font-weight: 900;
            text-transform: uppercase;
            font-family: 'Bebas Neue', sans-serif;
        }
        .content {
            padding: 30px;
        }
        .divider {
            height: 20px;
            background-color: #000;
            margin: 20px 0;
        }
        .yellow-divider {
            height: 20px;
            background-color: #FFD700;
            margin: 20px 0;
        }
        h1 {
            font-size: 28px;
            color: #000;
            margin-bottom: 20px;
            font-weight: 900;
        }
        .band-info {
            margin-bottom: 30px;
        }
        .band-info p {
            margin: 10px 0;
            font-size: 16px;
        }
        .band-info strong {
            color: #000;
        }
        .band-info ul {
            padding-left: 20px;
        }
        .band-info li {
            margin-bottom: 8px;
        }
        .footer {
            background-color: #000;
            color: #FFF;
            padding: 20px;
            text-align: center;
            font-size: 14px;
        }
        .highlight {
            background-color: #FFD700;
            padding: 3px 5px;
            font-weight: bold;
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Work+Sans:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">#SOUNDON 2025</div>
        </div>
        
        <div class="content">
            <h1>DZIĘKUJEMY ZA ZGŁOSZENIE ZESPOŁU!</h1>
            
            <div class="band-info">
                <p>Otrzymaliśmy Twoje zgłoszenie do udziału w SoundON Festival.</p>
                
                <div class="yellow-divider"></div>
                
                <h3>SZCZEGÓŁY ZGŁOSZENIA:</h3>
                <ul>
                    <li><strong>Zespół:</strong> ${band_name}</li>
                    <li><strong>Pochodzenie:</strong> ${location}</li>
                    <li><strong>Gatunek:</strong> ${genre}</li>
                    <li><strong>Demo:</strong> <a href="${demo}">${demo}</a></li>
                    ${description ? `<li><strong>Opis:</strong> ${description}</li>` : ''}
                </ul>
            </div>

            <div class="divider"></div>
            
            <p>Skontaktujemy się z Tobą w ciągu najbliższych dni.</p>
            
            <p>W przypadku pytań prosimy o kontakt na adres: <a href="mailto:kontakt@soundon.pl">kontakt@soundon.pl</a></p>
            
            <div class="yellow-divider"></div>
            
            <p>Trzymamy kciuki!</p>
            <p>Zespół SoundON Festival</p>
        </div>
        
        <div class="footer">
            © 2025 SoundON Festival. Wszelkie prawa zastrzeżone.
        </div>
    </div>
</body>
</html>`
};

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: 'Zgłoszenie zostało przyjęte',
      submissionId: result
    });

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Wystąpił błąd podczas przetwarzania zgłoszenia'
    });
  }
});


app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await new Promise((resolve, reject) => {
      db2.all('SELECT * FROM bands ORDER BY submission_date DESC', [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
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