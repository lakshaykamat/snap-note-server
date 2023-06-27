
require('dotenv').config()
const express = require('express')
const port = process.env.PORT || 8080
const connectDb = require('./config/db')
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')
connectDb()//connecting to database
const app = express()

//----Middleware---
app.use(cors())
app.use(express.json())
app.use('/api/notes',require('./routes/notesRoutes'))



//BUG Error Handling is not working
app.use(errorHandler)

//---API Routes---
app.use('/api/v1/notes', require('./routes/notes'))
app.use('/api/v1/folder', require('./routes/folder'))
app.listen(port, () => console.log(`Server listening on port ${port}!`))