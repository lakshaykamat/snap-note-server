require('dotenv').config();
require('./config/passport.js');
const express = require('express');
const connectDb = require('./config/db');
const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session');
const expressSession = require('express-session');
const isAuthenticated = require('./middleware/isAuthenticated.js');
const errorHandler = require('./middleware/errorHandler.js');
const ROUTES = require('./constants/ROUTES.js');
const User = require('./models/User.js');
const bcrypt = require('bcrypt');
const { generateAvatar } = require('./utils/generateAvatar.js');
const { isVaildEmail } = require('./utils/isEmail.js');


// Connecting to Database
connectDb();

// Initializing app
const app = express();

// Middleware setup
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_SECRET]
}));
app.use(expressSession({
    secret: 'secret', resave: false, saveUninitialized: false
}));
app.use(passport.session());
app.use(passport.initialize());


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
        failureRedirect: '/error',
        successRedirect: '/',
    }));

app.get('/error',(req,res)=>{
    res.send("Something went wrong")
})

app.post('/auth/register', errorHandler, async (req, res, next) => {
    const { username, password, email } = req.body;

    if(!isVaildEmail(email)) return res.status(401).json({error:true,message:"Invalid Email"})
    if(!password) return res.status(401).json({error:true,message:"Password field can't be empty"})

    try {
        const user = await User.findOne({ email, username });
        if (user) {
            res.status(400);
            throw new Error("User already exists");
        } else {
            const hash = await bcrypt.hash(password, 10);
            const avatar = generateAvatar(email)
            const user = { username, password: hash, email,avatar };
            const newUser = await User.create(user);
            return res.status(201).json(newUser);
        }
    } catch (error) {
        return next(error);
    }
});



app.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

// Set up view engine
app.set('view engine', 'pug');
app.set('views', './views');

// Use the 'auth' route

// Set up Pug template routes
ROUTES.PUG.forEach(route => {
    app.use(route.path, require(`./views/routes/${route.file}.js`));
});

// Set up REST API routes with authentication
ROUTES.REST_API.forEach(route => {
    app.use(`/api/v1${route.path}`, require(`./routes/${route.file}.js`));
});

// Global error handler
app.use(errorHandler);

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server listening on port ${port}!`));