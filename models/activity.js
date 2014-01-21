// The User Model

var mongoose = require('mongoose');
var db = mongoose.connection;

//Define User SCHEMA
var activitySchema = mongoose.Schema({
  type : { type: String, required: true },
  discipline : { type: String, required: true },
  performance : { type: String },
  user_id : { type: String, required: true, index: true },
});

var Activity = mongoose.model('Activity', activitySchema);

/**
 * Input validations
 */


module.exports = Activity;