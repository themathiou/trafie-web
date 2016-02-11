'use strict';

// Loading models
var User = require('../models/user.js'),
	Profile = require('../models/profile.js'),
	UserHashes = require('../models/userHashes.js');

// Loading helpers
var profileHelper = require('../helpers/profileHelper.js'),
	userHelper = require('../helpers/userHelper.js'),
	emailHelper = require('../helpers/emailHelper.js');


exports.request = {};

/**
 * Reset Password Request - POST
 */
exports.request.post = function(req, res) {
	var email = req.body.email;
	var userId = '';
	var firstName = '';
	var lastName = '';

	// Get the id of the user
	User.schema.findOne({
			'email': email
		}, 'email _id')
		.then(function(response) {
			// If the provided email wasn't found
			if (!response) {
                res.status(404).json({errors: ['OUTER.EMAIL_NOT_FOUND']});
				return;
			}
			userId = response._id;

			// Get the user's first name and last name, needed for the email
			return Profile.schema.findOne({
				'_id': userId
			}, 'firstName lastName');
		})
		.then(function(response) {
			firstName = response.firstName;
			lastName = response.lastName;

			// Create a new reset password hash
			return UserHashes.schema.createResetPasswordHash(userId);
		})
		.then(function(response) {
			// Send an email with the hash
			emailHelper.sendResetPasswordEmail(email, firstName, lastName, response, req.headers.host);
            res.status(200).json(response);
		})
		.catch(function(error) {
            sendError(error, res);
		});
};

/**
 * Reset Password - POST
 */
exports.post = function(req, res) {
	var password = req.body.password;
	var hash = req.params.hash;
	var errorMessages = [];
	var userId = '';

	// Generate post error messages
	if (!userHelper.validatePassword(password))
		errorMessages.push('Password should be at least 6 characters long');

	if (errorMessages.length) {
		res.status(400).json({errors: errorMessages});
		return;
	}

	// Check if the hash provided is valid. If it is, reset the password.
	UserHashes.schema.findUserIdByHash(hash, 'reset')
		.then(function(response) {
			if (response) {
				userId = response.userId;
				return User.schema.resetPassword(userId, password);
			} else {
				errorMessages.push('Invalid url');
				res.status(400).json({errors: errorMessages});
				return null;
			}
		})
		.then(function(user) {
            if(!user)
                res.status(400).json({errors: errorMessages});
			// Delete the hash
			UserHashes.schema.deleteHash(hash, 'reset');
			// Storing the user id in the session
            res.status(200).json({_id: userId, email: user.email});
		})
		.catch(function(error) {
            sendError(error, res);
		});
};


/**
 * Sends an error page in case a query fails
 * @param string error
 * @param object res
 */
function sendError(error, res) {
    res.status(500).json({errors: ['Something went wrong']});
}