// The User Model
var mongoose = require('mongoose'),
	q = require('q'),
	crypto = require('crypto'),
	userHelper = require('../helpers/user.js');
	db = mongoose.connection;


//Define User SCHEMA
var userSchema = mongoose.Schema({
  email 	: { type: String, required: true, unique: true, index: true },
  password 	: { type: String, required: true },
  valid		: { type: Boolean, required: true, default: false}
});

/**
* Find user by element
* @param json where( { email: someone@trafie.com } )
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
 * Resets user's password
 * @param string user_id
 * @param string password
 */
userSchema.resetPassword = function( user_id, password ) {
	var d = q.defer();
	password = userHelper.encryptPassword( password );
	User.findByIdAndUpdate( user_id, { password: password }, '', function ( err, user ) {
		d.resolve(user);
	});
	return d.promise;
};

/**
 * Checks if the email exists in the database
 * @param email
 */
userSchema.emailIsUnique = function( email ) {
	var d = q.defer();
	User.findOne({'email': email}, '_id', function ( err, user ) {
		d.resolve(!user);
	});
	return d.promise;
};

var User = mongoose.model('User', userSchema);

module.exports = User;