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
var nodemailer = require("nodemailer");
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
 * EMAIL                                                                                                                       *
 ******************************************************************************************************************************/

// Create a SMTP transport object
var transport = nodemailer.createTransport("SMTP", {
        //service: 'Gmail', // use well known service.
                            // If you are using @gmail.com address, then you don't
                            // even have to define the service name
        auth: {
            user: "trafie.app@gmail.com",
            pass: "tr@f!etr@f!e"
        }
    });

console.log('SMTP Configured');

// Message object
var message = {
    from: 'trafie <trafie.app@gmail.com>',
    headers: {
        'X-Laziness-level': 1000
    }
};


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
  res.render( 'register', { title: 'trafie', errors: [] });
});

/**
 * Register - POST
 */
trafie.post( '/register', function( req, res ) {
  var register_errors = [];
  register_errors['first_name'] = '';
  register_errors['last_name'] = '';
  register_errors['email'] = '';
  register_errors['repeat_password'] = '';
  register_errors['password'] = '';
  var password = '';

  if(req.body.password == '') {
    register_errors['password'] = 'Password is required';
  }
  else if(req.body.password != req.body.repeat_password) {
    register_errors['repeat_password'] = 'Passwords do not match';
  }
  else {
    var sha512_hash = crypto.createHash('sha512');
    sha512_hash.update('23tR@Ck@nDF!3lD04' + req.body.password);
    password = sha512_hash.digest('hex');
  }

  var new_user = {
    email : req.body.email,
    password : password,
    valid : false
  };

  var new_profile = {
    first_name : req.body.first_name,
    last_name : req.body.last_name,
    gender : req.body.gender == 'male'
  }

/*var user = new User( new_user );
  var promise = User.findOne({ 'email': req.body.email }, 'first_name last_name', function ( err, user ) {
      return user;
    }).then(function(user){
      return user;
    });*/

 var test = function(err){
    var d = q.defer();
    User.findOne({ 'email': 'geobal87@yahoo.gr' }, 'email', function ( err, user ) {
        d.resolve(user);
    });
    console.log(d.promise);
    return d.promise;
  };
  var promise = test().then(function(user){ return user; });
  //var promise = sum( 1, 2 );
  res.send(promise);

  var user = new User( new_user );
  var profile = new Profile( new_profile );

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
      
      message.to = new_user.email;
      message.subject = 'Welcome to trafie ✔';
      message.html = '<h2>Hello ' + new_user.first_name + ' ' + new_user.last_name + '</h2>' +
           '<p>You have successfully registered to trafie.</p><br><p>The <b><i>trafie</i></b> team</p><br>' + 
           'Follow the link to verify your email:<br>' + 
           '<a href="' + req.headers.host + '/validate/' + email_hash + '">This is the link</a>';

      transport.sendMail(message, function(error){
          if(error){
              console.log('Error occured: ' + error);
              return;
          }
          console.log('Message sent successfully!');
      });

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
  var sha512_hash = crypto.createHash('sha512');
  sha512_hash.update('23tR@Ck@nDF!3lD04' + req.body.password);
  var password = sha512_hash.digest('hex');

  User.findOne({ 'email': email, 'password': password }, '_id', function ( err, user ) {
    if (err) return handleError(err);
    if( user != null ) {
      req.session.user_id = user._id;
      res.redirect('/');
    } else {
      res.render('login');
    }
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
trafie.get( '/settings', function( req, res ) {
  res.render( 'settings', { title: 'trafie - Settings' });
});


/*******************************************************************************************************************************
 * STATISTICS                                                                                                                   *
 ******************************************************************************************************************************/

/**
 * Statistics - GET
 */
trafie.get( '/statistics', function( req, res ) {
  res.render( 'statistics', { title: 'trafie - Statistics' });
});


/*******************************************************************************************************************************
 * SERVER                                                                                                                      *
 ******************************************************************************************************************************/

http.createServer( trafie ).listen( trafie.get('port'), function(){
  console.log('Express server listening on port ' + trafie.get('port'));
});