'use strict';

// Loading models
var User = require('../models/user.js'),
	Profile = require('../models/profile.js'),
	UserHashes = require('../models/user_hashes.js');

// Loading helpers
var profileHelper = require('../helpers/profileHelper.js'),
	userHelper = require('../helpers/userHelper.js');

// Loading libraries
var Email = require('../libs/email');


exports.request = {};


/**
 * Reset Password Request - GET
 */
exports.request.get = function(req, res) {
	if (typeof req.session.user_id !== 'undefined') {
		res.redirect('/');
	}

	var view_data = {
		'error': ''
	};
	res.render('reset_password_request', view_data);
};


/**
 * Reset Password Request - POST
 */
exports.request.post = function(req, res) {
	if (typeof req.session.user_id !== 'undefined') {
		res.redirect('/');
	}

	var email = req.body.email;
	var user_id = '';
	var first_name = '';
	var last_name = '';
	var view_data = {
		'error': ''
	};

	// Get the id of the user
	User.schema.findOne({
			'email': email
		}, 'email _id')
		.then(function(response) {
			// If the provided email wasn't found
			if (!response) {
				view_data.error = 'Email not found';
				res.render('reset_password_request', view_data);
				return;
			}
			user_id = response._id;

			// Get the user's first name and last name, needed for the email
			return Profile.schema.findOne({
				'_id': user_id
			}, 'first_name last_name');
		})
		.then(function(response) {
			first_name = response.first_name;
			last_name = response.last_name;

			// Create a new reset password hash
			return UserHashes.schema.createResetPasswordHash(user_id);
		})
		.then(function(response) {
			// Send an email with the hash
			Email.send_reset_password_email(email, first_name, last_name, response, req.headers.host);
			view_data.email = email;
			res.render('reset_password_email_sent', view_data);
		})
		.fail(function(error) {
			send_error_page(error, res);
		});
};


/**
 * Reset Password - GET
 */
exports.get = function(req, res) {
	var view_data = {
		'errors': {
			'password': '',
			'repeat_password': ''
		}
	};

	// The user is allowed to view this screen only if he is led here
	// by a valid hash that was sent to their email. Otherwise, they get redirected
	UserHashes.schema.findUserIdByHash(req.params.hash, 'reset')
		.then(function(response) {
			if (response) {
				res.render('reset_password', view_data);
			} else {
				res.redirect('/login');
			}
		})
		.fail(function(error) {
			send_error_page(error, res);
		});
};

/**
 * Reset Password - POST
 */
exports.post = function(req, res) {
	var password = req.body.password;
	var repeat_password = req.body.repeat_password;
	var hash = req.params.hash;
	var errors = false;
	var view_data = {
		'errors': {
			'password': '',
			'repeat_password': ''
		}
	};
	var user_id = '';

	// Generate post error messages
	if (!userHelper.validatePassword(password)) {
		errors = true;
		view_data.errors.password = 'Password should be at least 6 characters long';
	}
	if (password != repeat_password) {
		errors = true;
		view_data.errors.repeat_password = 'Passwords do not match';
	}

	if (errors) {
		res.render('reset_password', view_data);
	}

	// Check if the hash provided is valid. If it is, reset the password.
	UserHashes.schema.findUserIdByHash(hash, 'reset')
		.then(function(response) {
			if (response) {
				user_id = response.user_id;
				return User.schema.resetPassword(user_id, password);
			} else {
				res.redirect('/login');
			}
		})
		.then(function() {
			// Delete the hash
			UserHashes.schema.deleteHash(hash, 'reset');
			// Storing the user id in the session
			req.session.user_id = user_id;
			res.redirect('/');
		})
		.fail(function(error) {
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
	res.sendfile('./views/five_oh_oh.html');
}
