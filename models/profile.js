// The User Model

var mongoose = require('mongoose');
var db = mongoose.connection;

//Define User SCHEMA
// Gender: 1 = male, 0 = female
var profileSchema = mongoose.Schema({
  first_name : { type: String, required: true },
  last_name : { type: String, required: true },
  gender : { type: Boolean, required: true },
  country : { type: String },
  major_accomplishments : { type: String },
  nickname : { type: String, index: true },
  disciplines : [
                  0: { type: String },
                  1: { type: String }
                ]
});

var Profile = mongoose.model('Profile', profileSchema);

/**
 * Input validations
 */
Profile.schema.path('first_name').validate(function (value) {
  return /^[a-zA-Z ']+$/.test(value);
}, 'invalid');

Profile.schema.path('last_name').validate(function (value) {
  return /^[a-zA-Z ']+$/.test(value);
}, 'invalid');

Profile.schema.path('gender').validate(function (value) {
  return /male|female/i.test(value);
}, 'invalid');

module.exports = Profile;