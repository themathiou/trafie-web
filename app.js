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
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express'),
    router = express.Router(),
    path = require('path'),
    mongoose = require('mongoose'),
    lessMiddleware = require('less-middleware'),
    redis = require('redis'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    cookieParser = require('cookie-parser'),
    redisStore = require('connect-redis')(session);

// Initialize express
var trafie = express();

var passportSessions = require('./app/config/sessionsConfig');
// Initialize the routes
var index = require('./app/controllers/index'),
    login = require('./app/controllers/loginController'),
    register = require('./app/controllers/registerController'),
    profile = require('./app/controllers/profileController'),
    activities = require('./app/controllers/activityController'),
    disciplines = require('./app/controllers/disciplineController'),
    emailValidation = require('./app/controllers/emailValidationController'),
    resetPassword = require('./app/controllers/resetPasswordController'),
    dummyData = require('./app/controllers/dummyDataController'),
    api = require('./app/controllers/apiController'),
    feedback = require('./app/controllers/feedbackController'),
    nuke = require('./app/controllers/nukeController'),
    auth = require('./app/controllers/authController'),
    oAuth = require('./app/controllers/oAuthController');

    const db = require('./app/config/dbConfig.js');


/*******************************************************************************************************************************
 * DATABASES                                                                                                                   *
 ******************************************************************************************************************************/

var redisClient = null;
if(db[process.env.NODE_ENV].redis.password) {
    redisClient = redis.createClient(db[process.env.NODE_ENV].redis.port, db[process.env.NODE_ENV].redis.host, {auth_pass: true});
    redisClient.auth(db[process.env.NODE_ENV].redis.password);
} else {
    redisClient = redis.createClient(db[process.env.NODE_ENV].redis.port, db[process.env.NODE_ENV].redis.host);
}

redisClient.on('connect', function() {
	console.log('redis connected');
});

// Mongo db connection
mongoose.connect(db[process.env.NODE_ENV].mongo.url, function (err) {
    if (err) {console.log(err);} else {console.log('mongo connected');}
});


/*******************************************************************************************************************************
 * MODULES                                                                                                                     *
 ******************************************************************************************************************************/

trafie.set('port', process.env.PORT || 3000);
trafie.set('views', path.join(__dirname, 'app/views'));
trafie.set('view engine', 'jade');
trafie.set('view cache', true);
trafie.use(methodOverride());
trafie.use(session({
    store: new redisStore({
        host: db[process.env.NODE_ENV].redis.host,
        port: db[process.env.NODE_ENV].redis.port,
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
trafie.use(express.static(path.join(__dirname, 'public')));
trafie.use(passport.initialize());
trafie.use(passport.session());

// Development only
if (trafie.get('env') === 'development') {
    trafie.use(errorHandler());
}
// Production only
if (trafie.get('env') === 'production') {
    app.use(requireHTTPS);
}

function requireHTTPS(req, res, next) {
    if (!req.secure) {
        //FYI this should work for local development as well
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

/*******************************************************************************************************************************
 * PROFILE                                                                                                                     *
 ******************************************************************************************************************************/

trafie.get('/users/:userId?', profile.get );
trafie.post('/users/:userId?', profile.post );

trafie.get('/api/users/:userId?', passport.authenticate('bearer', { session: false }), profile.get);
trafie.post('/api/users/:userId?', passport.authenticate('bearer', { session: false }), profile.post);


/*******************************************************************************************************************************
 * ACTIVITIES                                                                                                                  *
 ******************************************************************************************************************************/

trafie.get('/users/:userId/activities/:activityId?', activities.get);
trafie.post('/users/:userId/activities', activities.post);
trafie.put('/users/:userId/activities/:activityId', activities.put);
trafie.delete('/users/:userId/activities/:activityId', activities.delete);
trafie.get('/users/:userId/disciplines', disciplines.get);

trafie.get('/api/users/:userId/activities/:activityId?', passport.authenticate('bearer', { session: false }), activities.get);
trafie.post('/api/users/:userId/activities', passport.authenticate('bearer', { session: false }), activities.post );
trafie.put('/api/users/:userId/activities/:activityId', passport.authenticate('bearer', { session: false }), activities.put);
trafie.delete('/api/users/:userId/activities/:activityId', passport.authenticate('bearer', { session: false }), activities.delete);
trafie.get('/api/users/:userId/disciplines', passport.authenticate('bearer', { session: false }), disciplines.get);


/*******************************************************************************************************************************
 * REGISTER                                                                                                                    *
 ******************************************************************************************************************************/

trafie.get('/register', index.getOuterView);
trafie.post('/register', register.post);


/*******************************************************************************************************************************
 * LOGIN                                                                                                                       *
 ******************************************************************************************************************************/

trafie.get('/login', index.getOuterView);
trafie.post('/login', passport.authenticate('local'), login.post);

trafie.post('/authorize', oAuth.authorize);


/*******************************************************************************************************************************
 * EMAIL VALIDATION                                                                                                            *
 ******************************************************************************************************************************/

/**
 * Validate - GET
 * Validates the newly created user
 */
trafie.get('/validate/:hash', emailValidation.validate);

/**
 * Resend validation email - GET
 * Resends the validation email
 */
trafie.get('/resend-validation-email', emailValidation.resendEmail);
trafie.get('/api/resend-validation-email', passport.authenticate('bearer', { session: false }), emailValidation.resendEmail);


/*******************************************************************************************************************************
 * RESET PASSWORD                                                                                                              *
 ******************************************************************************************************************************/

// Reset Password Request - GET
trafie.get('/reset-password-request', index.getOuterView );

// Reset Password Request - GET
trafie.post('/reset-password-request', resetPassword.request.post );

// Reset Password - GET
trafie.get('/reset-password/:hash', index.getOuterView);

// Reset Password - GET
trafie.post('/reset-password/:hash', resetPassword.post);


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
    trafie.get('/dummy-data', dummyData.get);
    trafie.post('/dummy-data', dummyData.post);
}


/*******************************************************************************************************************************
 * API                                                                                                                         *
 ******************************************************************************************************************************/

if( trafie.get('env') === 'development' ) {
    trafie.get('/api', api.get);
    trafie.get('/api-table', api.get_view);
}


/*******************************************************************************************************************************
 * FEEDBACK                                                                                                                    *
 ******************************************************************************************************************************/

trafie.post('/feedback', feedback.post);


/*******************************************************************************************************************************
 * NUCLEAR TEST GROUND                                                                                                         *
 ******************************************************************************************************************************/

if( trafie.get('env') === 'development') {
    trafie.get('/nuke', nuke.get);
}


/*******************************************************************************************************************************
 * VIEWS                                                                                                                       *
 ******************************************************************************************************************************/

trafie.get('*', index.getView);


/*******************************************************************************************************************************
 * SERVER                                                                                                                      *
 ******************************************************************************************************************************/

var port = process.env.PORT || 3000;
require('http').createServer(trafie).listen(port);
console.log('Up and running... port 3000');
