'use strict';

// The User Model

var mongoose = require('mongoose');
var q = require('q');
var crypto = require('crypto');
var db = mongoose.connection;

/**
 * Define User_Hashes SCHEMA
 * @param type string (valid input is ['verify', 'reset'])
 */
var userHashSchema = mongoose.Schema({
	userId: 	{type: String, required: true, index: true, unique: true},
	hash: 		{type: String, required: true},
	type: 		{type: String, required: true}
});


/**
 * Returns the user id of the user to whom the hash was sent
 * @param string hash
 * @param string type (can be 'verify' and 'reset')
 */
userHashSchema.findUserIdByHash = function(hash, type) {
	var d = q.defer();
	User_hash.findOne({
		'hash': hash,
		'type': type
	}, 'userId hash', function(err, response) {
		d.resolve(response);
	});
	return d.promise;
};


/**
 * Returns the validation hash that was sent to the given user
 * @param string userId
 */
userHashSchema.findValidationHashByUserId = function(userId) {
	var d = q.defer();
	User_hash.findOne({
		'userId': userId,
		'type': 'verify'
	}, 'userId hash', function(err, response) {
		d.resolve(response);
	});
	return d.promise;
};


/**
 * Delete a hash
 * @param string hash
 * @param string type (can be 'verify' and 'reset')
 */
userHashSchema.deleteHash = function(hash, type) {
	var d = q.defer();
	User_hash.find({
		'hash': hash,
		'type': type
	}).remove(function(err, response) {
		d.resolve(response);
	});
	return d.promise;
};


/**
 * Create and save verification hash
 * @param string email
 * @param string userId
 */
userHashSchema.createVerificationHash = function(email, userId) {
	var sha512Hash = crypto.createHash('sha512');
	sha512Hash.update('23tR@Ck@nDF!3lD04' + email + (new Date().getTime()));

	// The verification hash
	var hash = sha512Hash.digest('hex');
	var d = q.defer();
	var new_user_hash = {
		'userId': userId,
		'hash': hash,
		'type': 'verify'
	};

	var user_hash = new User_hash(new_user_hash);

	user_hash.save(function(err, user_hash) {
		d.resolve(new_user_hash.hash);
	});

	return d.promise;
};


/**
 * Create and save reset password hash
 * @param string userId
 */
userHashSchema.createResetPasswordHash = function(userId) {
	var d = q.defer();
	User_hash.findOne({
		'userId': userId,
		'type': 'reset'
	}, 'userId hash', function(err, response) {
		if (response !== null && typeof response.hash !== 'undefined') {
			d.resolve(response.hash);
		} else {
			var sha512Hash = crypto.createHash('sha512');
			sha512Hash.update('23tR@Ck@nDF!3lD04' + userId + (new Date().getTime()));

			// The reset password hash
			var hash = sha512Hash.digest('hex');
			var new_user_hash = {
				'userId': userId,
				'hash': hash,
				'type': 'reset'
			};

			var user_hash = new User_hash(new_user_hash);

			user_hash.save(function(err, user_hash) {
				d.resolve(new_user_hash.hash);
			});
		}
	});

	return d.promise;
};


var User_hash = mongoose.model('User_hash', userHashSchema);

module.exports = User_hash;
