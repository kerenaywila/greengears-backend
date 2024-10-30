const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const mongoose = require("mongoose")




const cors = require('cors')
const connectToDB = require("./server")



const PORT = process.env.PORT || 7080

connectToDB()


app.use(express.json())
app.use(cors())


app.listen(PORT, ()=>{
    console.log(`Server started Running on Port ${PORT}`)
})

app.get('/', (req, res)=>{
    return res.status(200).json({message: "Welcome! Safe a soul today with your Donation"})
})



app.use((req, res) => {
    res.status(404).json({
        message: "Welcome to our server, this endpoint does not exist!"
    })
})