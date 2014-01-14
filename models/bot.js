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


//---

//---

var Bot = mongoose.model('Bot', botSchema);

module.exports = Bot;