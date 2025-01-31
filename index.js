require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).send('API is working');
});

// Email Sending Route
app.post('/send-email', async (req, res) => {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required!' });
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
            to,
            subject,
            text: message
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
