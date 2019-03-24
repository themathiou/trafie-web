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
require('dotenv').config({silent: true});
process.env.TZ = 'UTC';

var express = require('express'),
    router = express.Router(),
    path = require('path'),
    mongoose = require('mongoose'),
    lessMiddleware = require('less-middleware'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    cookieParser = require('cookie-parser'),
    redisStore = require('connect-redis')(session),
    formidable = require('formidable');

// Initialize express
var trafie = express();

var passportSessions = require('./app/config/sessionsConfig');
// Initialize the routes
var index = require('./app/controllers/index'),
    login = require('./app/controllers/loginController'),
    logout = require('./app/controllers/logoutController'),
    register = require('./app/controllers/registerController'),
    profile = require('./app/controllers/profileController'),
    competitions = require('./app/controllers/competitionController'),
    emailValidation = require('./app/controllers/emailValidationController'),
    resetPassword = require('./app/controllers/resetPasswordController'),
    deactivate = require('./app/controllers/deactivateAccountController'),
    feedback = require('./app/controllers/feedbackController'),
    admin = require('./app/controllers/adminController'),
    auth = require('./app/controllers/authController'),
    oAuth = require('./app/controllers/oAuthController');
 import { trainingsDelete, trainingsGet, trainingsPost, trainingsPut } from "./app/controllers/trainingController";

    const db = require('./app/config/dbConfig'),
        redisClient = require('./app/config/redisClientConfig');


/*******************************************************************************************************************************
 * DATABASES                                                                                                                   *
 ******************************************************************************************************************************/

redisClient.on('connect', function() {
	console.log('redis connected');
});

// Mongo db connection
mongoose.connect(db[process.env.NODE_ENV].mongo.url, { useNewUrlParser: true }, function (err) {
    if (err) {console.log(err);} else {console.log('mongo connected');}
});

var sessionObj = session({
    store: new redisStore({
        host: db[process.env.NODE_ENV].redis.host,
        port: db[process.env.NODE_ENV].redis.port,
        client: redisClient,
        ttl: 2592000
    }),
    secret: process.env.SESSION_SECRET || 'sessionSecret',
    resave: true,
    saveUninitialized: false
});


/*******************************************************************************************************************************
 * MODULES                                                                                                                     *
 ******************************************************************************************************************************/

trafie.enable('trust proxy');
trafie.set('port', process.env.PORT || 3000);
trafie.set('views', path.join(__dirname, 'app/views'));
trafie.set('view engine', 'jade');
trafie.set('view cache', true);
trafie.use(methodOverride());
trafie.use(function(req, res, next) {
    var routesWithoutSessions = ['/authorize'];
    if(req.url.startsWith('/api/') || (req.url === '/logout' && req.headers.hasOwnProperty('authorization')) || routesWithoutSessions.indexOf(req.url) >= 0) {
        next();
    }
    else {
        sessionObj(req, res, next);
    }
});
trafie.use(bodyParser.json());
trafie.use(bodyParser.urlencoded({ extended: true }));
trafie.use(cookieParser(process.env.SESSION_SECRET || 'sessionSecret'));
trafie.use(lessMiddleware(path.join(__dirname, 'public')));
trafie.use(express.static(path.join(__dirname, 'public')));
trafie.use(passport.initialize());
trafie.use(passport.session());

// Development only3
if (trafie.get('env') === 'development') {
    trafie.use(errorHandler());
}
// Production only
if (trafie.get('env') === 'production' && process.env.NODE_ENV_INSTANCE !== 'staging') {
    trafie.use(requireHTTPS);
}

function requireHTTPS(req, res, next) {
    if (!req.secure) {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

function filesParserMiddleware(req, res, next) {
    if(req.get('Content-Type').startsWith('multipart/form-data;')) {
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.keepExtensions = true;

        form.parse(req, function(err, fields, files) {
            for(let i in fields) {
                if(fields.hasOwnProperty(i)) {
                    if(['true', 'false'].indexOf(fields[i]) >= 0) {
                        fields[i] = fields[i] === 'true';
                    }
                    else if(fields[i] === 'null') {
                        fields[i] = null;
                    }
                    else if(typeof fields[i] === 'string' && fields[i].startsWith('{') && fields[i].endsWith('}')) {
                        try {
                            fields[i] = JSON.parse(fields[i]);
                        } catch(e) {}
                    }
                }
            }
            req.body = fields;
            req.files = files;
            next();
        });
    } else {
        next();
    }
}


/*******************************************************************************************************************************
 * USER_ID                                                                                                              *
 ******************************************************************************************************************************/

trafie.get('/user-id', profile.getUserId);


/*******************************************************************************************************************************
 * PROFILE                                                                                                                     *
 ******************************************************************************************************************************/

trafie.get('/users/:userId?', profile.get);
trafie.post('/users/:userId?', filesParserMiddleware, profile.post);

trafie.get('/api/users/:userId?', passport.authenticate('bearer', { session: false }), profile.get);
trafie.post('/api/users/:userId?', filesParserMiddleware, passport.authenticate('bearer', { session: false }), profile.post);


/*******************************************************************************************************************************
 * ACTIVITIES                                                                                                                  *
 ******************************************************************************************************************************/

trafie.get('/users/:userId/activities/:competitionId?', competitions.get);
trafie.post('/users/:userId/activities', filesParserMiddleware, competitions.post);
trafie.put('/users/:userId/activities/:competitionId', filesParserMiddleware, competitions.put);
trafie.delete('/users/:userId/activities/:competitionId', competitions.delete);

trafie.get('/api/users/:userId/activities/:competitionId?', passport.authenticate('bearer', { session: false }), competitions.get);
trafie.post('/api/users/:userId/activities', filesParserMiddleware, passport.authenticate('bearer', { session: false }), competitions.post);
trafie.put('/api/users/:userId/activities/:competitionId', filesParserMiddleware, passport.authenticate('bearer', { session: false }), competitions.put);
trafie.delete('/api/users/:userId/activities/:competitionId', passport.authenticate('bearer', { session: false }), competitions.delete);


/*******************************************************************************************************************************
 * COMPETITIONS                                                                                                                *
 ******************************************************************************************************************************/

trafie.get('/users/:userId/competitions/:competitionId?', competitions.get);
trafie.post('/users/:userId/competitions', filesParserMiddleware, competitions.post);
trafie.put('/users/:userId/competitions/:competitionId', filesParserMiddleware, competitions.put);
trafie.delete('/users/:userId/competitions/:competitionId', competitions.delete);

trafie.get('/api/users/:userId/competitions/:competitionId?', passport.authenticate('bearer', { session: false }), competitions.get);
trafie.post('/api/users/:userId/competitions', filesParserMiddleware, passport.authenticate('bearer', { session: false }), competitions.post);
trafie.put('/api/users/:userId/competitions/:competitionId', filesParserMiddleware, passport.authenticate('bearer', { session: false }), competitions.put);
trafie.delete('/api/users/:userId/competitions/:competitionId', passport.authenticate('bearer', { session: false }), competitions.delete);


/*******************************************************************************************************************************
 * TRAININGS                                                                                                                   *
 ******************************************************************************************************************************/

trafie.get('/users/:userId/trainings/:trainingId?', trainingsGet);
trafie.post('/users/:userId/trainings', trainingsPost);
trafie.put('/users/:userId/trainings/:trainingId', trainingsPut);
trafie.delete('/users/:userId/trainings/:trainingId', trainingsDelete);

trafie.get('/api/users/:userId/trainings/:trainingId?', passport.authenticate('bearer', { session: false }), trainingsGet);
trafie.post('/api/users/:userId/trainings', passport.authenticate('bearer', { session: false }), trainingsPost);
trafie.put('/api/users/:userId/trainings/:trainingId', passport.authenticate('bearer', { session: false }), trainingsPut);
trafie.delete('/api/users/:userId/trainings/:trainingId', passport.authenticate('bearer', { session: false }), trainingsDelete);


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
trafie.get('/validate-email/:hash', index.getOuterView);
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
trafie.get('/reset-password-request', index.getOuterView);

// Reset Password Request - GET
trafie.post('/reset-password-request', resetPassword.request.post);

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
trafie.get('/logout', logout.get);


/*******************************************************************************************************************************
 * DEACTIVATE                                                                                                                  *
 ******************************************************************************************************************************/

/**
 * Deactivate - POST
 */
trafie.post('/deactivate-account', deactivate.post);


/*******************************************************************************************************************************
 * FEEDBACK                                                                                                                    *
 ******************************************************************************************************************************/

trafie.post('/feedback', feedback.post);


/*******************************************************************************************************************************
 * ADMIN                                                                                                                       *
 ******************************************************************************************************************************/

trafie.get('/admin/users', admin.getUsers);
trafie.delete('/admin/users/:userId', admin.deleteUser);


/*******************************************************************************************************************************
 * VIEWS                                                                                                                       *
 ******************************************************************************************************************************/

trafie.get('/terms-of-service', index.getOuterView);
trafie.get('/privacy', index.getOuterView);
trafie.get('/about', index.getOuterView);
trafie.get('*', index.getView);


/*******************************************************************************************************************************
 * SERVER                                                                                                                      *
 ******************************************************************************************************************************/

var port = process.env.PORT || 3000;
require('http').createServer(trafie).listen(port);
console.log('Up and running... port', port);
