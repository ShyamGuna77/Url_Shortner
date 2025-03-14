

const cors = require('cors')
const express = require('express')
const connectDB = require('./src/config/db')
const urlRoutes = require('./src/routes/urlRoutes')
require("dotenv").config();



const app = express()
const PORT = process.env.PORT || 5000


connectDB()

app.use(express.json())
app.use(cors())


app.use('/api',urlRoutes)

app.listen(PORT, () => {
    console.log(`App listening on ${PORT} `);
})