
require('dotenv').config()
require('./config/passport.js')
const express = require('express')
const port = process.env.PORT || 8080
const connectDb = require('./config/db')
const cors = require('cors')
const passport = require('passport')
const cookieSession = require('cookie-session')
const expressSession = require('express-session')
const isAuthenticated = require('./middleware/isAuthenticated.js')
const User = require('./models/User.js')
const bcrypt = require('bcrypt')
const path = require('path')
const errorHandler = require('./middleware/errorHandler.js')
const Admin = require('./models/Admin')

//Connecting to Database
connectDb()

//Initializing app
const app = express()
//---Middleware---

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_SECRET]
}))
app.use(expressSession({
    secret: 'secret', resave: false, saveUninitialized: false
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




app.post('/auth/login',
    passport.authenticate('local', {
        failureRedirect: '/fail',
        successRedirect: '/'
    }));

app.post('/auth/register', errorHandler, async (req, res, next) => {
    const { username, password, email, admin_pass } = req.body;

    try {
        if (admin_pass !== process.env.ADMIN_PASS) {
            const message = { message: 'Invalid Password' }
            const queryParams = new URLSearchParams(message).toString();
            return res.redirect(`/register?${queryParams}`);
        }

        const user = await Admin.findOne({ email, username })
        if (user) {
            res.status(400)
            throw new Error("User already exists")
        } else {
            const hash = await bcrypt.hash(password, 10)
            const user = { username, password: hash, email }
            await Admin.create(user)
            res.redirect('/')
        }
    } catch (error) {
        return next(error)
    }
});


app.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});


app.set('view engine', 'pug');
app.set('views', './views');

//-- PUG Routes ---
const routes = {
    pug: [
        {
            path: '/',
            file: 'index'
        },
        {
            path: '/profile',
            file: 'profile'
        },
        {
            path: '/users',
            file: 'users'
        },
        {
            path: '/register',
            file: 'register'
        }
    ],
    REST_API: [
        {
            path: '/notes',
            file: 'notes'
        },
        {
            path: '/folder',
            file: 'folder'
        },
        {
            path: '/user',
            file: 'user'
        },
        {
            path: '/admin',
            file: '/admin'
        }
    ]
}
routes.pug.forEach(route => app.use(`${route.path}`, require(`./views/routes/${route.file}.js`)));


//---API Routes--
routes.REST_API.forEach(route => app.use(`${route.path}`, isAuthenticated, require(`./routes/${route.file}.js`)));
// app.use('/api/v1/notes', isAuthenticated, require('./routes/notes'))
// app.use('/api/v1/folder', isAuthenticated, require('./routes/folder'))
// app.use('/api/v1/user', isAuthenticated, require('./routes/user.js'))
// app.use('/api/v1/admin', isAuthenticated, require('./routes/admin.js'))
// app.use('/auth',require('./routes/authRoutes.js'))
app.use(errorHandler)
app.listen(port, () => console.log(`Server listening on port ${port}!`))