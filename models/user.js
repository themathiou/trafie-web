// The User Model

var mongoose = require('mongoose');
var db = mongoose.connection;

//Define User SCHEMA
var userSchema = mongoose.Schema({
  first_name : String,
  last_name : String,
  email : String,
  password : String,
  gender : String
});

module.exports = mongoose.model('User', userSchema);