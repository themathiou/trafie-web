'use strict';

// The User Model

var mongoose = require('mongoose');
var q = require('q');
var crypto = require('crypto');

/**
 * Define User_Hashes SCHEMA
 * @param type string (valid input is ['verify', 'reset'])
 */
var userHashSchema = mongoose.Schema({
	userId: 	{type: String, required: true},
	hash: 		{type: String, required: true},
	type: 		{type: String, required: true},
	dateCreated:{ type: Date }
});

userHashSchema.pre('save', function(next){
	var now = new Date();
	this.dateUpdated = now;
	if ( !this.dateCreated ) {
		this.dateCreated = now;
	}
	next();
});

/**
 * Returns the user id of the user to whom the hash was sent
 * @param string hash
 * @param string type (can be 'verify' and 'reset')
 */
userHashSchema.findUserIdByHash = function(hash, type) {
	var d = q.defer();
	UserHash.findOne({
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
	UserHash.findOne({
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
	UserHash.find({
		'hash': hash,
		'type': type
	}).remove(function(err, response) {
		d.resolve(response);
	});
	return d.promise;
};

userHashSchema.encryptUserHash = function(hash, type) {
    var salt = type === 'reset' ? process.env.RESET_PASSWORD_SALT || 'resetPasswordSalt' : process.env.EMAIL_VERIFICATION_SALT || 'emailVerificationSalt';
    var sha512Hash = crypto.createHash('sha512');
    sha512Hash.update(salt + hash);
    return sha512Hash.digest('hex');
};

/**
 * Create and save verification hash
 * @param string email
 * @param string userId
 */
userHashSchema.createVerificationHash = function(email, userId) {
    var hash = userHashSchema.encryptUserHash(email + (new Date().getTime()), 'verify');
    var encryptedHash = userHashSchema.encryptUserHash(hash, 'verify');
	var d = q.defer();
	var newUserHash = {
		'userId': userId,
		'hash': encryptedHash,
		'type': 'verify'
	};

	var userHash = new UserHash(newUserHash);

	userHash.save(function(err, userHash) {
		d.resolve(hash);
	});

	return d.promise;
};

/**
 * Create and save reset password hash
 * @param string userId
 */
userHashSchema.createResetPasswordHash = function(userId) {
	var d = q.defer();
	UserHash.remove({
		'userId': userId,
		'type': 'reset'
	}, function(err) {
		if(err) d.reject(err);
        var hash = userHashSchema.encryptUserHash(userId + (new Date().getTime()), 'reset');
        var encryptedHash = userHashSchema.encryptUserHash(hash, 'reset');
        var newUserHash = {
            'userId': userId,
            'hash': encryptedHash,
            'type': 'reset'
        };
        var userHash = new UserHash(newUserHash);

        userHash.save(function(err) {
            console.log(err);
            if(err) d.reject(err);
            d.resolve(hash);
        });
	});

	return d.promise;
};

var UserHash = mongoose.model('UserHash', userHashSchema);

module.exports = UserHash;
