
require('dotenv').config()
require('./config/passport.js')
const express = require('express')
const port = process.env.PORT || 8080
const connectDb = require('./config/db')
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')
const passport = require('passport')
const cookieSession = require('cookie-session')
const isAuthenticated = require('./middleware/isAuthenticated.js')

//Connecting to Database
connectDb()

//Initializing app
const app = express()
//---Middleware---
app.use(cors({origin: process.env.CLIENT_URL,credentials:true}))
app.use(express.json())
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_SECRET] 
}))
app.use(passport.session())
app.use(passport.initialize())


app.use('/api/notes', require('./routes/notesRoutes'))

app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
)

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: process.env.CLIENT_URL + '/home',
        failureRedirect: process.env.CLIENT_URL + "/failed"
    })
)

app.get('/auth/getuser', isAuthenticated, (req, res) => {
    res.json({ user: req.user })
})
app.use(errorHandler)

//---API Routes---
app.use('/api/v1/notes', require('./routes/notes'))
app.use('/api/v1/folder', require('./routes/folder'))
app.listen(port, () => console.log(`Server listening on port ${port}!`))