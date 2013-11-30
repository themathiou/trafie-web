// The User Model

var mongoose = require('mongoose');
var db = mongoose.connection;

//Define User SCHEMA
var userSchema = mongoose.Schema({
  email : { type: String, required: true, unique: true, index: true },
  password : { type: String, required: true },
  settings : {
                date_format : { type: String, required: true, default: 'Y/m/d' },
                language : { type: String, required: true, default: 'eng' },
                time_zone : { type: String, required: true, default: 'Europe/Helsinki' },
                unit_system : { type: String, required: true, default: 'metric' }
              },
  valid : { type: Boolean, required: true, default: false }
});

/**
 * Input validations
 */
userSchema.methods.validate = function( user, cb ) {
  User.findOne({ 'email': user.email }, 'email', function ( err, db_user ) {
    var results = [];
    results['email_valid'] =   /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test( user.email );
    results['email_unique'] = ( db_user == null );
    
    return results;
  });
}

var User = mongoose.model('User', userSchema);

module.exports = User;