// The User Model

var mongoose = require('mongoose');
var db = mongoose.connection;
console.log(db);

//Define User SCHEMA
var userSchema = mongoose.Schema({
  first_name : String,
  last_name : String,
  email : String,
  password : String,
  gender : String
});

/**
* Methods
*/

userSchema.methods.get = function (user_id, callback) {
  this.findOne({ _id: user_id }, 'first_name last_name', callback);
}

module.exports = mongoose.model('User', userSchema);