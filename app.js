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

// Initialize translations
var translations = [];
var en = require('./languages/en.js');
var gr = require('./languages/gr.js');
translations['en'] = new en();
translations['gr'] = new gr();


/*******************************************************************************************************************************
 * MODELS                                                                                                                      *
 ******************************************************************************************************************************/

var User = require('./models/user.js');
var Profile = require('./models/profile.js');
var Activity = require('./models/activity.js');
var UserHashes = require('./models/user_hashes.js');


/*******************************************************************************************************************************
 * MODULES                                                                                                                     *
 ******************************************************************************************************************************/

trafie.set('port', process.env.PORT || 3000);
trafie.set('views', path.join(__dirname, 'views'));
trafie.set('view engine', 'jade');
trafie.set('view cache', true);
trafie.set('env', 'development');
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
  var user_id = req.session.user_id;

  if(!user_id) {
	  res.redirect('/login');
  } else {
    Profile.schema.findOne( { '_id': user_id }, 'first_name last_name' ).then( function( profile_data ) {
      // If the user was found
      if( typeof profile_data.first_name !== 'undefined' ) {
        Activity.schema.getActivitiesOfUser( { 'user_id': user_id }, null, -1 )
        .then( function( activities ) {
          // Format the activity data
          var activities = Activity.schema.formatActivities( activities );
          // The data that will go to the front end
          var view_data = {
            'profile': {
              'first_name': profile_data.first_name,
              'last_name' : profile_data.last_name
            },
            'activities': activities,
            'tr'        : translations['en'].getProfileTranslations()
          };
          res.render( 'profile', view_data );
        });
      // If the user wasn't found
      } else {
        res.redirect('/login');
      }
    });
  }

});

/**
 * Profile - GET
 */
trafie.post('/', function( req, res ){
  // Get the user id from the session
  var user_id = req.session.user_id;
  // If there is no user id, redirect to login
  if(!user_id) {
    res.redirect('/login');
  } else {
    // Find the profile
    Profile.schema.findOne({ '_id': user_id }, 'first_name last_name')
    .then( function( profile_data ) {
      // If the profile was found
      if( typeof profile_data.first_name !== 'undefined' ) {
        var discipline = typeof req.body.discipline !== 'undefined' ? req.body.discipline : '';
        var performance = {};

        switch ( discipline ) {
          case '100m':
          case '200m':
          case '400m':
          case '800m':
          case '1500m':
          case '3000m':
          case '60m_hurdles':
          case '100m_hurdles':
          case '110m_hurdles':
          case '400m_hurdles':
          case '3000m_steeple':
          case '4x100m_relay':
          case '4x400m_relay':
          case 'marathon':
            // Get the posted values. If a value was not posted, replace it with 00
            performance.hours = typeof req.body.hours !== 'undefined' && req.body.hours != '' ? req.body.hours : '00';
            performance.minutes = typeof req.body.minutes !== 'undefined' && req.body.minutes != '' ? req.body.minutes: '00';
            performance.seconds = typeof req.body.seconds !== 'undefined' && req.body.seconds != '' ? req.body.seconds: '00';
            performance.centiseconds = typeof req.body.centiseconds !== 'undefined' && req.body.centiseconds != '' ? req.body.centiseconds : '00';

            // Format the performance
            performance = Activity.schema.validateTime( performance );

            break;
          case 'high_jump':
          case 'long_jump':
          case 'triple_jump':
          case 'pole_vault':
          case 'shot_put':
          case 'discus':
          case 'hammer':
          case 'javelin':
            // Get the posted values. If a value was not posted, replace it with 0
            performance.distance_1 = typeof req.body.distance_1 !== 'undefined' && req.body.distance_1 != '' ? req.body.distance_1 : '0';
            performance.distance_2 = typeof req.body.distance_2 !== 'undefined' && req.body.distance_2 != '' ? req.body.distance_2: '0';

            // Format the performance
            performance = Activity.schema.validateDistance( performance );
            break;
          case 'pentathlon':
          case 'heptathlon':
          case 'decathlon':
            // Get the posted values. If a value was not posted, replace it with null
            performance.points = typeof req.body.points !== 'undefined' ? req.body.points : null;

            // Format the performance
            performance = Activity.schema.validatePoints( performance );
            break;
          default:
            performance = null;
            break;
        }

        // If there is a valid performance value
        if( performance !== null ) {
          // Create the record that will be inserted in the db
          var new_activity = {
            'user_id': user_id,
            'discipline': discipline,
            'performance': performance
          };

          var activity = new Activity( new_activity );
          // Save the activity
          activity.save(function ( err, activity ) {
            Activity.schema.getActivitiesOfUser( { 'user_id': user_id }, null, -1 )
            .then( function( activities ) {
              // Format the activity data
              var activities = Activity.schema.formatActivities( activities );
              // The data that will go to the front end
              var view_data = {
                'profile': {
                  'first_name': profile_data.first_name,
                  'last_name' : profile_data.last_name
                },
                'activities': activities,
                'tr'        : translations['en'].getProfileTranslations()
              };
              res.render( 'profile', view_data );
            });
          });
        } else {
          Activity.schema.getActivitiesOfUser( { 'user_id': user_id }, null, -1 )
          .then( function( activities ) {
            // Format the activity data
            var activities = Activity.schema.formatActivities( activities );
            // The data that will go to the front end
            var view_data = {
              'profile': {
                'first_name': profile_data.first_name,
                'last_name' : profile_data.last_name
              },
              'activities': activities,
              'tr'        : translations['en'].getProfileTranslations()
            };
            res.render( 'profile', view_data );
          });
        }

      // If the profile wasn't found
      } else {
        res.redirect('/login');
      }
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
  res.render( 'register', { errors: {}, fields: { 'first_name': '', 'last_name': '', 'email': '' } } );
});

/**
 * Register - POST
 */
trafie.post( '/register', function( req, res ) {
  var error_messages = {};
  var errors = false;

  // Initializing the input values
  var first_name = typeof req.body.first_name !== 'undefined' ? req.body.first_name.trim() : '';
  var last_name = typeof req.body.last_name !== 'undefined' ? req.body.last_name.trim() : '';
  var email = typeof req.body.email !== 'undefined' ? req.body.email.trim() : '';
  var password = typeof req.body.password !== 'undefined' ? req.body.password : '';
  var repeat_password = typeof req.body.repeat_password !== 'undefined' ? req.body.repeat_password : '';

  // Generating error messages
  if( !password ) {
    error_messages.password = 'Password is required';
    errors = true;
  }
  else if( !errors && !User.schema.validatePassword( password ) ) {
    error_messages.password = 'Password should be at least 6 characters long';
    errors = true;
  }
  if( !repeat_password ) {
    error_messages.repeat_password = 'Please repeat the password';
    errors = true;
  }
  if( !errors && repeat_password !== password ) {
    error_messages.repeat_password = 'Passwords do not match';
    errors = true;
  }
  if( !email ) {
    error_messages.email = 'Email is required';
    errors = true;
  }
  else if( !User.schema.validateEmail( email ) ) {
    error_messages.email = 'Email is not valid';
    errors = true;
  }
  if( !first_name ) {
    error_messages.first_name = 'First name is required';
    errors = true;
  }
  else if( !Profile.schema.validateName( first_name ) ) {
    error_messages.first_name = 'First name can only have latin characters';
    errors = true;
  }
  if( !last_name ) {
    error_messages.last_name = 'Last name is required';
    errors = true;
  }
  else if( !Profile.schema.validateName( last_name ) ) {
    error_messages.last_name = 'Last name can only have latin characters';
    errors = true;
  }

  // Checking if the given email already exists in the database
  User.schema.emailIsUnique( email ).then( function( unique_email ) {
    // If the email is not unique, add it to the errors
    if( !unique_email ) {
      error_messages.email = 'Email is already in use';
      errors = true;
    }

    // If there are any errors, show the messages to the user
    if( errors ) {
      res.render( 'register', { 'errors': error_messages, 'fields': { 'first_name': first_name, 'last_name': last_name, 'email': email } });
      return;
    }

    // Encrypting the password
    password = User.schema.encryptPassword(password);

    var new_user = {
      'email': email,
      'password': password
    };

    var new_profile = {
      'first_name': first_name,
      'last_name': last_name
    };

    // Creating the user and profile objects
    var user = new User( new_user );

    // Saving the user and the profile data
    user.save(function ( err, user ) {
      new_profile._id = user._id;
      var profile = new Profile( new_profile );
      Profile.schema.save(profile)
      .then( function(profile){return UserHashes.schema.createVerificationHash(new_user.email, user._id);})
      .then( function( email_hash ) {

			message.to = new_user.email;
			message.subject = 'Welcome to trafie ✔';
			message.html = '<h2>Hello ' + new_profile.first_name + ' ' + new_profile.last_name + '</h2>' +
			   '<p>You have successfully registered to trafie.</p><br><p>The <b><i>trafie</i></b> team</p><br>' +
			   'Follow the link to verify your email:<br>' +
			   '<a href="' + req.headers.host + '/validate/' + email_hash + '">This is the link</a>';

			transport.sendMail(message, function(error) {
			  if(error) {
			      console.log('Error occured: ' + error);
			      return;
			  }
			});

			// Redirecting to the profile
			res.redirect( '/validation_email_sent/' + user._id );
		});
	});

  });
});


/*******************************************************************************************************************************
 * LOGIN                                                                                                                       *
 ******************************************************************************************************************************/

/**
 * Login - GET
 */
trafie.get('/login', function( req, res ) {
  res.render('login', { 'errors': {} } );
});

/**
 * Login - POST
 */
trafie.post('/login', function( req, res ) {
  var email = req.body.email;
  var password = User.schema.encryptPassword(req.body.password);

  User.schema.findOne({ 'email': email, 'password': password, }, '_id valid')
  .then(function(response) {
    if( response !== null && typeof response._id !== 'undefined' ) {
      if( response.valid === true ) {
      	req.session.user_id = response._id;
  	    res.redirect('/');
      } else {
        res.render('login', { 'errors': { 'email': 'Your account has not been validated yet. <a href="/resend_validation_email/' + response._id + '">Resend validation email</a>' } } );
      }
    } else {
	    res.render('login', { 'errors': { 'email': 'Email - password combination wasn\'t found' } } );
    }
  })
	.fail(function(response) {
		console.log("Error : " + response);
  });

});


/*******************************************************************************************************************************
 * EMAIL VALIDATION                                                                                                            *
 ******************************************************************************************************************************/

/**
 * Email validation - GET
 * Shows a page that just informs the user to check their email
 * in order to validate their account
 */
trafie.get('/validation_email_sent/:user_id', function( req, res ) {
  var email = '';
  var user_id = req.params.user_id;
  User.schema.findOne({ '_id': user_id }, 'email valid')
  .then(function(response) {
    if( !response.email || response.valid ) {
      res.redirect('/login');
    }

    res.render('validation_email_sent', { 'email': response.email } );
  });
});

/**
 * Validate - GET
 * Validates the newly created user
 */
trafie.get('/validate/:hash', function( req,res ){
  var user_id = '';
  UserHashes.schema.findUserIdByValidationHash( req.params.hash )
  .then( function( response ) {
    if( response ) {
      user_id = response.user_id;
      return User.schema.validateUser( response.user_id );
    } else {
      res.redirect('/login');
    }
  }).then( function(){
    UserHashes.schema.deleteValidationHash( req.params.hash );
    // Storing the user id in the session
    req.session.user_id = user_id;
    res.redirect('/');
  });
});

/*******************************************************************************************************************************
 * SETTINGS                                                                                                                    *
 ******************************************************************************************************************************/

/**
 * Settings - GET
 */
trafie.get( '/settings', function( req, res ) {
  var first_name, last_name;
  var user_id = req.session.user_id;
  var errors = {};

  // If there is no user id in the session, redirect to register screen
  if( !user_id ) {
    res.redirect('/login');
  // Else, fetch the first name and the last name of the user from the database
  } else {
    Profile.schema.findOne({ '_id': user_id }, 'first_name last_name')
    .then( function( response ) {
      // Format the data that will go to the front end
      var view_data = {
        'profile': {
          'first_name': response.first_name,
          'last_name' : response.last_name
        },
        'errors'  : errors,
        'tr'      : translations['en'].getSettingsTranslations()
      };
      res.render( 'settings', view_data );
    })
    .fail(function(response) {
      console.log("Error : " + response);
    });
  }
});

/**
 * Settings - POST
 */
 trafie.post('/settings', function( req, res ) {
  var error_messages = {};
  var errors = false;
  var post_data = {};
  if( typeof req.body.first_name !== 'undefined' ) {
    post_data.first_name = req.body.first_name;
    if( !Profile.schema.validateName( post_data.first_name ) ) {
      error_messages.first_name = 'Invalid name';
      errors = true;
    }
  }
  if( typeof req.body.last_name !== 'undefined' ) {
    post_data.last_name = req.body.last_name;
    if( !Profile.schema.validateName( post_data.last_name ) ) {
      error_messages.last_name = 'Invalid name';
      errors = true;
    }
  }
  var user_id = req.session.user_id;

  // If there is no user id in the session, redirect to register screen
  if(!user_id) {
    res.redirect('/register');
  }
  // If there are errors, do not update the profile
  else if( errors ) {
    Profile.schema.findOne({ '_id': user_id }, 'first_name last_name')
    .then( function( response ) {
      // Format the data that will go to the front end
      var view_data = {
        'profile': {
          'first_name': response.first_name,
          'last_name' : response.last_name
        },
        'errors'  : error_messages,
        'tr'      : translations['en'].getSettingsTranslations()
      };
      res.render( 'settings', view_data );
    });
  // Else, fetch the first name and the last name of the user from the database
  } else {
    Profile.update({ '_id': user_id }, { $set: post_data }, { upsert: true }, function( error ) {
      Profile.schema.findOne({ '_id': user_id }, 'first_name last_name')
      .then( function( response ) {
        // Format the data that will go to the front end
        var view_data = {
          'profile': {
            'first_name': response.first_name,
            'last_name' : response.last_name
          },
          'errors'  : error_messages,
          'tr'      : translations['en'].getSettingsTranslations()
        };
        res.render( 'settings', view_data );
      });
    });
  }
 });


/*******************************************************************************************************************************
 * 404                                                                                                                         *
 ******************************************************************************************************************************/

 trafie.use(function(req, res, next){
  res.status(404);

  // respond with html page
/*
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }
  */

  // default to plain-text. send()
  res.type('html').send('People are often unreasonable, illogical, and self-centered;<br><b>Forgive</b> them anyway.<br>If you are kind, people may accuse you of selfish, ulterior motives;<br><b>Be kind</b> anyway.<br>If you are successful, you will win some false friends and some true enemies;<br><b>Succeed</b> anyway.<br>If you are honest and frank, people may cheat you;<br><b>Be honest and frank</b> anyway.<br>What you spend years building, someone could destroy overnight;<br><b>Build</b> anyway.<br>If you find serenity and happiness, they may be jealous;<br><b>Be happy</b> anyway.<br>The good you do today, people will often forget tomorrow;<br><b>Do good</b> anyway.<br>Give the world the best you have and it may just never be enough;<br><b>Give the world the best you have</b> anyway.<br>You see, in the final analysis, it’s all between you and God;<br>It was never between you and them anyway.<br><a href="javascript:history.back();">Go Back</a>');
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
 * SERVER                                                                                                                      *
 ******************************************************************************************************************************/

http.createServer( trafie ).listen( trafie.get('port'), function(){
  console.log('Express server listening on port ' + trafie.get('port'));
});