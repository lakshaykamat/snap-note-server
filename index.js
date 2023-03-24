
require('dotenv').config()
const express = require('express')
const port = process.env.PORT || 80
const connectDb = require('./config/db')
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')
connectDb()
const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/user',require("./routes/userRoutes"))
app.use(errorHandler)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))