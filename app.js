
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var crypto = require('crypto');

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

//------------------------------------------------------------ Profile
//trafie.get('/', routes.index);
trafie.get('/', function( req, res ){
  var first_name, last_name;

  User.findOne({ last_name: 'Chicherova' }, 'first_name last_name', function (err, user) {
    if (err) return handleError(err);
    var data = {first_name: user.first_name, last_name: user.last_name};
    res.render('profile', data);
  });

});

//------------------------------------------------------------ Registration
trafie.get('/register', function( req, res ) {
  res.render('register', { title: 'trafie' });
});

trafie.post('/register', function( req, res ) {
  var sha512_hash = crypto.createHash('sha512');
  sha512_hash.update(req.body.password);
  var password = sha512_hash.digest('hex');

  var new_user = {
    first_name : req.body.first_name,
    last_name : req.body.last_name,
    email : req.body.email,
    password : password,
    repeat_password : req.body.repeat_password,
    gender : req.body.gender
  };
  
  var user = new User(new_user);
  
  user.save(function (err, user) {
    if (err) console.log('error!');
  });
  
  res.redirect('/');
});

//------------------------------------------------------------ Login
trafie.get('/login', function( req, res ) {
  res.render('login');
});

trafie.post('/login', function( req, res ) {
  var email = req.body.email;
  var sha512_hash = crypto.createHash('sha512');
  sha512_hash.update(req.body.password);
  var password = sha512_hash.digest('hex');

  User.findOne({ email: email, password: password }, '_id', function (err, user) {
      if (err) return handleError(err);
      if(user != null) {
        console.log(user._id);
      }
      else {
        res.render('login');
      }
    });
});
//------------------------------------------------------------ Server creation
http.createServer(trafie).listen(trafie.get('port'), function(){
  console.log('Express server listening on port ' + trafie.get('port'));
});