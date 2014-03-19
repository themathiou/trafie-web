var User = require('../models/user.js');
var Profile = require('../models/profile.js');
var UserHashes = require('../models/user_hashes.js');

var Email = require('../libs/email');


exports.request = {};


/**
 * Reset Password Request - GET
 */
exports.request.get = function( req, res ) {
  var view_data = {
    'error': ''
  };
  res.render( 'reset_password_request', view_data );
};


/**
 * Reset Password Request - POST
 */
exports.request.post = function( req, res ) {
  var email = req.body.email;
  var user_id = '';
  var first_name = '';
  var last_name = '';
  var view_data = {
    'error': ''
  };
  User.schema.findOne({ 'email': email }, 'email _id')
  .then(function( response ) {
    if( !response ) {
      view_data.error = 'Email not found';
      res.render( 'reset_password_request', view_data );
      return;
    }
    user_id = response._id;
    return Profile.schema.findOne( { '_id': user_id }, 'first_name last_name' );
  })
  .then(function( response ) {
    first_name = response.first_name;
    last_name = response.last_name;

    return UserHashes.schema.createResetPasswordHash( user_id );
  })
  .then(function( response ) {
    Email.send_reset_password_email( email, first_name, last_name, response, req.headers.host );
    view_data.email = email;
    res.render( 'reset_password_email_sent', view_data );
  });
};


/**
 * Reset Password - GET
 */
exports.get = function( req, res ) {
  var view_data = {
    'errors': {
      'password'        : '',
      'repeat_password' : ''
    }
  };

  UserHashes.schema.findUserIdByHash( req.params.hash, 'reset' )
  .then( function( response ) {
    if( response ) {
      res.render( 'reset_password', view_data );
    } else {
      res.redirect('/login');
    }
  })
};

/**
 * Reset Password - GET
 */
exports.post = function( req, res ) {
  var password = req.body.password;
  var repeat_password = req.body.repeat_password;
  var hash = req.params.hash;
  var errors = false;
  var view_data = {
    'errors': {
      'password'        : '',
      'repeat_password' : ''
    }
  };
  var user_id = '';

  if( !User.schema.validatePassword( password ) ) {
    errors = true;
    view_data.errors.password = 'Password should be at least 6 characters long';
  }
  if( password != repeat_password ) {
    errors = true;
    view_data.errors.repeat_password = 'Passwords do not match';
  }

  if( errors ) {
    res.render( 'reset_password', view_data );
  }

  UserHashes.schema.findUserIdByHash( hash, 'reset' )
  .then( function( response ) {
    if( response ) {
      user_id = response.user_id;
      return User.schema.resetPassword( user_id, password );
    } else {
      res.redirect('/login');
    }
  }).then( function() {
    UserHashes.schema.deleteHash( hash, 'reset' );
    // Storing the user id in the session
    req.session.user_id = user_id;
    res.redirect('/');
  });
};