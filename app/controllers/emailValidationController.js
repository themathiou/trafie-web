'use strict';

// Loading models
const User = require('../models/user.js'),
	Profile = require('../models/profile.js'),
	UserHashes = require('../models/user_hashes.js');

// Loading helpers
const userHelper = require('../helpers/userHelper.js');

const Email = require('../libs/email');


/**
 * Email validation - GET
 * Shows a page that just informs the user to check their email
 * in order to validate their account
 */
exports.validation_email_sent = function(req, res) {
	if (typeof req.session.userId !== 'undefined') {
		res.redirect('/');
	}

	var userId = req.params.userId;
	User.schema.findOne({
		'_id': userId
	}, 'email valid')
	.then(function(response) {
		if (!response.email || response.valid) {
			res.redirect('/login');
		}

		res.render('validation_email_sent', {
			'email': response.email,
			'resend': req.params.resend,
			'userId': userId
		});
	})
	.catch(function(error) {
		send_error_page(error, res);
	});
};


/**
 * Validate - GET
 * Validates the newly created user
 */
exports.validate = function(req, res) {
	if (typeof req.session.userId !== 'undefined') {
		res.redirect('/');
	}

	var userId = '';
	// Find the user to whom the hash belongs
	UserHashes.schema.findUserIdByHash(req.params.hash, 'verify')
	.then(function(response) {
		if (response) {
			userId = response.userId;
			// Validate the user
			return userHelper.validateUser(response.userId);
		} else {
			res.redirect('/login');
		}
	})
	.then(function() {
		// Delete the hash after validation
		UserHashes.schema.deleteHash(req.params.hash, 'verify');
		// Storing the user id in the session
		req.session.userId = userId;
		res.redirect('/');
	})
	.catch(function(error) {
		send_error_page(error, res);
	});
};


/**
 * Resend validation email - GET
 * Resends the validation email
 */
exports.resend_validation_email = function(req, res) {
	if (typeof req.session.userId !== 'undefined') {
		res.redirect('/');
	}

	var email = '';
	var firstName = '';
	var lastName = '';
	var userId = req.params.userId;
	User.schema.findOne({
		'_id': userId
	}, 'email valid')
	.then(function(response) {
		// If the email wasn't found or the user is already valid
		if (!response.email || response.valid) {
			res.redirect('/login');
		}
		email = response.email;
		// Find the user's first name and last name
		return Profile.schema.findOne({
			'_id': userId
		}, 'firstName lastName');
	})
	.then(function(response) {
		firstName = response.firstName;
		lastName = response.lastName;
		// Find the validation has that was stored in the db for the user
		return UserHashes.schema.findValidationHashByUserId(userId);
	})
	.then(function(response) {
		// Send an email with the hash to the user
		Email.send_verification_email(email, firstName, lastName, response.hash, req.headers.host);

		res.redirect('/validation_email_sent/1/' + userId);
	})
	.catch(function(error) {
		send_error_page(error, res);
	});
};

/**
 * Sends an error page in case a query fails
 * @param string error
 * @param object res
 */
function send_error_page(error, res) {
	res.statusCode = 500;
	res.sendFile('../views/five_oh_oh.html',  {"root": __dirname});
}
