// The User Model

var mongoose = require('mongoose');
var db = mongoose.connection;
var q = require('q');

//Define User SCHEMA
var profileSchema = mongoose.Schema({
  first_name : { type: String, required: true },
  last_name : { type: String, required: true },
  disciplines : [
                  { type: String, default: '' },
                  { type: String, default: '' }
                ]
});

/**
 * Input validations
 */

//function that checks first and last name for validity
profileSchema.validateName = function( name ) {
	 name = name.trim();
	 if ( /^[A-Za-z ]+$/.test( name ) ) {
		return {"success":true, "value":name};
	 } else {
		 return {"success":false , "code":0};
	 }
}

profileSchema.methods.validate = function( profile ) {

  var d = q.defer();
  var results = [];
  results['first_name_valid'] =  /^[a-zA-Z ']+$/.test( profile.first_name );
  results['last_name_valid'] =  /^[a-zA-Z ']+$/.test( profile.last_name );
  results['gender_valid'] =  profile.gender === true || profile.gender === false;

   d.resolve(results);
   return d.promise;
}

var Profile = mongoose.model('Profile', profileSchema);


module.exports = Profile;