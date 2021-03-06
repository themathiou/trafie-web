'use strict';

// Loading models
var User = require('../models/userModel'),
    Profile = require('../models/profileModel'),
    UserHashes = require('../models/userHashesModel');

// Loading helpers
var profileHelper = require('../helpers/profileHelper'),
    userHelper = require('../helpers/userHelper'),
    emailHelper = require('../helpers/emailHelper');

// Loading libraries
var passport = require('passport'),
    moment = require('moment');


exports.post = function(req, res) {
    if (req.session && typeof req.session.userId !== 'undefined') {
        res.redirect('/');
    }

    // Initializing the input values
    let firstName = '',
        lastName = '',
        email = '',
        password = '',
        ip = req.ip.substr(req.ip.lastIndexOf(':') + 1),
        errors = [];

    if(typeof req.body.firstName === 'string') {
        firstName = req.body.firstName.trim();
    } else {
        errors.push({
            resource: 'user',
            field: 'firstName',
            code: 'missing'
        });
    }
    if(typeof req.body.lastName === 'string') {
        lastName = req.body.lastName.trim();
    } else {
        errors.push({
            resource: 'user',
            field: 'lastName',
            code: 'missing'
        });
    }
    if(typeof req.body.email === 'string') {
        email = req.body.email.trim().toLowerCase();
    } else {
        errors.push({
            resource: 'user',
            field: 'email',
            code: 'missing'
        });
    }
    if(typeof req.body.password === 'string') {
        password = req.body.password;
    } else {
        errors.push({
            resource: 'user',
            field: 'password',
            code: 'missing'
        });
    }

    // Generating error messages
    if (typeof password === 'string' && !userHelper.validatePassword(password)) {
        errors.push({
            resource: 'user',
            field: 'password',
            code: 'invalid'
        });
    }
    if (typeof email === 'string' && !userHelper.validateEmail(email)) {
        errors.push({
            resource: 'user',
            field: 'email',
            code: 'invalid'
        });
    }
    if (typeof firstName === 'string' && !profileHelper.validateName(firstName)) {
        errors.push({
            resource: 'user',
            field: 'firstName',
            code: 'invalid'
        });
    }
    if (typeof lastName === 'string' && !profileHelper.validateName(lastName)) {
        errors.push({
            resource: 'user',
            field: 'lastName',
            code: 'invalid'
        });
    }

    // Checking if the given email already exists in the database
    User.schema.emailIsUnique(email).then(function(emailIsUnique) {
        // If the email is not unique, add it to the errors
        if(!emailIsUnique) {
            errors.push({
                resource: 'user',
                field: 'email',
                code: 'already_exists'
            });
        }

        // If there are any errors, show the messages to the user
        if (errors.length) {
            res.status(422).json({message: 'Invalid data', errors: errors});
            return;
        }

        var registrationsPastHour = new Promise(function(resolve, reject) {
            // Protect from scripts that create users automatically
            User.count({lastIp: ip, dateCreated: {$gte: moment.unix(moment().unix() - 3600).toDate()}}, function(err, count) {
                if(err) reject(err);
                else resolve(count);
            });
        });

        registrationsPastHour.then(function(count) {
            if(count >= 4) {
                res.status(403).json({message: 'Forbidden', errors: [{
                    resource: 'user',
                    code: 'user_registration_limit_per_hour'
                }]});
                return;
            }

            // Encrypting the password
            password = userHelper.encryptPassword(password);

            var newUser = {
                email: email,
                password: password,
                lastIp: ip,
                dateCreated: new Date(),
                lastActive: new Date()
            };

            var newProfile = {
                firstName: firstName,
                lastName: lastName
            };

            // Creating the user and profile objects
            var user = new User(newUser);

            // Saving the user and the profile data
            user.save(function(err, user) {
                if(err) {
                    res.status(500).json({message: 'Server error'});
                    return;
                }
                newProfile._id = user._id;
                var profile = new Profile(newProfile);
                Profile.schema.save(profile)
                    .then(function(profile) {
                        return UserHashes.schema.createVerificationHash(newUser.email, user._id);
                    })
                    .then(function(emailHash) {
                        emailHelper.sendVerificationEmail(newUser.email, newProfile.firstName, newProfile.lastName, emailHash);
                        res.status(201).json({_id: user._id});
                    })
                    .catch(function(error) {
                        res.status(500).json({message: 'Server error'});
                    });
            });
        })
        .catch(function(err) {
            res.status(500).json({message: 'Server error'});
        });
    })
    .catch(function(err) {
        res.status(500).json({message: 'Server error'});
    });
};
