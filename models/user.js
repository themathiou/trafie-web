// The User Model

var mongoose = require('mongoose');
var q = require('q');
var crypto = require('crypto');
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

//Validate the user's input data
userSchema.methods.validateUserInput = function(user_data) {

	var ragister_errors=[];
	register_errors['email'] = '';
    register_errors['password'] = '';
    register_errors['repeat_password'] = '';
    register_errors['valid'] = '';
    register_errors['settings'] = '';

	//Checking email
	if(typeOf user_data['email'] !== "undefined") {
		if ( /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test( user_data['email'] ) ) {
			register_errors['email'] = 'Email is not valid.';
		}
	}

	//Checking password
	if( typeOf user_data['password'] !== "undefined" ) {
		if( user_data['password'].length < 6) {
			register_errors['password'] = 'Password should be at least 6 characters long.';
		}
		//Checking repeat_password
		if( typeOf user_data['repeat_password'] !== "undefined") {
			if( user_data['repeat_password'] !== user_data['password']) {
				register_errors['repeat_password'] = 'Passwords don\'t match.';
			}
		}
	}

	return register_errors;
}

//Encrypt Password
userSchema.methods.encryptPassword = function (password) {
	var sha512_hash = crypto.createHash('sha512');
	sha512_hash.update('23tR@Ck@nDF!3lD04' + password);
	//return encrypted password
	return sha512_hash.digest('hex');
}

//Find user by element
// i.e data = {email:someone@trafie.com}
userSchema.methods.findOneUser = function(data){
	var d = q.defer();
	User.findOne(data, function ( err, user ) {
	    d.resolve(user);
	});
	console.log('findOne');
	return d.promise;
};



/////-------------------------------------



userSchema.methods.checkUserInput = function(user) {
	var results = [];
    results['email_valid'] =   /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test( user.email );
    return results;
};

userSchema.methods.validate = function(user) {
	var d = q.defer();
	user.findOneUser({ 'email': user.email })
	.then(function(db_user){
		if(db_user==null){
			console.log(user.checkUserInput(user)['email_valid']);
		} else {
			console.log('email is already taken');
		}
	});

	d.resolve(user);
    return d.promise;
};

var User = mongoose.model('User', userSchema);

module.exports = User;