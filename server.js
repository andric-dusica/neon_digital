require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/sendEmail', async (req, res) => {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resend.emails.send({
            from: 'Neon Digital <no-reply@neondigital.rs>',
            to: 'neondigital.creative@gmail.com',
            subject: `New Contact Form Submission: ${subject}`,
            text: `From: ${email}\n\n${message}`,
        });

        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ error: "Failed to send email" });
        }

        res.status(200).json({ message: "Email sent successfully!", data });
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
