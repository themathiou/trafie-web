const redis = require('redis'),
	redisClient = redis.createClient(),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

var userHelper = require('../helpers/userHelper.js');

// Loading models
var User = require('../models/user.js');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    User.schema.findOne({_id: user._id})
        .then(function(user) {
            done(null, user);
        })
        .catch(function(error) {
            done(true, null)
        });
});

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        User.findOne({ email: email }, function(err, user) {
            if(err) { return done(err); }
            if(!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }
            if(user.password !== userHelper.encryptPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));