const bcryptjs = require("bcryptjs")
const Booking = require("../models/booking");
const Equipment = require("../models/equipment");
const Farmer = require('../models/users');
const Add_To_Cart = require('../models/addToCart');
const mongoose = require("mongoose");
const moment = require('moment');
const sendMail = require('../utils/mailer');


// Create Booking
exports.createBooking = async (req, res) => {
  try {
    const {
      customer_id,
      equipment_id,
      location,
      deliveryDetail,
      rental_date,
      return_date,
      status,
      payment_status,
    } = req.body;

    // Fetch Renter details from the database
    const renter = await Farmer.findOne({customer_id});

    if (!renter) {
      return res.status(404).json({
        message: 'Renter not found. Please sign up.',
      });
    }
       // Fetch equipment details from the database
       const equipment = await Equipment.findOne({equipment_id});

       if (!equipment) {
         return res.status(404).json({
           message: 'Equipment not found.',
         });
       }
if (equipment.available !== true) {

  // Fetch admin email
const adminEmail = process.env.AdminEmail;


// Send email to admin
await sendMail(
  adminEmail,
  "Out of Stock",
  `<p>The Product with ID number <strong>${equipment_id}</strong> is out of stock.</p>`
);
  return res.status(200).json({
    message: 'Equipment is out of stock. Please call back in 2 days'
  
  });
}
    // Calculate the rental duration in days
    const rentalDuration = moment(return_date).diff(moment(rental_date), 'days');

    if (rentalDuration <= 0) {
      return res.status(400).json({
        message: 'Invalid rental period. The return date must be after the rental date.',
      });
    }
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

// Calculate rental cost using equipment's daily rate
const rental_cost = rentalDuration * equipment.price;

// Define doorstep pickup costs
const doorstepCosts = {
  Ijebu: 1000,
  Ore: 1500,
  Ibadan: 2000,
};

let Total_rental_cost;

if (deliveryDetail.stationPickUp === true) {
  // No additional cost for station pickup
  Total_rental_cost = rental_cost;
} else if (deliveryDetail.doorPickUp in doorstepCosts) {
  // Add the appropriate doorstep cost
  Total_rental_cost = rental_cost + doorstepCosts[deliveryDetail.doorPickUp];
} else {
  // Handle invalid delivery details
  return res.status(400).json({
    message: "Invalid delivery detail. Please set your delivery detail to continue booking.",
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

// Create the booking object
    const booking = await Booking.create({
      rental_id,
      customer_id,
      equipment_id,
      location,
      deliveryDetail,
      rental_date,
      return_date,
      rental_duration: rentalDuration,
      rental_cost: Total_rental_cost,
      status,
      payment_status,
    });

// Update the equipment availability to false after it has been booked
      await Equipment.updateOne(
        { equipment_id },
        { available: false }
      );

          // Send email to the user with booking details
    const userEmail = renter.email; // Assuming the renter object has an 'email' field
    const subject = "Booking Confirmation - Rent Now";
    const htmlContent = `
      <p>Hello ${renter.name},</p>
      <p>Your booking has been successfully created. Below are your booking details:</p>
      <ul>
        <li><strong>Rental ID:</strong> ${rental_id}</li>
        <li><strong>Equipment:</strong> ${equipment.name}</li>
        <li><strong>Rental Duration:</strong> ${rentalDuration} days</li>
        <li><strong>Total Rental Cost:</strong> $${Total_rental_cost}</li>
        <li><strong>Delivery:</strong> ${deliveryDetail.stationPickUp ? 'Station Pickup' : 'Doorstep Pickup'}</li>
      </ul>
      <p>Thank you for choosing Rent Now!</p>
    `;

    // Send confirmation email to the user
    await sendMail(userEmail, subject, htmlContent);
    // Save booking to database (mocked here, replace with actual DB save logic)
    // Example: const savedBooking = await Booking.create(booking);
    // const savedBooking = { id: 1, ...booking }; // Mocked response

    // res.status(201).json({
    //   message: 'Booking created successfully.',
    //   booking: savedBooking,
    // });

    
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
// exports.approveBooking = async (req, res) => {
//   try {
//     const { rental_id } = req.params;
//     const booking = await Booking.findOneAndUpdate(
//       { rental_id },
//       { status: "approved" },
//       { new: true }
//     );
    
//     if (!booking) return res.status(404).json({ message: "Booking not found" });
//     res.json({ message: "Booking approved", booking });
//   } catch (error) {
//     res.status(500).json({ message: "Error approving booking", error });
//   }
// };

// Cancel Booking

const BOOKING_STATUS = {
  CANCELED: "canceled",
  CONFIRMED: "successful",
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

exports.addToCart = async (req, res) => {
  try {
    const { customer_id, equipment_id, quantity } = req.body;

    // Validate input
    if (!customer_id || !equipment_id || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Invalid input data" });
    }

    // Check if customer exists and fetch or create their cart
    let cart = await Add_To_Cart.findOne({ customer_id });
    if (!cart) {
      cart = await Add_To_Cart.create({ customer_id, items: [], totalPrice: 0 });
    }

    // Fetch equipment details
    const product = await Equipment.findOne({ equipment_id });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if the product is already in the cart
    const itemIndex = cart.items.findIndex(item => item.equipment_id === equipment_id);
    if (itemIndex > -1) {
      // Update the existing item's quantity and total price
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].totalPrice = cart.items[itemIndex].quantity * cart.items[itemIndex].price;
    } else {
      // Add the new item to the cart
      cart.items.push({
        equipment_id,
        name: product.product_name,
        quantity,
        price: product.price,
        totalPrice: quantity * product.price,
      });
    }

    // Recalculate total cart price
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

    // Save the updated cart
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


// Environment variables
const PAYMENT_GATEWAY_REFUND_URL = process.env.PAYMENT_GATEWAY_REFUND_URL; // e.g., https://api.paymentgateway.com/verify
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY; // Secret key for gateway authentication




// Refund endpoint
exports.refundCancelBooking = async (req, res) => {

    const { rental_id, transactionId, rental_cost, reason } = req.body;

    try {
        // Validate environment variables
        if (!PAYMENT_GATEWAY_REFUND_URL || !FLUTTERWAVE_SECRET_KEY) {
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
        if (booking.payment_status!== BOOKING_STATUS.CONFIRMED) {
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
            
                const response = await flw.Transaction.refund({
                  id: transactionId,
                  amount: rental_cost,
                  reason: reason || 'Booking canceled',
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
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



// exports.createBooking = async (req, res) => {
//   try {
//     const {
//       customer_id,
//       // rental_frequency,
//       equipment_type,
//       rental_duration,
//       rental_cost,
//       // customer_rating,
//       rental_date,
//       return_date,
//       status,
//     } = req.body;

  
//         // Validate rental_date and return_date
//         const now = new Date();
//         const rentalDate = new Date(rental_date);
//         const returnDate = new Date(return_date);
    
//         if (rentalDate <= now) {
//           return res.status(400).json({
//             success: false,
//             message: "Your selected booking start date has passed. Please select a valid start date.",
//           });
//         }
    
//         if (returnDate <= rentalDate) {
//           return res.status(400).json({
//             success: false,
//             message: "The return date must be after the rental start date.",
//           });
//         }

//      // Generate unique Rental ID for Tracking
//     const generateRentalID = async (existingIDs) => {
//       const letters = "abcdefghijklmnopqrstuvwxyz";
//       const numbers = "0123456789";
    
//       let newID;
//       do {
//           const randomLetters = Array.from({ length: 3 }, () =>
//               letters.charAt(Math.floor(Math.random() * letters.length))
//           ).join("");
    
//           const randomNumbers = Array.from({ length: 3 }, () =>
//               numbers.charAt(Math.floor(Math.random() * numbers.length))
//           ).join("");
    
//           newID = `Rent${randomNumbers}${randomLetters}`;
//       } while (existingIDs.includes(newID)); // Ensure unique ID
    
//       return newID;
//     };
    

//     // Generate unique customer ID
//     const existingIDs = await Booking.distinct("rental_id");
//     const rental_id = await generateRentalID(existingIDs);

   

      
//     // Create the booking
//     const booking = await Booking.create({
      
//       rental_id,
//       customer_id, // Custmer ID generated during sign up
//       // rental_frequency,
//       equipment_type,
//       rental_duration,
//       rental_cost,
//       // customer_rating,
//       rental_date,
//       return_date,
//       status,
//     });


//     // Respond with success
//     return res.status(201).json({
//       message: "Booking created successfully",
//       booking,
//     });
//   } catch (error) {
//     console.error("Error creating booking:", error.message); // Improved debugging log
//     return res.status(500).json({
//       message: "Error creating booking",
//       error: error.message,
//     });
//   }
// };

