var User = require('../models/user.js');
var Profile = require('../models/profile.js');
var UserHashes = require('../models/user_hashes.js');

var Email = require('../libs/email');


/**
 * Email validation - GET
 * Shows a page that just informs the user to check their email
 * in order to validate their account
 */
exports.validation_email_sent = function( req, res ) {
  var user_id = req.params.user_id;
  User.schema.findOne({ '_id': user_id }, 'email valid')
  .then(function(response) {
    if( !response.email || response.valid ) {
      res.redirect('/login');
    }

    res.render('validation_email_sent', { 'email': response.email, 'resend': req.params.resend, 'user_id': user_id } );
  });
};


/**
 * Validate - GET
 * Validates the newly created user
 */
exports.validate = function( req,res ){
  var user_id = '';
  UserHashes.schema.findUserIdByHash( req.params.hash, 'verify' )
  .then( function( response ) {
    if( response ) {
      user_id = response.user_id;
      return User.schema.validateUser( response.user_id );
    } else {
      res.redirect('/login');
    }
  }).then( function(){
    UserHashes.schema.deleteHash( req.params.hash, 'verify' );
    // Storing the user id in the session
    req.session.user_id = user_id;
    res.redirect('/');
  });
};


/**
 * Resend validation email - GET
 * Resends the validation email
 */
exports.resend_validation_email = function( req, res ) {
  var email = '';
  var first_name = '';
  var last_name = '';
  var user_id = req.params.user_id;
  User.schema.findOne({ '_id': user_id }, 'email valid')
  .then(function( response ) {
    if( !response.email || response.valid ) {
      res.redirect('/login');
    }
    email = response.email;
    return Profile.schema.findOne( { '_id': user_id }, 'first_name last_name' );
  })
  .then(function( response ) {
    first_name = response.first_name;
    last_name = response.last_name;
    return UserHashes.schema.findValidationHashByUserId( user_id );
  })
  .then(function( response ) {
    Email.send_verification_email( email, first_name, last_name, response.hash, req.headers.host );

    res.redirect('/validation_email_sent/1/' + user_id);
  });
};