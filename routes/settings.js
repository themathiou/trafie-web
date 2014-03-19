// Initialize translations
var translations = [];
translations['en'] = require('../languages/en.js');
translations['gr'] = require('../languages/gr.js');

var User = require('../models/user.js');
var Profile = require('../models/profile.js');


exports.get = function( req, res ){
  var first_name, last_name;
  var user_id = req.session.user_id;
  var errors = {};

  // If there is no user id in the session, redirect to register screen
  if( !user_id ) {
    res.redirect('/register');
  // Else, fetch the first name and the last name of the user from the database
  } else {
    render( res, user_id, errors );
  }
};


exports.post = function( req, res ){
  var user_id = req.session.user_id;

  // If there is no user id in the session, redirect to register screen
  if(!user_id) {
    res.redirect('/register');
  }
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
  if( typeof req.body.birthday_day !== 'undefined' && typeof req.body.birthday_month !== 'undefined' && typeof req.body.birthday_year !== 'undefined' ) {
    post_data.birthday = {};
    post_data.birthday.day = req.body.birthday_day;
    post_data.birthday.month = req.body.birthday_month;
    post_data.birthday.year = req.body.birthday_year;
    if( !Profile.schema.validateBirthday( post_data.birthday ) ) {
      errors = true;
    }
  }
  if( typeof req.body.gender !== 'undefined' ) {
    if( !Profile.schema.validateGender( req.body.gender ) ) {
      errors = true;
    } else {
      post_data.male = req.body.gender == 'male';
    }
  }
  if( typeof req.body.country !== 'undefined' ) {
    if( !Profile.schema.validateCountry( req.body.country ) ) {
      errors = true;
    } else {
      post_data.country = req.body.country;
    }
  }
  if( typeof req.body.discipline !== 'undefined' ) {
    if( !Profile.schema.validateDiscipline( req.body.discipline ) ) {
      errors = true;
    } else {
      post_data.discipline = req.body.discipline;
    }
  }
  if( typeof req.body.about !== 'undefined' ) {
    if( !Profile.schema.validateAbout( req.body.about ) ) {
      errors = true;
    } else {
      post_data.about = req.body.about;
    }
  }
  if( typeof req.body.old_password !== 'undefined' && typeof req.body.new_password !== 'undefined' && req.body.repeat_new_password ) {
    
  }

  // If there are errors, do not update the profile
  if( errors ) {
    render( res, user_id, errors );
  // Else, fetch the first name and the last name of the user from the database
  } else {
    Profile.update({ '_id': user_id }, { $set: post_data }, { upsert: true }, function( error ) {
      render( res, user_id, errors );
    });
  }
};


function render( res, user_id, errors ) {
  Profile.schema.findOne({ '_id': user_id }, 'first_name last_name discipline about male country birthday')
  .then( function( response ) {
    // Format the data that will go to the front end
    var gender = '';
    if( response.male === true ) {
      gender = 'male';
    }
    else if( response.male === false ) {
      gender = 'female';
    }
    var birthday = {};
    birthday.day = response.birthday.day ? response.birthday.day : '';
    birthday.month = response.birthday.month ? response.birthday.month : '';
    birthday.year = response.birthday.year ? response.birthday.year : '';

    var view_data = {
      'profile': {
        'first_name': response.first_name,
        'last_name' : response.last_name,
        'discipline': response.discipline,
        'about'     : response.about,
        'gender'    : gender,
        'country'   : response.country,
        'birthday'  : birthday
      },
      'errors'  : errors,
      'tr'      : translations['en'].getSettingsTranslations()
    };

    res.render( 'settings', view_data );
  });
}