// The User Model

var mongoose = require('mongoose');
var db = mongoose.connection;
var q = require('q');

//Define User SCHEMA
// Gender: 1 = male, 0 = female
var profileSchema = mongoose.Schema({
  first_name : { type: String, required: true },
  last_name : { type: String, required: true },
  gender : { type: Boolean, required: true },
  country : { type: String, default: '' },
  major_accomplishments : { type: String, default: '' },
  nickname : { type: String, index: true, default: '' },
  disciplines : [
                  { type: String, default: '' },
                  { type: String, default: '' }
                ]
});

/**
 * Input validations
 */
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