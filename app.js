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
mongoose.connect('mongodb://localhost/trafiejs');
var db = mongoose.connection;

// Initialize the routes
var login = require('./routes/login'),
    register = require('./routes/register'),
    profile = require('./routes/profile'),
    activities = require('./routes/activities'),
    settings = require('./routes/settings'),
    email_validation = require('./routes/email_validation'),
    reset_password = require('./routes/reset_password');


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
 * ACTIVITIES                                                                                                                  *
 ******************************************************************************************************************************/

//trafie.get( '/activities', activities.get );

trafie.post( '/activities', activities.post );

//trafie.put( '/activities', activities.put );

trafie.delete( '/activities/:activity_id', activities.delete );


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

 trafie.use(function(req, res, next){
  res.status(404);

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