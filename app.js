 /*##########-Theodore-Mathioudakis-##########################-George-Balasis-#############
 ##                                                                                      ##
 ##                                                        x#x_                          ##
 ##                                                      j#`^^*    ,,                    ##
 ##          ##                                         ##        (##)                   ##
 ##         ##                                         ##          ''                    ##
 ##     ###########   /#  ,cc,,    ,xo#####\ ##   ###########    /#;`    ,xo#####\       ##
 ##        ##         ##,##^^^+   j#^     ^#\#,       ##         ##     j#^     ^#)      ##
 ##       j#,        /##]^       /#        `#D       /#,        /#;    /#^       #D      ##
 ##       ##         ##         j#         `#       '##        '##    j#,,;yxx###/'      ##
 ##      j#,        /#/         #/         #/      /#/        '#"    #/^"                ##
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

'use strict';

const express = require('express'),
	router = express.Router(),
	path = require('path'),
	mongoose = require('mongoose'),
	lessMiddleware = require('less-middleware'),
	redis = require('redis'),
	redisClient = redis.createClient(16679, "redis://h:pd3377dnutq6ava2p3fah105nnm@ec2-54-217-234-142.eu-west-1.compute.amazonaws.com"),//redis.createClient(), //redis.createClient(port, host)
	methodOverride = require('method-override'),
	session = require('express-session'),
	passport = require('passport'),
	bodyParser = require('body-parser'),
	errorHandler = require('errorhandler'),
	cookieParser = require('cookie-parser'),
	redisStore = require('connect-redis')(session);

// Initialize express
const trafie = express();

// Mongo db connection
// mongoose.connect('mongodb://localhost/trafie', function (err) {
//   if (err) {
//     console.log(err);
//   }
// });
var MONGOHQ_URL="mongodb://trafie_root:​my_secret_root_password@lennon.mongohq.com:10076/app19956848";
mongoose.connect(process.env.MONGOHQ_URL);

const db = mongoose.connection;

redisClient.on('connect', function() {
    console.log('redis connected');
});

const passportSessions = require('./app/config/sessions');
// Initialize the routes
const index = require('./app/controllers/index'),
	login = require('./app/controllers/loginController'),
	register = require('./app/controllers/registerController'),
	profile = require('./app/controllers/profileController'),
	activities = require('./app/controllers/activityController'),
	disciplines = require('./app/controllers/disciplineController'),
	//statistics = require('./app/controllers/statistics'),
	settings = require('./app/controllers/settingsController'),
	//email_validation = require('./app/controllers/emailValidationController'),
	//reset_password = require('./app/controllers/resetPasswordController'),
	dummyData = require('./app/controllers/dummyDataController'),
	api = require('./app/controllers/apiController'),
	feedback = require('./app/controllers/feedbackController'),
	nuke = require('./app/controllers/nukeController'),
	auth = require('./app/controllers/authController'),
	oAuth = require('./app/controllers/oAuthController');


/*******************************************************************************************************************************
 * MODULES                                                                                                                     *
 ******************************************************************************************************************************/

trafie.set('port', process.env.PORT || 3000);
trafie.set('views', path.join(__dirname, 'app/views'));
trafie.set('view engine', 'jade');
trafie.set('view cache', true);
trafie.set('env', 'development');
trafie.use(methodOverride());
trafie.use(session({ 
	store: new redisStore({
		host: '127.0.0.1',
		port: 6379,
		client: redisClient
	}),
	secret: '23tR@Ck@nDF!3lD_s3cur3535s!0n504',
    resave: true,
    saveUninitialized: true
}));
trafie.use(bodyParser.json());
trafie.use(bodyParser.urlencoded({ extended: true }));
trafie.use(cookieParser('23tR@Ck@nDF!3lD_s3cur3535s!0n504'));
trafie.use(lessMiddleware(__dirname + '/public'));
trafie.use(express.static(__dirname + '/public'));
trafie.use(express.static(path.join(__dirname, 'public')));
trafie.use(passport.initialize());
trafie.use(passport.session());

// Development Only
if (trafie.get('env') === 'development') {
 	trafie.use(errorHandler());
}


/*******************************************************************************************************************************
 * PROFILE                                                                                                                     *
 ******************************************************************************************************************************/

trafie.get( '/', index.getView );
trafie.get( '/users/:userId?', profile.get );


/*******************************************************************************************************************************
 * ACTIVITIES                                                                                                                  *
 ******************************************************************************************************************************/

trafie.get( '/users/:userId/activities/:activityId?', passport.authenticate('bearer', { session: false }), activities.get );
trafie.post( '/users/:userId/activities', passport.authenticate('bearer', { session: false }), activities.post );
trafie.put( '/users/:userId/activities/:activityId', passport.authenticate('bearer', { session: false }), activities.put );
trafie.delete( '/users/:userId/activities/:activityId', passport.authenticate('bearer', { session: false }), activities.delete );
trafie.get( '/users/:userId/disciplines', passport.authenticate('bearer', { session: false }), disciplines.get );


/*******************************************************************************************************************************
 * SETTINGS                                                                                                                    *
 ******************************************************************************************************************************/

trafie.get( '/settings', settings.get );
trafie.post( '/settings', settings.post );


/*******************************************************************************************************************************
 * STATISTICS                                                                                                                  *
 ******************************************************************************************************************************/

// trafie.get( '/views/statistics.html', statistics.get_view );


/*******************************************************************************************************************************
 * REGISTER                                                                                                                    *
 ******************************************************************************************************************************/

trafie.get( '/register', register.get );
trafie.post( '/register', register.post );


/*******************************************************************************************************************************
 * LOGIN                                                                                                                       *
 ******************************************************************************************************************************/

trafie.get( '/login', login.get );
trafie.post( '/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login'}) );

trafie.post( '/authorize', oAuth.authorize);


/*******************************************************************************************************************************
 * EMAIL VALIDATION                                                                                                            *
 ******************************************************************************************************************************/

/**
 * Email validation - GET
 * Shows a page that just informs the user to check their email
 * in order to validate their account
 */
//trafie.get( '/validation_email_sent/:resend/:userId', email_validation.validation_email_sent );

/**
 * Validate - GET
 * Validates the newly created user
 */
//trafie.get( '/validate/:hash', email_validation.validate );

/**
 * Resend validation email - GET
 * Resends the validation email
 */
//trafie.get( '/resend_validation_email/:userId', email_validation.resend_validation_email );


/*******************************************************************************************************************************
 * RESET PASSWORD                                                                                                              *
 ******************************************************************************************************************************/

// Reset Password Request - GET
//trafie.get( '/reset-password-request', reset_password.request.get );

// Reset Password Request - GET
//trafie.post( '/reset-password-request', reset_password.request.post );

// Reset Password - GET
//trafie.get( '/reset-password/:hash', reset_password.get );

// Reset Password - GET
//trafie.post( '/reset-password/:hash', reset_password.post );


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
 * DUMMY DATA                                                                                                                  *
 ******************************************************************************************************************************/

if( trafie.get('env') === 'development' ) {
	trafie.get( '/dummy-data', dummyData.get );
	trafie.post( '/dummy-data', dummyData.post );
}


/*******************************************************************************************************************************
 * API                                                                                                                         *
 ******************************************************************************************************************************/

if( trafie.get('env') === 'development' ) {
	trafie.get( '/api', api.get );
	trafie.get( '/api-table', api.get_view );
}


/*******************************************************************************************************************************
 * FEEDBACK                                                                                                                    *
 ******************************************************************************************************************************/

trafie.post( '/feedback', feedback.post );


/*******************************************************************************************************************************
 * NUCLEAR TEST GROUND                                                                                                         *
 ******************************************************************************************************************************/

if( trafie.get('env') === 'development' ) {
	trafie.get( '/nuke', nuke.get );
}


/*******************************************************************************************************************************
 * 404                                                                                                                         *
 ******************************************************************************************************************************/

trafie.use( function( req, res ) {
 	res.status( 404 );
 	res.sendFile('/app/views/four-oh-four.html', {"root": __dirname});
});

trafie.get('/four-oh-four', function( req, res ) {
 	res.sendFile('/app/views/four-oh-four.html', {"root": __dirname});
});


/*******************************************************************************************************************************
 * SERVER                                                                                                                      *
 ******************************************************************************************************************************/

var port = process.env.PORT || 3000;
require('http').createServer(trafie).listen(port);
console.log('Up and running... port 3000');
