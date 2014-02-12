// The User Model

var mongoose = require('mongoose');
var db = mongoose.connection;
var q = require('q');

//Define User SCHEMA
var profileSchema = mongoose.Schema({
  first_name	: { type: String, required: true },
  last_name		: { type: String, required: true },
  disciplines	: [
                	{ type: String, default: '' },
                	{ type: String, default: '' }
               	  ]
});

/**
* Find user by element
* @param json where({email:someone@trafie.com})
* @param String select
*/
profileSchema.findOne = function( where, select ) {
	console.log('findOne-----------------------------------------------');
	console.log(Profile);
	var d = q.defer();
	Profile.findOne(where, select, function ( err, profile ) {
		d.resolve(profile);
	});
	return d.promise;
};

/**
* Save user profile
* @param object profile
*/
profileSchema.save = function( profile ) {
	console.log('SAVE-----------------------------------------------');
	console.log(Profile);
	var d = q.defer();

	Profile.save(function ( err, res ) {
		d.resolve(res);
	});

	return d.promise;
};

// Checks first and last name for validity
profileSchema.validateName = function( name ) {
	 return /^[A-Za-z ]+$/.test( name );
}

var Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;