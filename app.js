const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const mongoose = require("mongoose")

const user_router = require('./src/routes/users');
const admin_router = require('./src/routes/admin');
const equipmentRoutes = require("./src/routes/equipment");

const cors = require('cors')
const connectToDB = require("./db")



const PORT = process.env.PORT || 7080

connectToDB()


app.use(express.json())
app.use(cors())


app.listen(PORT, ()=>{
    console.log(`Server started Running on Port ${PORT}`)
})

app.get('/', (req, res)=>{
    return res.status(200).json({message: "Welcome to Agricultural Equipment Rental Platform"})
})

app.use('/api', user_router);
app.use('/api', admin_router);
app.use('/api', equipmentRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Welcome to our server, this endpoint does not exist!"
    })
})