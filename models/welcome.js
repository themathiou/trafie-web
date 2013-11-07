
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test_trafie');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback (data) {
	var users_schema = mongoose.Schema({
		email: String,
		password: String
	});
	var Users = mongoose.model('users', users_schema);

	console.log("In model:" + data);
	
});