
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var trafie = express();

//------------------------------------------------------------mongodb connection
mongoose.connect('mongodb://localhost/trafiejs');
var db = mongoose.connection;

var userSchema = mongoose.Schema({
    first_name : String,
	last_name : String,
	email : String,
	password : String,
	gender : String
});

var User = mongoose.model('user', userSchema);


//------------------------------------------------------------all environments
trafie.set('port', process.env.PORT || 3000);
trafie.set('views', path.join(__dirname, 'views'));
trafie.set('view engine', 'jade');
trafie.use(express.favicon());
trafie.use(express.logger('dev'));
trafie.use(express.bodyParser());
trafie.use(express.methodOverride());
trafie.use(express.cookieParser('your secret here'));
trafie.use(express.session());
trafie.use(trafie.router);
trafie.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
trafie.use(express.static(path.join(__dirname, 'public')));

//------------------------------------------------------------development only
if ('development' == trafie.get('env')) {
  trafie.use(express.errorHandler());
}

trafie.get('/', routes.index);
trafie.get('/users', user.list);

//------------------------------------------------------------registration GET
trafie.get('/register', function( req, res ) {
	res.render('register', { title: 'trafie' });
} );

//------------------------------------------------------------registration POST
trafie.post('/register', function( req, res ) {


	var new_user = {
		first_name : req.body.first_name,
		last_name : req.body.last_name,
		email : req.body.email,
		password : req.body.password,
		repeat_password : req.body.repeat_password,
		gender : req.body.gender
	};

	var poc = new User(new_user);

	poc.save(function (err, poc) {
	  if (err) console.log('error!');
	});

	res.redirect('/login');
});

//------------------------------------------------------------something beautiful
trafie.get('/login', function( req, res ) {
	res.render('login', { title: 'login' });
} );

http.createServer(trafie).listen(trafie.get('port'), function(){
  console.log('Express server listening on port ' + trafie.get('port'));
});
