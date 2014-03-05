// The User Model

var mongoose = require('mongoose');
var q = require('q');
var crypto = require('crypto');
var db = mongoose.connection;


//Define User SCHEMA
var userSchema = mongoose.Schema({
  email 	: { type: String, required: true, unique: true, index: true },
  password 	: { type: String, required: true },
  valid		: { type: Boolean, required: true, default: false}
});

/**
* Find user by element
* @param json where({email:someone@trafie.com})
* @param String select
*/
userSchema.findOne = function( where, select ) {
	var d = q.defer();
	User.findOne(where, select, function ( err, user ) {
		d.resolve(user);
	});
	return d.promise;
};

/**
* Encrypt password using sha512_hash
* @param String password
*/
userSchema.encryptPassword = function ( password ) {
	var sha512Hash = crypto.createHash('sha512');
	sha512Hash.update('23tR@Ck@nDF!3lD04' + password);

	// Return the encrypted password
	return sha512Hash.digest('hex');
};

/**
 * Checks email for validity
 */
userSchema.validateEmail = function( email ) {
	 return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test( email );
};

/**
 * Checks password for validity
 */
userSchema.validatePassword = function( password ) {
	 // The password should have at least 6 characters
	 return password.length >= 6
};

/**
 * Checks if the email exists in the database
 */
userSchema.emailIsUnique = function( email ) {
	var d = q.defer();
	User.findOne({'email': email}, '_id', function ( err, user ) {
		d.resolve(!user);
	});
	return d.promise;
};

userSchema.validateUser = function( user_id ) {
	var d = q.defer();
	User.findByIdAndUpdate( user_id, { valid: true }, '', function ( err, user ) {
		d.resolve(!user);
	});
	return d.promise;
};

var User = mongoose.model('User', userSchema);

module.exports = User;