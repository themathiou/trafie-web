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

var express = require('express'),
    http = require('http'),
    path = require('path');
    url = require('url') ,
    mongoose = require('mongoose'),
    crypto = require('crypto'),
    q = require('q');

// Initialize express
var trafie = express();

// Mongo db connection
//mongoose.connect('mongodb://localhost/trafiejs');
var MONGOHQ_URL="mongodb://trafie_root:​my_secret_root_password@lennon.mongohq.com:10076/app19956848";
mongoose.connect(process.env.MONGOHQ_URL);

var db = mongoose.connection;

// Initialize the routes
var login = require('./routes/login'),
    register = require('./routes/register'),
    profile = require('./routes/profile'),
    activities = require('./routes/activities'),
    search = require('./routes/search'),
    statistics = require('./routes/statistics'),
    settings = require('./routes/settings'),
    email_validation = require('./routes/email_validation'),
    reset_password = require('./routes/reset_password'),
    dummy_data = require('./routes/dummy_data');


/*******************************************************************************************************************************
 * LIBRARIES                                                                                                                   *
 ******************************************************************************************************************************/

var Email = require('./libs/email');


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
 * PROFILE                                                                                                                     *
 ******************************************************************************************************************************/

trafie.get( '/', profile.get );


/*******************************************************************************************************************************
 * USER                                                                                                                        *
 ******************************************************************************************************************************/

//trafie.get( '/user', profile.get );


/*******************************************************************************************************************************
 * ACTIVITIES                                                                                                                  *
 ******************************************************************************************************************************/

trafie.get( '/user/:user_id/activities/:activity_id?', activities.get );

trafie.post( '/user/:user_id/activities', activities.post );

trafie.put( '/user/:user_id/activities/:activity_id', activities.put );

trafie.delete( '/user/:user_id/activities/:activity_id', activities.delete );


/*******************************************************************************************************************************
 * SETTINGS                                                                                                                    *
 ******************************************************************************************************************************/

trafie.get( '/settings', settings.get );

trafie.post( '/settings', settings.post );


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
 * STATISTICS                                                                                                                  *
 ******************************************************************************************************************************/

trafie.get( '/statistics', statistics.get );


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
 * SEARCH                                                                                                                      *
 ******************************************************************************************************************************/

 trafie.get( '/search', search.get );


/*******************************************************************************************************************************
 * 404                                                                                                                         *
 ******************************************************************************************************************************/

 trafie.use(function(req, res, next){
  res.status(404);
  res.sendfile('./views/four_oh_four.html');
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
 * PROFILE                                                                                                                     *
 ******************************************************************************************************************************/

trafie.get( '/:profile_id', profile.get );


/*******************************************************************************************************************************
 * SERVER                                                                                                                      *
 ******************************************************************************************************************************/

var port = process.env.PORT || 3000;
require('http').createServer(trafie).listen(port);
console.log('Up and running...');