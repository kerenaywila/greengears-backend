const bcryptjs = require("bcryptjs")
const Booking = require("../models/booking");
const mongoose = require("mongoose");


// Create Booking
exports.createBooking = async (req, res) => {
  try {
    const {
      customer_id,
      // rental_frequency,
      equipment_type,
      rental_duration,
      rental_cost,
      // customer_rating,
      rental_date,
      return_date,
      status,
    } = req.body;

  
        // Validate rental_date and return_date
        const now = new Date();
        const rentalDate = new Date(rental_date);
        const returnDate = new Date(return_date);
    
        if (rentalDate <= now) {
          return res.status(400).json({
            success: false,
            message: "Your selected booking start date has passed. Please select a valid start date.",
          });
        }
    
        if (returnDate <= rentalDate) {
          return res.status(400).json({
            success: false,
            message: "The return date must be after the rental start date.",
          });
        }

     // Generate unique Rental ID for Tracking
    const generateRentalID = async (existingIDs) => {
      const letters = "abcdefghijklmnopqrstuvwxyz";
      const numbers = "0123456789";
    
      let newID;
      do {
          const randomLetters = Array.from({ length: 3 }, () =>
              letters.charAt(Math.floor(Math.random() * letters.length))
          ).join("");
    
          const randomNumbers = Array.from({ length: 3 }, () =>
              numbers.charAt(Math.floor(Math.random() * numbers.length))
          ).join("");
    
          newID = `Rent${randomNumbers}${randomLetters}`;
      } while (existingIDs.includes(newID)); // Ensure unique ID
    
      return newID;
    };
    

    // Generate unique customer ID
    const existingIDs = await Booking.distinct("rental_id");
    const rental_id = await generateRentalID(existingIDs);

   

      
    // Create the booking
    const booking = await Booking.create({
      
      rental_id,
      customer_id, // Custmer ID generated during sign up
      // rental_frequency,
      equipment_type,
      rental_duration,
      rental_cost,
      // customer_rating,
      rental_date,
      return_date,
      status,
    });


    // Respond with success
    return res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error.message); // Improved debugging log
    return res.status(500).json({
      message: "Error creating booking",
      error: error.message,
    });
  }
};


// Approve Booking
exports.approveBooking = async (req, res) => {
  try {
    const { rental_id } = req.params;
    const booking = await Booking.findOneAndUpdate(
      { rental_id },
      { status: "approved" },
      { new: true }
    );
    
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking approved", booking });
  } catch (error) {
    res.status(500).json({ message: "Error approving booking", error });
  }
};

// Cancel Booking

const BOOKING_STATUS = {
  CANCELED: "canceled",
  CONFIRMED: "confirmed",
  PENDING: "pending",
};


exports.cancelBooking = async (req, res) => {
  try {
    const { rental_id } = req.body;

    // Validate rental_id
    if (!rental_id) {
      return res.status(400).json({ success: false, message: "Invalid booking ID" });
    }

    // Find the booking
    const booking = await Booking.findOne({ rental_id });
    // console.log(rental_id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Check if the booking is eligible for cancellation
    const now = new Date();
    if (new Date(booking.rental_date) < now) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel past bookings",
      });
    }

    // Check if the booking is already canceled
    if (booking.status === BOOKING_STATUS.CANCELED) {
      return res.status(400).json({
        success: false,
        message: "Booking is already canceled",
      });
    }

    // Update the booking status
    booking.status = BOOKING_STATUS.CANCELED;
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking canceled successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error canceling booking:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while canceling the booking",
      error: error.message,
    });
  }
};


exports.deleteCanceledBooking = async (req, res) => {
  try {
    const { rental_id } = req.body;

    // Validate rental_id
    if (!rental_id) {
      return res.status(400).json({ success: false, message: "Invalid booking ID" });
    }

    // Find the booking
    const booking = await Booking.findOne({ rental_id });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Check if the booking is already canceled
    if (booking.status !== BOOKING_STATUS.CANCELED) {
      return res.status(400).json({
        success: false,
        message: "Only canceled bookings can be deleted",
      });
    }

    // Delete the booking (hard delete)
    await booking.deleteOne();

    res.status(200).json({
      success: true,
      message: "Canceled booking successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting canceled booking:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the booking",
      error: error.message,
    });
  }
};


// Environment variables
const PAYMENT_GATEWAY_REFUND_URL = process.env.PAYMENT_GATEWAY_REFUND_URL; // e.g., https://api.paymentgateway.com/verify
const PAYMENT_GATEWAY_SECRET_KEY = process.env.PAYMENT_GATEWAY_SECRET_KEY; // Secret key for gateway authentication




// Refund endpoint
exports.refundCancelBooking = async (req, res) => {

    const { rental_id, transactionId, rental_cost, reason } = req.body;

    try {
        // Validate environment variables
        if (!PAYMENT_GATEWAY_REFUND_URL || !PAYMENT_GATEWAY_SECRET_KEY) {
            console.error('Payment gateway configuration missing.');
            return res.status(500).json({
                status: 'error',
                message: 'Server configuration error. Please try again later.',
            });
        }

        // Check if the booking exists
        const booking = await Booking.findOne({ rental_id });
        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking not found.',
            });
        }

        // Check if the booking is eligible for a refund
        if (booking.status !== BOOKING_STATUS.CANCELED) {
            return res.status(400).json({
                status: 'error',
                message: 'Booking is not eligible for a refund.',
            });
        }

        // Check if the booking has already been refunded
        if (booking.refundedAmount) {
            return res.status(409).json({
                status: 'error',
                message: 'Refund has already been processed for this booking.',
            });
        }

        // Call the payment gateway's refund API with retries
        const MAX_RETRIES = 3;
        let refundResponse;
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                const response = await axios.post(
                    PAYMENT_GATEWAY_REFUND_URL,
                    {
                        transaction_id: transactionId,
                        rental_cost,
                        reason: reason || 'Booking canceled',
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${PAYMENT_GATEWAY_SECRET_KEY}`,
                        },
                    }
                );
                refundResponse = response.data;
                if (refundResponse.status === 'success') break;
            } catch (err) {
                if (attempt === MAX_RETRIES - 1) throw err;
            }
        }

        // Handle successful refund
        if (refundResponse.status === 'success') {
            await updateBookingRefundStatus(rental_id, refundResponse.refund_id, rental_cost);
            return res.status(200).json({
                status: 'success',
                message: 'Refund processed successfully.',
                data: {
                    rental_id,
                    refundId: refundResponse.refund_id,
                    rental_cost,
                },
            });
        } else {
            return res.status(400).json({
                status: 'error',
                message: 'Refund failed.',
                data: refundResponse,
            });
        }
    } catch (error) {
        console.error('Error processing refund:', error.message);
        if (error.response) {
            return res.status(error.response.status).json({
                status: 'error',
                message: 'Failed to process refund via payment gateway.',
                details: error.response.data,
            });
        } else if (error.request) {
            return res.status(503).json({
                status: 'error',
                message: 'Unable to reach payment gateway. Please try again later.',
            });
        } else {
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error. Please try again later.',
            });
        }
    }
};

// Helper function to update booking refund status
async function updateBookingRefundStatus(rental_id, refundId, rental_cost) {
    try {
        await Booking.findOneAndUpdate(
            { rental_id },
            {
                refundId,
                refundedAmount: rental_cost,
                refundDate: new Date(),
            },
            { new: true }
        );
    } catch (error) {
        console.error('Failed to update booking refund status:', error.message);
        throw new Error('Database update failed.');
    }
}
