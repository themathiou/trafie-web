var crypto = require('crypto');

var userHelper = {};


/**
* Encrypt password using sha512_hash
* @param String password
*/
userHelper.encryptPassword = function ( password ) {
	var sha512Hash = crypto.createHash('sha512');
	sha512Hash.update('23tR@Ck@nDF!3lD04' + password);

	// Return the encrypted password
	return sha512Hash.digest('hex');
};

/**
 * Checks email for validity
 * @param string email
 * @return boolean
 */
userHelper.validateEmail = function( email ) {
	 return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test( email );
};

/**
 * Checks password for validity
 * @param string password
 * @return boolean
 */
userHelper.validatePassword = function( password ) {
	 // The password should have at least 6 characters
	 return password.length >= 6;
};

/**
 * Makes the user valid
 * @param string user_id
 */
userHelper.validateUser = function( user_id ) {
	var d = q.defer();
	User.findByIdAndUpdate( user_id, { valid: true }, '', function ( err, user ) {
		d.resolve(!user);
	});
	return d.promise;
};


module.exports = userHelper;