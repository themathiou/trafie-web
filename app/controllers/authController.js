const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    BasicStrategy = require('passport-http').BasicStrategy,
    ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy,
    crypto = require('crypto');

var userHelper = require('../helpers/userHelper');

// Loading models
var User = require('../models/userModel'),
    Token = require('../models/tokenModel'),
    Client = require('../models/clientModel');

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

passport.use('client-basic', new BasicStrategy(
    function(clientId, clientSecret, callback) {
        Client.findOne({ id: clientId }, function (err, client) {
            if (err) { return callback(err); }

            // No client found with that id or bad password
            if (!client || client.secret !== clientSecret) { return callback(null, false); }

            // Success
            return callback(null, client);
        });
    }
));

passport.use('client-password', new ClientPasswordStrategy(
    function(clientId, clientSecret, callback) {
        Client.findOne({ id: clientId }, function (err, client) {
            if (err) { return callback(err); }

            // No client found with that id or bad password
            if (!client || client.secret !== clientSecret) { return callback(null, false); }

            // Success
            return callback(null, client);
        });
    }
));


passport.use(new BearerStrategy(
    function(accessToken, callback) {
        var hashedToken = crypto.createHash('sha512').update('23tR@Ck@nDF!3lD04T0k3N' + accessToken).digest('hex');

        Token.findOne({value: hashedToken }, function (err, token) {
            if (err) { return callback(err); }

            // No token found
            if (!token) { return callback(null, false); }

            User.findOne({ _id: token.userId }, function (err, user) {
                if (err) { return callback(err); }

                // No user found
                if (!user) { return callback(null, false); }

                // Simple example with no scope
                callback(null, user, { scope: '*' });
            });
        });
    }
));


//exports.isAuthenticated = passport.authenticate(['bearer']);
exports.isClientAuthenticated = passport.authenticate('client-basic', { session : false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });