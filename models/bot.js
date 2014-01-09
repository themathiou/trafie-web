// The TEST Model

var mongoose = require('mongoose');
var q = require('q');
var crypto = require('crypto');
var db = mongoose.connection;


//Define Bot SCHEMA
var botSchema = mongoose.Schema({
  email : { type: String, required: true, unique: true, index: true },
  password : { type: String, required: true },
});

/**
 * Input validations
 */

//Validate the user's input data
botSchema.methods.validateUserInput = function(user_data) {

	var ragister_errors=[];
	register_errors['email'] = '';
    register_errors['password'] = '';

	return register_errors;
}

//Encrypt Password
botSchema.methods.encryptPassword = function (password) {
	var sha512_hash = crypto.createHash('sha512');
	sha512_hash.update('23tR@Ck@nDF!3lD04' + password);
	//return encrypted password
	return sha512_hash.digest('hex');
}

//Find bot by element
// i.e data = {email:someone@trafie.com}
botSchema.findOneBot = function(data){
	var d = q.defer();
	Bot.findOne(data, function ( err, bot ) {
	    d.resolve(bot);
	});
	console.log('findOne');
	return d.promise;
};



/////-------------------------------------



/*
botSchema.methods.checkUserInput = function(user) {
	var results = [];
    results['email_valid'] =   /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test( user.email );
    return results;
};
*/

/*
botSchema.methods.validate = function(user) {
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
*/

var Bot = mongoose.model('Bot', botSchema);

module.exports = Bot;