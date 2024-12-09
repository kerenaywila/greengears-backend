const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLUTTERWAVE_PUBLIC_KEY, process.env.FLUTTERWAVE_SECRET_KEY);
const sendMail = require('../utils/mailer'); // Import mailer utility
const crypto = require('crypto'); // For secure unique IDs

// Utility function to generate a unique transaction reference
const generateTxRef = () => `tx_${crypto.randomUUID()}`;

// Generate payment link
exports.generatePaymentLink = async (req, res) => {
    const { amount, email, rental_cost, rental_id } = req.body;

    // Validate required fields
    if (!amount || !email || !rental_cost || !rental_id) {
        return res.status(400).json({ message: "Amount, Email, Rental Cost, and Rental ID are required." });
    }

    try {
        const payload = {
            tx_ref: generateTxRef(), // Secure unique transaction reference
            amount: rental_cost,    // Amount being paid
            email,                  // Customer's email address
            currency: 'NGN',        // Nigerian Naira
            redirect_url: process.env.REDIRECT_URL || "https://your-redirect-url.com", // Redirect after payment
            meta: {
                rental_id,          // Unique rental ID
            },
        };

        // Generate payment link using Flutterwave
        const response = await flw.Payment.create(payload);

        if (response.status === "success") {
            const paymentLink = response.data.link;
            return res.status(200).json({
                status: "success",
                message: "Payment link generated successfully.",
                data: { paymentLink },
            });
        } else {
            return res.status(400).json({
                status: "error",
                message: "Failed to generate payment link.",
                error: response.message,
            });
        }
    } catch (error) {
        console.error("Error generating payment link:", error.message);
        return res.status(500).json({
            status: "error",
            message: "An internal error occurred during payment link generation.",
        });
    }
};

// Verify completed payment
exports.verifyPayment = async (req, res) => {
    const { tx_ref } = req.body;

    if (!tx_ref) {
        return res.status(400).json({
            status: 'error',
            message: 'Transaction reference (tx_ref) is required.',
        });
    }

    try {
        const response = await flw.Transaction.verify({ id: tx_ref });

        if (response.status === 'success' && response.data.status === 'successful') {
            return res.status(200).json({
                status: 'success',
                message: 'Payment verified successfully.',
                data: response.data,
            });
        } else {
            return res.status(400).json({
                status: 'error',
                message: 'Payment verification failed.',
                data: response.data,
            });
        }
    } catch (error) {
        console.error('Error verifying payment:', error.message);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error occurred during payment verification.',
        });
    }
};

// Send automated reminder email
exports.sendReminderEmail = async (req, res) => {
    const { email, bookingDetails } = req.body;

    if (!email || !bookingDetails) {
        return res.status(400).json({ message: "Email and booking details are required." });
    }

    const subject = "Booking Reminder - Agricultural Equipment Rental";
    const html = `
        <p>Dear Customer,</p>
        <p>This is a reminder about your upcoming booking:</p>
        <p><strong>Booking Details:</strong></p>
        <p>${bookingDetails}</p>
        <p>Please make the necessary payment using the following link: <a href="${process.env.PAYMENT_URL}">Pay Now</a></p>
        <p>Thank you for choosing our service.</p>
        <p>Best Regards,<br> Agricultural Equipment Rental Team</p>
    `;

    try {
        await sendMail(email, subject, html);
        return res.status(200).json({
            status: 'success',
            message: 'Reminder email sent successfully.',
        });
    } catch (error) {
        console.error("Error sending reminder email:", error.message);
        return res.status(500).json({
            status: 'error',
            message: "An internal error occurred while sending the email.",
        });
    }
};
