require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = ['https://vpg2.vercel.app', 'https://vpg1.vercel.app', 'https://vpg3.vercel.app'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'], // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow required headers
}));

app.use(bodyParser.json());

// Handle Preflight Requests
app.options('*', cors());

app.get('/', (req, res) => {
    res.status(200).send('API is working');
});

// Email Sending Route
app.post('/send-email', async (req, res) => {
    const { lines,tags,recipient,email, transaction } = req.body;

    if (!email || !transaction ||!lines ||!tags ||!recipient) {
        return res.status(400).json({ error: 'All Fields are required!' });
    }

    try {
        // Configure transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL, // Your Gmail
                pass: process.env.PASSWORD // App password (not actual Gmail password)
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL,
            to: "deepnami55@gmail.com",
            subject: "New Request from Client",
            text: `Client Email: ${email}\nTransaction ID: ${transaction}\nNO of Lines: ${lines}\nTags to be included: ${tags}\nName Of Recipient: ${recipient}`
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: 'Email sent successfully!' });

    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
