import { Resend } from 'resend';
console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY);

export default async function (req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    console.log("Request body:", req.body);
    console.log("Resend API Key:", process.env.RESEND_API_KEY ? "Exists" : "Missing");


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

        return res.status(200).json({ message: "Email sent successfully!", data });
    } catch (err) {
        console.error("Unexpected error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
