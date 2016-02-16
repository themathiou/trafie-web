'use strict';

// Loading models
var User = require('../models/user.js'),
	Profile = require('../models/profile.js'),
	UserHashes = require('../models/userHashes.js');

// Loading helpers
var profileHelper = require('../helpers/profileHelper.js'),
	userHelper = require('../helpers/userHelper.js'),
	emailHelper = require('../helpers/emailHelper.js');

// Loading libraries
var passport = require('passport');


exports.post = function(req, res) {
	if (typeof req.session.userId !== 'undefined') {
		res.redirect('/');
	}

	var errorMessages = {};
	var errors = false;

	// Initializing the input values
	var firstName = typeof req.body.firstName !== 'undefined' ? req.body.firstName.trim() : '';
	var lastName = typeof req.body.lastName !== 'undefined' ? req.body.lastName.trim() : '';
	var email = typeof req.body.email !== 'undefined' ? req.body.email.trim().toLowerCase() : '';
	var password = typeof req.body.password !== 'undefined' ? req.body.password : '';

	// Generating error messages
	if (!password) {
		errorMessages.password = 'Password is required';
		errors = true;
	} else if (!errors && !userHelper.validatePassword(password)) {
        errorMessages.password = 'Password should be at least 6 characters long';
		errors = true;
	}
	if (!email) {
        errorMessages.email = 'Email is required';
		errors = true;
	} else if (!userHelper.validateEmail(email)) {
        errorMessages.email = 'Email is not valid';
		errors = true;
	}
	if (!firstName) {
        errorMessages.firstName = 'First name is required';
		errors = true;
	} else if (!profileHelper.validateName(firstName)) {
        errorMessages.firstName = 'First name can only have latin characters';
		errors = true;

	}
	if (!lastName) {
        errorMessages.lastName = 'Last name is required';
		errors = true;
	} else if (!profileHelper.validateName(lastName)) {
        errorMessages.lastName = 'Last name can only have latin characters';
		errors = true;
	}

	// Checking if the given email already exists in the database
	User.schema.emailIsUnique(email).then(function(unique_email) {
		// If the email is not unique, add it to the errors
		if (!unique_email) {
            errorMessages.email = 'Email is already in use';
			errors = true;
		}

		// If there are any errors, show the messages to the user
		if (errors) {
			res.status(400).json({errors: errorMessages});
			return;
		}

		// Encrypting the password
		password = userHelper.encryptPassword(password);

		var newUser = {
			email: email,
			password: password
		};

		var newProfile = {
			firstName: firstName,
			lastName: lastName
		};

		// Creating the user and profile objects
		var user = new User(newUser);

		// Saving the user and the profile data
		user.save(function(err, user) {
            newProfile._id = user._id;
			var profile = new Profile(newProfile);
			Profile.schema.save(profile)
				.then(function(profile) {
					return UserHashes.schema.createVerificationHash(newUser.email, user._id);
				})
				.then(function(emailHash) {
					emailHelper.sendVerificationEmail(newUser.email, newProfile.firstName, newProfile.lastName, emailHash);
					res.status(201).json({_id: user._id});
				});
		});

	});
};
