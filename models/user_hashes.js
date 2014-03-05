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
  user_id : { type: String, required: true, index: true, unique: true },
  hash : { type: String, required: true },
  type : { type: String, required: true }
});


/**
 * Returns the user id of the user to whom the hash was sent
 * @param string hash
 */
userHashSchema.findUserIdByValidationHash = function( hash ) {
	var d = q.defer();
	User_hash.findOne({ 'hash': hash, 'type': 'verify' }, 'user_id hash', function ( err, response ) {
		d.resolve(response);
	});
	return d.promise;
};


/**
 * Returns the user id of the user to whom the hash was sent
 * @param string hash
 */
userHashSchema.findValidationHashByUserId = function( user_id ) {
	var d = q.defer();
	User_hash.findOne({ 'user_id': user_id, 'type': 'verify' }, 'user_id hash', function ( err, response ) {
		d.resolve(response);
	});
	return d.promise;
};


/**
 * Find user by element
 * @param json where({email:someone@trafie.com})
 * @param String select
 */
userHashSchema.deleteValidationHash = function( hash ) {
	var d = q.defer();
	User_hash.find({ 'hash': hash, 'type': 'verify' }).remove( function ( err, response ) {
		d.resolve( response );
	});
	return d.promise;
};


/**
 * Create and save verification hash
 */
userHashSchema.createVerificationHash = function ( email, user_id ) {
	var sha512Hash = crypto.createHash('sha512');
	sha512Hash.update('23tR@Ck@nDF!3lD04' + email + (new Date().getTime()) );

	//the verification hash
	var hash = sha512Hash.digest('hex');
	var d = q.defer();
	var new_user_hash = {
		'user_id':	user_id,
		'hash':		hash,
		'type':		'verify'
	};

	var user_hash = new User_hash(new_user_hash);

	user_hash.save( function( err, user_hash ) {
		d.resolve(new_user_hash.hash);
	});

	return d.promise;
};


var User_hash = mongoose.model('User_hash', userHashSchema);

module.exports = User_hash;