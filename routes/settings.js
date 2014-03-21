// Initialize translations
var translations = [];
translations['en'] = require('../languages/en.js');
translations['gr'] = require('../languages/gr.js');

var User = require('../models/user.js');
var Profile = require('../models/profile.js');


exports.get = function( req, res ){
  var first_name, last_name;
  var user_id = req.session.user_id;
  var update = '';
  var error_messages = '';

  // If there is no user id in the session, redirect to register screen
  if( !user_id ) {
    res.redirect('/register');
  // Else, fetch the first name and the last name of the user from the database
  } else {
    render( res, user_id, error_messages );
  }
};


exports.post = function( req, res ){
  var user_id = req.session.user_id;

  // If there is no user id in the session, redirect to register screen
  if(!user_id) {
    res.redirect('/register');
  }

  var error_messages = {};
  var update = '';
  var profile_data = {};
  var user_data = {};
  var errors = false;

  if( typeof req.body.first_name !== 'undefined' ) {
    profile_data.first_name = req.body.first_name;
    if( !Profile.schema.validateName( profile_data.first_name ) ) {
      error_messages.first_name = 'Invalid name';
      errors = true;
    } else {
      update = 'profile';
    }
  }

  if( typeof req.body.last_name !== 'undefined' ) {
    profile_data.last_name = req.body.last_name;
    if( !Profile.schema.validateName( profile_data.last_name ) ) {
      error_messages.last_name = 'Invalid name';
      errors = true;
    } else {
      update = 'profile';
    }
  }

  if( typeof req.body.birthday_day !== 'undefined' && typeof req.body.birthday_month !== 'undefined' && typeof req.body.birthday_year !== 'undefined' ) {
    profile_data.birthday = {};
    profile_data.birthday.day = req.body.birthday_day;
    profile_data.birthday.month = req.body.birthday_month;
    profile_data.birthday.year = req.body.birthday_year;
    if( !Profile.schema.validateBirthday( profile_data.birthday ) ) {
      errors = true;
    } else {
      update = 'profile';
    }
  }

  if( typeof req.body.gender !== 'undefined' ) {
    if( !Profile.schema.validateGender( req.body.gender ) ) {
      errors = true;
    } else {
      profile_data.male = req.body.gender == 'male';
      update = 'profile';
    }
  }

  if( typeof req.body.country !== 'undefined' ) {
    if( !Profile.schema.validateCountry( req.body.country ) ) {
      errors = true;
    } else {
      profile_data.country = req.body.country;
      update = 'profile';
    }
  }

  if( typeof req.body.discipline !== 'undefined' ) {
    if( !Profile.schema.validateDiscipline( req.body.discipline ) ) {
      errors = true;
    } else {
      profile_data.discipline = req.body.discipline;
      update = 'profile';
    }
  }

  if( typeof req.body.about !== 'undefined' ) {
    if( !Profile.schema.validateAbout( req.body.about ) ) {
      errors = true;
    } else {
      profile_data.about = req.body.about;
      update = 'profile';
    }
  }

  if( typeof req.body.old_password !== 'undefined' && typeof req.body.password !== 'undefined' && req.body.repeat_password ) {
    if( req.body.password !== req.body.old_password ) {
      errors = true;
      error_messages.repeat_password = 'passwords_do_not_match';

      User.schema.findOne({ '_id': user_id }, 'password')
      .then( function( response ){
        if( typeof response.password === 'undefined' ) {
          redirect('/register');
        }
        else { 
          if( response.password !== req.body.old_password ) {
            errors = true;
            error_messages.old_password = 'wrong_password';
          }
          if( !User.schema.validatePassword( req.body.password ) ) {
            errors = true;
            error_messages.password = 'password_should_be_at_least_6_characters_long';
          }
          user_data.password = req.body.password;
          update = 'user';
        }
      });
    }
  }

  // If there are errors, do not update the profile
  if( errors ) {
    render( res, user_id, error_messages );
  // Else, fetch the first name and the last name of the user from the database
  } else {
    if( update == 'profile' ) {
      Profile.update({ '_id': user_id }, { $set: profile_data }, { upsert: true }, function( error ) {
        render( res, user_id, error_messages );
      });
    } else {
      User.update({ '_id': user_id }, { $set: user_data }, { upsert: true }, function( error ) {
        render( res, user_id, error_messages );
      });
    }
  }
};


function render( res, user_id, error_messages ) {
  Profile.schema.findOne({ '_id': user_id }, 'first_name last_name discipline about male country birthday')
  .then( function( response ) {
    if( typeof response.first_name === 'undefined' ) redirect('/register');
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

    var disciplines = ['100m','200m','400m','800m','1500m','3000m','60m_hurdles','100m_hurdles','110m_hurdles','400m_hurdles','3000m_steeple','4x100m_relay','4x400m_relay','marathon','high_jump','long_jump','triple_jump','pole_vault','shot_put','discus','hammer','javelin','pentathlon','heptathlon','decathlon'];

    console.log( error_messages );

    var view_data = {
      'profile': {
        'first_name'  : response.first_name,
        'last_name'   : response.last_name,
        'discipline'  : response.discipline,
        'about'       : response.about,
        'gender'      : gender,
        'country'     : response.country,
        'birthday'    : birthday,
        'disciplines' : disciplines
      },
      'errors'  : error_messages,
      'tr'      : translations['en'].getSettingsTranslations()
    };

    res.render( 'settings', view_data );
  });
}