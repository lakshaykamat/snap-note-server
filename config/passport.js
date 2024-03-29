const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.SERVER_URL + "/auth/google/callback",
    passReqToCallback: true
},
    async function (request, accessToken, refreshToken, profile, done) {
        try {
            const user = await User.findOne({ googleId: profile.id })
            if (!user) {
                const newUser = await User.create({
                    googleId: profile.id,
                    username: profile._json.name,
                    bio:"",
                    avatar: profile._json.picture,
                    email: profile._json.email
                })
                return done(null, newUser);
            }
            if (user) {
                return done(null, user);
            }
        } catch (error) {
            done(error, null)
        }

    }
));

passport.use(new LocalStrategy(
    async function (username, password, done) {
        try {
            const user = await User.findOne({ email:username })
            if (!user) return done(null, false)
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return done(null, false);
            return done(null, user)
        } catch (error) {
            return done(error, false)
        }

    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
})


passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id)
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});