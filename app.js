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
	http = require('http'),
	path = require('path'),
	url = require('url'),
	mongoose = require('mongoose'),
	crypto = require('crypto'),
	q = require('q');

// Initialize express
const trafie = express();

// Mongo db connection
mongoose.connect('mongodb://localhost/trafiejs');
//var MONGOHQ_URL="mongodb://trafie_root:​my_secret_root_password@lennon.mongohq.com:10076/app19956848";
//mongoose.connect(process.env.MONGOHQ_URL);

const db = mongoose.connection;

// Initialize the routes
const index = require('./app/routes/index'),
	login = require('./app/routes/login'),
	register = require('./app/routes/register'),
	profile = require('./app/routes/profile'),
	activities = require('./app/routes/activities'),
	disciplines = require('./app/routes/disciplines'),
	search = require('./app/routes/search'),
	statistics = require('./app/routes/statistics'),
	settings = require('./app/routes/settings'),
	email_validation = require('./app/routes/email_validation'),
	reset_password = require('./app/routes/reset_password'),
	dummy_data = require('./app/routes/dummy_data'),
	api = require('./app/routes/api'),
	feedback = require('./app/routes/feedback'),
	nuke = require('./app/routes/nuke');

// Initialize the helpers
const activityHelper = require('./app/helpers/activity.js'),
	profileHelper = require('./app/helpers/profile.js'),
	userHelper = require('./app/helpers/user.js');


/*******************************************************************************************************************************
 * LIBRARIES                                                                                                                   *
 ******************************************************************************************************************************/

const Email = require('./app/libs/email');


/*******************************************************************************************************************************
 * MODULES                                                                                                                     *
 ******************************************************************************************************************************/

trafie.set('port', process.env.PORT || 3000);
trafie.set('views', path.join(__dirname, 'app/views'));
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
 * PROFILE                                                                                                                     *
 ******************************************************************************************************************************/

trafie.get( '/', index.get_view );

trafie.get( '/users/me', profile.get_me );

trafie.get( '/users/:user_id?', profile.get );

trafie.get( '/views/profile.html', profile.get_view );


/*******************************************************************************************************************************
 * ACTIVITIES                                                                                                                  *
 ******************************************************************************************************************************/

trafie.get( '/users/:user_id/activities/:activity_id?', activities.get );

trafie.post( '/users/:user_id/activities', activities.post );

trafie.put( '/users/:user_id/activities/:activity_id', activities.put );

trafie.delete( '/users/:user_id/activities/:activity_id', activities.delete );

trafie.get( '/users/:user_id/disciplines', disciplines.get );


/*******************************************************************************************************************************
 * SETTINGS                                                                                                                    *
 ******************************************************************************************************************************/

trafie.get( '/views/settings.html', settings.get_view );

trafie.get( '/settings', index.get_view );

trafie.get( '/settings_data', settings.get );

trafie.post( '/settings_data', settings.post );


/*******************************************************************************************************************************
 * STATISTICS                                                                                                                  *
 ******************************************************************************************************************************/

trafie.get( '/views/statistics.html', statistics.get_view );


/*******************************************************************************************************************************
 * REGISTER                                                                                                                    *
 ******************************************************************************************************************************/

trafie.get( '/register', register.get );

trafie.post( '/register', register.post );


/*******************************************************************************************************************************
 * LOGIN                                                                                                                       *
 ******************************************************************************************************************************/

trafie.get( '/login', login.get );

trafie.post( '/login', login.post );


/*******************************************************************************************************************************
 * EMAIL VALIDATION                                                                                                            *
 ******************************************************************************************************************************/

/**
 * Email validation - GET
 * Shows a page that just informs the user to check their email
 * in order to validate their account
 */
trafie.get( '/validation_email_sent/:resend/:user_id', email_validation.validation_email_sent );

/**
 * Validate - GET
 * Validates the newly created user
 */
trafie.get( '/validate/:hash', email_validation.validate );

/**
 * Resend validation email - GET
 * Resends the validation email
 */
trafie.get( '/resend_validation_email/:user_id', email_validation.resend_validation_email );


/*******************************************************************************************************************************
 * RESET PASSWORD                                                                                                              *
 ******************************************************************************************************************************/

// Reset Password Request - GET
trafie.get( '/reset_password_request', reset_password.request.get );

// Reset Password Request - GET
trafie.post( '/reset_password_request', reset_password.request.post );

// Reset Password - GET
trafie.get( '/reset_password/:hash', reset_password.get );

// Reset Password - GET
trafie.post( '/reset_password/:hash', reset_password.post );


/*******************************************************************************************************************************
 * 404                                                                                                                         *
 ******************************************************************************************************************************/

trafie.use( function( req, res, next ) {
 	res.status( 404 );
 	res.sendfile('./app/views/four_oh_four.html');
});

trafie.get('/four_oh_four', function( req, res ) {
 	res.sendfile('./app/views/four_oh_four.html');
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
 * DUMMY DATA                                                                                                                  *
 ******************************************************************************************************************************/

if( trafie.settings.env === 'development' ) {
	trafie.get( '/dummy_data', dummy_data.get );

	trafie.post( '/dummy_data', dummy_data.post );
}


/*******************************************************************************************************************************
 * API                                                                                                                         *
 ******************************************************************************************************************************/

if( trafie.settings.env === 'development' ) {
	trafie.get( '/api', api.get );

	trafie.get( '/api_table', api.get_view );
}


/*******************************************************************************************************************************
 * NUCLEAR TEST GROUND                                                                                                         *
 ******************************************************************************************************************************/

trafie.post( '/feedback', feedback.post );


/*******************************************************************************************************************************
 * NUCLEAR TEST GROUND                                                                                                         *
 ******************************************************************************************************************************/

if( trafie.settings.env === 'development' ) {
	trafie.get( '/nuke', nuke.get );
}


/*******************************************************************************************************************************
 * PROFILE                                                                                                                     *
 ******************************************************************************************************************************/

trafie.get( '/:profile_id', index.get_view );


/*******************************************************************************************************************************
 * SERVER                                                                                                                      *
 ******************************************************************************************************************************/

var port = process.env.PORT || 3000;
require('http').createServer(trafie).listen(port);
console.log('Up and running...');