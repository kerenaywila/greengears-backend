const axios = require('axios');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Initialize Payment
const initializePayment = async (paymentData) => {
  try {
    const res = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      paymentData,
      {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
        timeout: 1000, // Optional: Set a timeout for 5 seconds
      }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      console.error("Paystack API error:", error.response.data);
      throw new Error(`Payment initialization failed: ${error.response.data.message}`);
    } else if (error.request) {
      console.error("No response received from Paystack:", error.request);
      throw new Error("Payment initialization failed: No response from Paystack");
    } else {
      console.error("Error setting up request:", error.message);
      throw new Error("Payment initialization failed");
    }
  }
};

module.exports = { initializePayment };
