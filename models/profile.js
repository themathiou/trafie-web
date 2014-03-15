// The User Model

var mongoose = require('mongoose');
var db = mongoose.connection;
var q = require('q');

//Define User SCHEMA
var profileSchema = mongoose.Schema({
  first_name	: { type: String, required: true },
  last_name		: { type: String, required: true },
  male			: { type: Boolean, required: false, default: null },
  birthday		: {
  					day: 	{ type: Number, required: false, default: null },
  					month: 	{ type: Number, required: false, default: null },
  					year: 	{ type: Number, required: false, default: null } 
   				  },
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

/**
 * Checks first and last name for validity
 */
profileSchema.validateName = function( name ) {
	return /^[A-Za-z ]+$/.test( name );
}

/**
 * Checks the birthday for validity
 */
profileSchema.validateBirthday = function( birthday ) {
	if( !isPositiveInteger( birthday.day ) || !isPositiveInteger( birthday.month ) || !isPositiveInteger( birthday.year ) ) {
		return false;
	}
	if( birthday.year < 1900 || birthday.year > 2010 || birthday.month > 12 ) {
		return false;
	}
	
	var leap_year = ( (birthday.year % 4 == 0) && (birthday % 100 != 0) ) || (birthday % 400 == 0);

	if( birthday.day > 31 ) {
		return false;
	}
	if( [4,6,9,11].indexOf( birthday.month ) >= 0  && birthday.day > 30 ) {
		return false;
	}
	if( ( birthday.month == 2 && !leap_year && birthday.day > 28 ) || ( birthday.month == 2 && leap_year && birthday.day > 29 ) ) {
		return false;
	}
	return true;
}

function isPositiveInteger( value ) {
	return typeof value !== 'undefined' && !isNaN( parseInt(value) ) && isFinite( value ) && value > 0 && value % 1 === 0;
}

var Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;