const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require('cors');
const connectToDB = require("./db");
const path = require('path');

// Import routes
const user_router = require('./src/routes/users');
const admin_router = require('./src/routes/admin');
const equipmentRoutes = require("./src/routes/equipment");
const bookingRoutes = require("./src/routes/booking");

const app = express();

const PORT = process.env.PORT || 7080;

// Connect to DB
connectToDB();

app.use(express.json());
app.use(cors());
app.use(express.json())
app.use(cors())
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.listen(PORT, () => {
  console.log(`Server started Running on Port ${PORT}`);
});

app.get('/', (req, res) => {
  return res.status(200).json({ message: "Welcome to Agricultural Equipment Rental Platform" });
});

// Define routes
app.use('/api', user_router);
app.use('/api', admin_router);
app.use('/api', equipmentRoutes);
app.use('/api', bookingRoutes);

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).json({
    message: "Welcome to our server, this endpoint does not exist!"
  });
});
