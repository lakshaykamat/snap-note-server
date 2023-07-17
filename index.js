
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
const errorHandler = require('./middleware/errorHandler.js')

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
// app.use(express.urlencoded({extended:true}))
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_SECRET]
}))
// app.use(expressSession({
//     secret:'secret',resave:false,saveUninitialized:false
// }))
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

app.post('/login', 
  passport.authenticate('local', { 
    failureRedirect: process.env.CLIENT_URL + '/fail',
}),(req,res)=>{
    res.send("success")
});

  app.post('/register', errorHandler,async(req, res,next) => {
    const { username, password, email } = req.body;
  
    try {
        const user = await User.findOne({email,username})
    console.log(user)
    if(user){
        res.status(400) 
        throw new Error("User already exists")
    }else{
        const newUser = await User.create({username,password:await bcrypt.hash(password, 10),email}) 
        return res.status(201).json(newUser)
    }
    } catch (error) {
        return next(error)
    }
    // Check if a user with the same username or email already exists
    

  });  


  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect(process.env.CLIENT_URL+'/login');
  });

//---API Routes---
app.use('/api/v1/notes', isAuthenticated, require('./routes/notes'))
app.use('/api/v1/folder', isAuthenticated, require('./routes/folder'))
app.use('/api/v1/user', require('./routes/user.js'))
app.use(errorHandler)
app.listen(port, () => console.log(`Server listening on port ${port}!`))