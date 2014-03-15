// The User Model

var mongoose = require('mongoose');
var db = mongoose.connection;
var q = require('q');

//Define User SCHEMA
var profileSchema = mongoose.Schema({
  first_name	: { type: String, required: true },
  last_name		: { type: String, required: true },
  male			: { type: Boolean, required: false, default: null },
  age 			: { type: Number, required: false, default: 0 },
  discipline	: { type: String, required: false, default: '' },
  about 		: { type: String, required: false, default: '' },
  country 		: { type: String, required: false, default: '' },
  picture 		: { type: String, required: false, default: '' }
});

/**
* Find user by element
* @param json where({email:someone@trafie.com})
* @param String select
*/
profileSchema.findOne = function( where, select ) {
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
	var d = q.defer();

	profile.save(function ( err, res ) {
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