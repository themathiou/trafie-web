// The User Model

var mongoose = require('mongoose');
var db = mongoose.connection;

/**
 * Define User SCHEMA
 * @param type string (valid input is ['verification', 'reset'])
 */ 
var userHashSchema = mongoose.Schema({
  user_id : { type: String, required: true, index: true },
  hash : { type: String, required: true },
  type : { type: String, required: true }
});

var User_hash = mongoose.model('User_hash', userHashSchema);

/**
 * Input validations
 */

module.exports = User_hash;