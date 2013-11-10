
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

//------------------------------------------------------------ initialize express
var trafie = express();

//------------------------------------------------------------ mongodb connection
mongoose.connect('mongodb://localhost/trafiejs');
var db = mongoose.connection;

//------------------------------------------------------------ Models
var User = require('./models/user.js');

//------------------------------------------------------------ all environments
trafie.set('port', process.env.PORT || 3000);
trafie.set('views', path.join(__dirname, 'views'));
trafie.set('view engine', 'jade');
trafie.use(express.favicon());
trafie.use(express.logger('dev'));
trafie.use(express.bodyParser());
trafie.use(express.methodOverride());
trafie.use(express.cookieParser('your secret here'));
trafie.use(express.session({secret: '23tR@Ck@nDF!3lD_s3cur3535s!0n504'}));
trafie.use(trafie.router);
trafie.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
trafie.use(express.static(path.join(__dirname, 'public')));

//------------------------------------------------------------ development only
if ('development' == trafie.get('env')) {
  trafie.use(express.errorHandler());
}

//------------------------------------------------------------ Profile
//trafie.get('/', routes.index);
trafie.get('/', function( req, res ){
  var first_name, last_name;

  var user_id = req.session.user_id;

  if(!user_id){
	  res.redirect('/login');
  }
  else{
  	User.get(user_id, function (err, user) {
	  console.log(user);
	});
  }

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
        //console.log(user._id);
        req.session.user_id = user._id;
        res.redirect('/');
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