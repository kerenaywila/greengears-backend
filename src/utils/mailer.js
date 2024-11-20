const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
});

const sendMail = async (to, subject, html) => {
    await transporter.sendMail({
        from: `"Agricultural Equipment Rental" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
    
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
      } catch (error) {
        console.error('Error sending email: ', error);
      }
};

module.exports = sendMail;
