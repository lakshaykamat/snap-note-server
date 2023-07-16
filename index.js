
require('dotenv').config()
require('./config/passport.js')
const express = require('express')
const port = process.env.PORT || 8080
const connectDb = require('./config/db')
const cors = require('cors')
const passport = require('passport')
const cookieSession = require('cookie-session')
const isAuthenticated = require('./middleware/isAuthenticated.js')
const User = require('./models/User.js')
const errorHandler = require('./middleware/errorHandler.js')

//Connecting to Database
connectDb()

//Initializing app
const app = express()
//---Middleware---
const allowedOrigins = [ process.env.CLIENT_URL ]
app.use(
    cors({
        origin: function (origin, callback) {
            // allow requests with no origin
            // (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
    })
);
app.use(express.json())
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_SECRET]
}))
app.use(passport.session())
app.use(passport.initialize())




app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
)

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: process.env.CLIENT_URL,
        failureRedirect: process.env.CLIENT_URL + "/login/failed"
    })
)

app.get('/auth/getuser', isAuthenticated, (req, res) => {
    res.status(200).json(req.user)
})

//---API Routes---
app.use('/api/v1/notes', isAuthenticated, require('./routes/notes'))
app.use('/api/v1/folder', isAuthenticated, require('./routes/folder'))
app.use('/api/v1/user', isAuthenticated, require('./routes/user.js'))
app.use(errorHandler)
app.listen(port, () => console.log(`Server listening on port ${port}!`))