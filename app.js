/*###########theodore-mathoudakis############################george-balasis################
 ##                                                                                      ##
 ##                                                        x#x_                          ##
 ##                                                      j#`^^*    ,,                    ##
 ##          ##                                         ##        (##)                   ##
 ##         ##                                         ##          ''                    ##
 ##     ###########   /#  ,cc,,    ,xo#####\ ##   ###########    /#;`    ,xo#####\       ##
 ##        ##         ##,##^^^+   j#^     ^#\#,       ##         ##     j#^     ^#)      ##
 ##       /#,        /##]^       /#         #D       /#,        /#;    /#^       #D      ##
 ##       ##         ##         (#         `#/       ##         ##    (#,,;yxx###/'      ##
 ##      /#,        /#/         #/         #]`      /#,        /#"    #/^"               ##
 ##      ##         ##         |#,        ##D       ##         ##    |#,                 ##
 ##     ##, __     /#           \#,     #/|#       ##;        ##,     \#,      ,p        ##
 ##     `%##^^    /#/            ^\#####^ |#      /#,        /#,       ^\####^>*         ##
 ##                                               ##                                     ##
 ##                                              ##                                      ##
 ##                                             #/                                       ##
 ##                                         ^##)^                                        ##
 ##                                                                                      ##
 ###################################track-and-field######################################*/


/*******************************************************************************************************************************
 * EXPRESS                                                                                                                     *
 ******************************************************************************************************************************/

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var crypto = require('crypto');

// Initialize express
var trafie = express();

// Mongo db connection
mongoose.connect('mongodb://localhost/trafiejs');
var db = mongoose.connection;


/*******************************************************************************************************************************
 * MODELS                                                                                                                      *
 ******************************************************************************************************************************/

var User = require('./models/user.js');


/*******************************************************************************************************************************
 * MODULES                                                                                                                     *
 ******************************************************************************************************************************/

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

// Development Only
if ('development' == trafie.get('env')) {
  trafie.use(express.errorHandler());
}


/*******************************************************************************************************************************
 * PROFILE                                                                                                                     *
 ******************************************************************************************************************************/

/**
 * Profile - GET
 */
trafie.get('/', function( req, res ){
  var first_name, last_name;
  var user_id = req.session.user_id;

  if(!user_id) {
	  res.redirect('/login');
  } else {
    User.findOne({ '_id': user_id }, 'first_name last_name', function ( err, user ) {
  	  res.render( 'profile', { first_name: user.first_name, last_name: user.last_name });
  	});
  }

});


/*******************************************************************************************************************************
 * REGISTER                                                                                                                    *
 ******************************************************************************************************************************/

/**
 * Register - GET
 */
trafie.get( '/register', function( req, res ) {
  res.render( 'register', { title: 'trafie' });
});

/**
 * Register - POST
 */
trafie.post( '/register', function( req, res ) {
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

  var user = new User( new_user );

  user.save(function ( err, user ) {
    if (err) console.log('error!');
  });

  res.redirect('/');
});


/*******************************************************************************************************************************
 * LOGIN                                                                                                                       *
 ******************************************************************************************************************************/

/**
 * Login - GET
 */
trafie.get('/login', function( req, res ) {
  res.render('login');
});

/**
 * Login - POST
 */
trafie.post('/login', function( req, res ) {
  var email = req.body.email;
  var sha512_hash = crypto.createHash('sha512');
  sha512_hash.update(req.body.password);
  var password = sha512_hash.digest('hex');

  User.findOne({ 'email': email, 'password': password }, '_id', function ( err, user ) {
      if (err) return handleError(err);
      if( user != null ) {
        //console.log(user._id);
        req.session.user_id = user._id;
        res.redirect('/');
      } else {
        res.render('login');
      }
    });
});


/*******************************************************************************************************************************
 * SERVER                                                                                                                      *
 ******************************************************************************************************************************/

http.createServer( trafie ).listen( trafie.get('port'), function(){
  console.log('Express server listening on port ' + trafie.get('port'));
});