'use strict';

// Loading models
var User = require('../models/userModel'),
	Profile = require('../models/profileModel'),
	UserHashes = require('../models/userHashesModel');

// Loading helpers
var profileHelper = require('../helpers/profileHelper'),
	userHelper = require('../helpers/userHelper'),
	emailHelper = require('../helpers/emailHelper');


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
                res.status(404).json({message: 'Resource not found', errors: [{
					resource: 'user',
					code: 'not_found'
				}]});
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
		.then(function(hash) {
			// Send an email with the hash
			emailHelper.sendResetPasswordEmail(email, firstName, lastName, hash);
            res.status(200).json(hash);
		})
		.catch(function(error) {
            res.status(500).json({message: 'Server error'});
		});
};

/**
 * Reset Password - POST
 */
exports.post = function(req, res) {
	var password = req.body.password;
	var hash = req.params.hash;
	var userId = '';

	// Generate post error messages
	if (!userHelper.validatePassword(password)) {
		res.status(422).json({message: 'Invalid data', errors: [{
			resource: 'user',
			field: 'password',
			code: 'invalid'
		}]});
		return;
	}

	// Check if the hash provided is valid. If it is, reset the password.
	UserHashes.schema.findUserIdByHash(UserHashes.schema.encryptUserHash(hash, 'reset'), 'reset')
		.then(function(response) {
			if (response) {
				userId = response.userId;
				return User.schema.resetPassword(userId, password);
			} else {
				res.status(404).json({message: 'Resource not found', errors: [{
					resource: 'userHash',
					code: 'not_found'
				}]});
				return null;
			}
		})
		.then(function(user) {
            if(!user)
                res.status(404).json({message: 'Resource not found', errors: [{
					resource: 'user',
					code: 'not_found'
				}]});
			// Delete the hash
			UserHashes.schema.deleteHash(hash, 'reset');
			// Storing the user id in the session
            res.status(200).json({_id: userId, email: user.email});
		})
		.catch(function(error) {
            res.status(500).json({message: 'Server error'});
		});
};