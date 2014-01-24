 /*##########-Theodore-Mathioudakis-##########################-George-Balasis-#############
 ##                                                                                      ##
 ##                                                        x#x_                          ##
 ##                                                      j#`^^*    ,,                    ##
 ##          ##                                         ##        (##)                   ##
 ##         ##                                         ##          ''                    ##
 ##     ###########   /#  ,cc,,    ,xo#####\ ##   ###########    /#;`    ,xo#####\       ##
 ##        ##         ##,##^^^+   j#^     ^#\#,       ##         ##     j#^     ^#)      ##
 ##       j#,        /##]^       /#         #D       /#,        /#;    /#^       #D      ##
 ##       ##         ##         j#         `#/       ##         ##    j#,,;yxx###/'      ##
 ##      j#,        /#/         #/         #/      /#,        /#"    #/^"                ##
 ##      ##         ##         |#,        ##       ##         ##    |#,                  ##
 ##     ##, __     /#           \#,     #/|#      ##;        ##,     \#,      ,p         ##
 ##     `%##^^    /#/            ^\#####^ |#     /#,        /#,       ^\####^>*          ##
 ##                                              ##                                      ##
 ##                                             ##                                       ##
 ##                                            #/                                        ##
 ##                                         ^##                                          ##
 ##                                                                                      ##
 ##################################-track-and-field-#####################################*/


/*******************************************************************************************************************************
 * EXPRESS                                                                                                                     *
 ******************************************************************************************************************************/

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var url = require('url') ;
var mongoose = require('mongoose');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var q = require('q');

// Initialize express
var trafie = express();

// Mongo db connection
mongoose.connect('mongodb://localhost/trafiejs');
var db = mongoose.connection;


/*******************************************************************************************************************************
 * MODELS                                                                                                                      *
 ******************************************************************************************************************************/
 
var User = require('./models/user.js');
var Profile = require('./models/profile.js');


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
	  res.redirect('/register');
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
  res.render( 'register', { title: 'trafie', errors: [] });
});

/**
 * Register - POST
 */
trafie.post( '/register', function( req, res ) {
  var error_messages = [];
  var error = false;

  // Checking input for blank values
  if( typeof req.body.password === 'undefined' || !req.body.password ) {
    error_messages['password'] = 'Password is required';
    error = true;
  }
  if( typeof req.body.repeat_password === 'undefined' || !req.body.repeat_password ) {
    error_messages['repeat_password'] = 'Please repeat the password';
    error = true;
  }
  if( !error && req.body.repeat_password !== req.body.password ) {
    error_messages['repeat_password'] = 'Passwords do not match';
    error = true;
  }
  if( typeof req.body.email === 'undefined' || !req.body.email ) {
    error_messages['email'] = 'Email is required';
    error = true;
  }
  if( typeof req.body.first_name === 'undefined' || !req.body.first_name ) {
    error_messages['first_name'] = 'First name is required';
    error = true;
  }
  if( typeof req.body.last_name === 'undefined' || !req.body.last_name ) {
    error_messages['last_name'] = 'Last name is required';
    error = true;
  }

  if( error ) {
    res.render( 'register', { errors: error_messages, fields: { 'first_name': req.body.first_name, 'last_name': req.body.last_name, 'email': req.body.email } });
    return;
  } else {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;
  }
res.render( 'register', { fields: { 'first_name': req.body.first_name, 'last_name': req.body.last_name, 'email': req.body.email } });
return;

  var new_user = {
    'email': email,
    'password': password
  };

  var new_profile = {
    'first_name': first_name,
    'last_name': last_name
  };

  var user = new User( new_user );
  var profile = new Profile( new_profile );

  User.schema.emailIsUnique( email ).then( function( success ){console.log(success);} );
console.log();
return;
  var user_errors = user.validate( user );

  var profile_errors = profile.validate( profile );

  user.save(function ( err, user ) {
    if ( err || register_errors.length ) {
      for( field in err.errors ) {
        if( err.errors[field].type == 'required' ) {
          register_errors[field] = 'Required';
        }
        else if( err.errors[field].type == 'invalid' ) {
          register_errors[field] = 'Invalid';
        }
        else if( err.errors[field].type == 'duplicate' ) {
          register_errors[field] = 'Email already exists';
        }
      }

      res.render( 'register', { title: 'trafie', errors: register_errors });
    } else {
      var sha512_hash = crypto.createHash('sha512');
      sha512_hash.update('233m@!lh@5h04' + user._id);

      var email_hash = sha512_hash.digest('hex');

      var new_hash = {
        user_id : user._id,
        type : 'verify',
        hash : email_hash
      };

      var hash = new User_hash( new_hash );

      req.session.user_id = user._id;
      res.redirect('/');
    }
  });
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
  var password = User.schema.encryptPassword(req.body.password);

  User.schema.findOne({ 'email': email, 'password': password }, '_id')
    .then(function(response) {
	    if( response !== null && typeof response._id !== 'undefined') {
	    	req.session.user_id = response._id;
		    res.redirect('/');
	    } else {
	    	console.log('else');
		    res.render('login', {"error":"Invalid input!"});
	    }
    })
	.fail(function(response) {
		console.log("Error : " + response);
  });

});


/*******************************************************************************************************************************
 * LOGOUT                                                                                                                      *
 ******************************************************************************************************************************/

/**
 * Logout - GET
 */
trafie.get('/logout', function( req, res ) {
  req.session.destroy();
  res.redirect('/');
});


/*******************************************************************************************************************************
 * SETTINGS                                                                                                                   *
 ******************************************************************************************************************************/

/**
 * Settings - GET
 */
/*
trafie.get( '/settings', function( req, res ) {
  res.render( 'settings', { title: 'trafie - Settings' });
});
*/


/*******************************************************************************************************************************
 * SERVER                                                                                                                      *
 ******************************************************************************************************************************/

http.createServer( trafie ).listen( trafie.get('port'), function(){
  console.log('Express server listening on port ' + trafie.get('port'));
});