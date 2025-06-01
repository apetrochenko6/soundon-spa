const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

const saveToFile = (data) => {
    const filePath = path.join(__dirname, 'tickets.json');
    let tickets = [];
    
    try {
        if (fs.existsSync(filePath)) {
            tickets = JSON.parse(fs.readFileSync(filePath));
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
app.use(cors()); 
app.use(express.json());
cors({
   origin : "https://soundon-spa-1.onrender.com/"
})
app.get("/", (req, res) => {
    res.send("Backend działa. Użyj POST na /api/buy_ticket");
});

app.get("/api/buy_ticket", (req, res) => {
    res.status(405).json({ message: "Metoda GET nie jest obsługiwana. Użyj POST." });
});

const db = require('./database');

app.post("/api/buy_ticket", (req, res) => {
    const { name, surname, email, phone, ticketType, quantity, payment, cardNumber, expiryDate, cvv } = req.body;
    
    db.run(
        `INSERT INTO tickets (name, surname, email, phone, ticketType, quantity, payment, cardNumber, expiryDate, cvv) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, surname, email, phone, ticketType, quantity, payment, cardNumber, expiryDate, cvv],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ 
                message: "Zgłoszenie przyjęte!",
                ticketId: this.lastID 
            });
        }
    );
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Coś poszło nie tak!" });
});
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});