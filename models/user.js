// The User Model

var mongoose = require('mongoose');
var q = require('q');
var crypto = require('crypto');
var db = mongoose.connection;


//Define User SCHEMA
var userSchema = mongoose.Schema({
  email : { type: String, required: true, unique: true, index: true },
  password : { type: String, required: true }
});

/**
* Find user by element
* @param json where({email:someone@trafie.com})
* @param String select
*/
userSchema.findOne = function( where, select ){
	var d = q.defer();
	User.findOne(where, select, function ( err, user ) {
		d.resolve(user);
	});
	return d.promise;
};

/**
* Encrypt password using sha512_hash
* @param String password
*/
userSchema.encryptPassword = function (password) {
	var sha512Hash = crypto.createHash('sha512');
	sha512Hash.update('23tR@Ck@nDF!3lD04' + password);

	//return encrypted password
	return sha512Hash.digest('hex');
}

/**
 * Input validations
 */

//function that checks email for validity
userSchema.validateEmail = function( email ) {
	 email = email.trim();
	 if ( /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test( email ) ) {
		 return {"success":true, "value":email};
	 } else {
		 return {"success":false , "code":0};
	 }
}

//function that checks password for validity
userSchema.validatePassword = function( password, repeat ) {
	 //password size < 6
	 if( password.length < 6  ) {
		 return {"success":false, "code":0};
	 }
	 //passwords doesn't match
	 else if ( password !== repeat)  {
		 return {"success":false, "code":1};
	 }
	 //it's OK. Hash password and
	 else {
	 	 var hashed_password = userSchema.encryptPassword(password);
		 return {"success":true, "value":hashed_password};
	 }
}

/////-------------------------------------

var User = mongoose.model('User', userSchema);

module.exports = User;



//------ TO BE DELETED ----
//Validate the user's input data
/*
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
*/