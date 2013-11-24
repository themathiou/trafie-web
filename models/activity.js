// The User Model

var mongoose = require('mongoose');
var db = mongoose.connection;

//Define User SCHEMA
var activitySchema = mongoose.Schema({
  type : { type: String, required: true },
  discipline : { type: String, required: true },
  place : { type: Number },
  location : { type: String },
  competition : { type: String },
  notes : { type: String },
  performance : { type: String },
  user_id : { type: String, required: true, index: true },
  date_time : {
                value: { type: Date, required: true },
                has_time: { type: Boolean, required: true, default: false }
              }
});

var Activity = mongoose.model('Activity', activitySchema);

/**
 * Input validations
 */


module.exports = Activity;