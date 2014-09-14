'use strict';

// Loading models
var User = require('../models/user.js'),
    Profile = require('../models/profile.js'),
    UserHashes = require('../models/user_hashes.js');

// Loading helpers
var profileHelper = require('../helpers/profile.js'),
    userHelper = require('../helpers/user.js');

// Loading libraries
var Email = require('../libs/email');


exports.get = function( req, res ) {
  if( typeof req.session.user_id !== 'undefined' ) {
    res.redirect('/');
  }

  res.render( 'register', { errors: {}, fields: { 'first_name': '', 'last_name': '', 'email': '' } } );
};


exports.post = function( req, res ) {
  if( typeof req.session.user_id !== 'undefined' ) {
    res.redirect('/');
  }
  
  var error_messages = {};
  var errors = false;

  // Initializing the input values
  var first_name = typeof req.body.first_name !== 'undefined' ? req.body.first_name.trim() : '';
  var last_name = typeof req.body.last_name !== 'undefined' ? req.body.last_name.trim() : '';
  var email = typeof req.body.email !== 'undefined' ? req.body.email.trim().toLowerCase() : '';
  var password = typeof req.body.password !== 'undefined' ? req.body.password : '';
  var repeat_password = typeof req.body.repeat_password !== 'undefined' ? req.body.repeat_password : '';

  // Generating error messages
  if( !password ) {
    error_messages.password = 'Password is required';
    errors = true;
  }
  else if( !errors && !userHelper.validatePassword( password ) ) {
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
  else if( !userHelper.validateEmail( email ) ) {
    error_messages.email = 'Email is not valid';
    errors = true;
  }
  if( !first_name ) {
    error_messages.first_name = 'First name is required';
    errors = true;
  }
  else if( !profileHelper.validateName( first_name ) ) {
    error_messages.first_name = 'First name can only have latin characters';
    errors = true;
  }
  if( !last_name ) {
    error_messages.last_name = 'Last name is required';
    errors = true;
  }
  else if( !profileHelper.validateName( last_name ) ) {
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
    password = userHelper.encryptPassword( password );

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
      .then( function(profile){
        return UserHashes.schema.createVerificationHash(new_user.email, user._id);})
      .then( function( email_hash ) {
        Email.send_verification_email( new_user.email, new_profile.first_name, new_profile.last_name, email_hash, req.headers.host );

  			// Redirecting to the profile
  			res.redirect( '/validation_email_sent/0/' + user._id );
  		});
  	});

  });
};