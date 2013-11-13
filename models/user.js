// The User Model

var mongoose = require('mongoose');
var db = mongoose.connection;

//Define User SCHEMA
var userSchema = mongoose.Schema({
  first_name : { type: String, required: '{VALUE} is required!' },
  last_name : { type: String, required: '{VALUE} is required!' },
  email : { type: String, required: true },
  password : { type: String, required: true },
  gender : { type: String, required: true }
});

var User = mongoose.model('User', userSchema);

/**
 * Input validations
 */
User.schema.path('first_name').validate(function (value) {
  return /^[a-zA-Z ']+$/.test(value);
}, 'Invalid first name');

User.schema.path('last_name').validate(function (value) {
  return /^[a-zA-Z ']+$/.test(value);
}, 'Invalid last name');

User.schema.path('email').validate(function (value) {
  return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
}, 'Invalid email');

/*User.schema.path('email').validate(function (value) {
	User.findOne({ 'email': value }, 'email', function ( err, user ) {
  	  return user == 'null';
  	});
}, 'Email already exists');*/

User.schema.path('gender').validate(function (value) {
  return /male|female/i.test(value);
}, 'Invalid gender');

module.exports = User;