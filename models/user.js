// The User Model

var mongoose = require('mongoose');
var db = mongoose.connection;

//Define User SCHEMA
var userSchema = mongoose.Schema({
  first_name : { type: String, required: true },
  last_name : { type: String, required: true },
  email : { type: String, required: true, unique: true },
  password : { type: String, required: true },
  gender : { type: String, required: true }
});

var User = mongoose.model('User', userSchema);

/**
 * Input validations
 */
User.schema.path('first_name').validate(function (value) {
  return /^[a-zA-Z ']+$/.test(value);
}, 'invalid');

User.schema.path('last_name').validate(function (value) {
  return /^[a-zA-Z ']+$/.test(value);
}, 'invalid');

User.schema.path('email').validate(function (value) {
  return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
}, 'invalid');

User.schema.path('email').validate(function (value, cb) {
	User.findOne({ 'email': value }, 'email', function ( err, user ) {
  	  cb( user == null );
  	});
}, 'duplicate');

User.schema.path('gender').validate(function (value) {
  return /male|female/i.test(value);
}, 'invalid');

module.exports = User;