// The User Model

var mongoose = require('mongoose');
var db = mongoose.connection;

//Define User SCHEMA
var userSchema = mongoose.Schema({
  email : { type: String, required: true, unique: true, index: true },
  password : { type: String, required: true },
  settings : {
                date_format : { type: String, required: true, default: 'd/m/Y' },
                language : { type: String, required: true, default: 'eng' },
                time_zone : { type: String, required: true, default: 'Europe/Helsinki' },
                unit_system : { type: String, required: true, default: 'metric' }
              },
  valid : { type: Boolean, required: true }
});

var User = mongoose.model('User', userSchema);

/**
 * Input validations
 */

User.schema.path('email').validate(function (value) {
  return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
}, 'invalid');

User.schema.path('email').validate(function (value, cb) {
	User.findOne({ 'email': value }, 'email', function ( err, user ) {
  	  cb( user == null );
  	});
}, 'duplicate');

module.exports = User;