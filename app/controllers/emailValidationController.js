'use strict';

// Loading models
const User = require('../models/userModel'),
	Profile = require('../models/profileModel'),
	UserHashes = require('../models/userHashesModel');

// Loading helpers
const userHelper = require('../helpers/userHelper'),
    emailHelper = require('../helpers/emailHelper');

/**
 * Validate - GET
 * Validates the newly created user
 */
exports.validate = function(req, res) {
	// Find the user to whom the hash belongs
    var encryptedHash = UserHashes.schema.encryptUserHash(req.params.hash, 'verify');
	UserHashes.schema.findUserIdByHash(encryptedHash, 'verify')
	.then(function(response) {
		if (response) {
			// Validate the user
			return userHelper.validateUser(response.userId);
		} else {
			return false;
		}
	})
	.then(function(validated) {
        if(validated) {
            // Delete the hash after validation
            UserHashes.schema.deleteHash(encryptedHash, 'verify');
            // Storing the user id in the session
            res.json(null);
        } else {
            res.status(404).json({message: 'Resource not found', errors: [{
                resource: 'userHash',
                code: 'not_found'
            }]});
        }
	})
	.catch(function(error) {
        res.status(500).json({message: 'Server error'});
	});
};


/**
 * Resend validation email - GET
 * Resends the validation email
 */
exports.resendEmail = function(req, res) {
    // Get the user id from the session
    var userId = req.user && req.user._id || null;
    // If there is no user id, or the user id is different than the one in the session
    if (!userId) {
        res.status(403).json({message: 'Forbidden'});
        return;
    }

	var email = '',
	    firstName = '',
	    lastName = '',
        responseSent = false;
	User.schema.findOne({
		'_id': userId
	}, 'email isValid')
	.then(function(response) {
        if (!response.email) {
            res.status(404).json({message: 'Resource not found', errors: [{
                resource: 'user',
                code: 'not_found'
            }]});
            responseSent = true;
        }
		if (response.isValid) {
            res.status(422).json({message: 'Invalid data', errors: [{
                resource: 'user',
                field: 'valid',
                code: 'already_processed'
            }]});
            responseSent = true;
		}
		email = response.email;
		// Find the user's first name and last name
		return Profile.schema.findOne({
			'_id': userId
		}, 'firstName lastName');
	})
	.then(function(response) {
        if(response) {
            firstName = response.firstName;
            lastName = response.lastName;
            return UserHashes.schema.createVerificationHash(email, userId);
        } else {
            return false;
        }
	})
	.then(function(response) {
        if(response) {
            // Send an email with the hash to the user
            emailHelper.sendVerificationEmail(email, firstName, lastName, response);
            res.json(null);
        }
        else if(!responseSent) {
            res.status(404).json({message: 'Resource not found', errors: [{
                resource: 'user',
                code: 'not_found'
            }]});
        }
	})
	.catch(function(error) {
        res.status(500).json({message: 'Server error'});
	});
};