var Profile = require('../models/profile.js'),
    Activity = require('../models/activity.js');

// Initialize translations
var translations = require('../languages/translations.js');


/**
 * Profile - GET
 */
exports.get = function( req, res ){
  var user_id = req.session.user_id;

  // When there is a username in the url
  if( typeof req.params.profile_id !== 'undefined' ) {
    // Find the profile by id
    Profile.schema.findOne({ '_id': req.params.profile_id }, '_id first_name last_name discipline country male picture')
    .then( function( profile_data ) {
      if( profile_data !== null && profile_data !== undefined ) {
        prerender_other_profile( res, user_id, profile_data );
      } else {
        // Find user by username
        return Profile.schema.findOne({ 'username': req.params.profile_id }, '_id first_name last_name discipline country male picture');
      }
    })
    .then( function( profile_data ) {
      if( profile_data !== null && profile_data !== undefined ) {
        prerender_other_profile( res, user_id, profile_data );
      } else {
        res.redirect('/');
      }
    });
  }
  else if( user_id ) {
    prerender_my_profile( res, user_id );
  } else {
	  res.redirect('/register');
  }
};

function prerender_my_profile( res, user_id ) {
  Profile.schema.findOne( { '_id': user_id }, '_id first_name last_name discipline country male picture language date_format' ).then( function( profile_data ) {
    // If the user was found
    if( typeof profile_data.first_name !== 'undefined' ) {
      var user_data = {
        '_id'         : profile_data._id,
        'first_name'  : profile_data.first_name,
        'language'    : profile_data.language,
        'date_format' : profile_data.date_format
      };
      render( res, user_data, profile_data );
    // If the user wasn't found
    } else {
      res.redirect('/login');
    }
  });
}

function prerender_other_profile( res, user_id, profile_data ) {
  if( user_id ) {
    Profile.schema.findOne( { '_id': user_id }, '_id first_name language date_format' )
    .then( function( user_data ) {
      // If the user was found
      if( typeof user_data.first_name !== 'undefined' ) {
        render( res, user_data, profile_data );
      // If the user wasn't found
      } else {
        res.redirect('/login');
      }
    });
  } else {
    var user_data = {
      '_id'         : '',
      'first_name'  : '',
      'language'    : 'en',
      'date_format' : 'd-m-y'
    };
    render( res, user_data, profile_data);
  }
}

function render( res, user_data, profile_data ) {
  Activity.schema.getActivitiesOfUser( { 'user_id': profile_data._id }, null, -1 )
  .then( function( activities ) {
    // Format the activity data
    var activities = Activity.schema.formatActivities( activities, user_data.language, user_data.date_format );
    var disciplines = {
      'time': [
        '100m',
        '200m',
        '400m',
        '800m',
        '1500m',
        '3000m',
        '60m_hurdles',
        '100m_hurdles',
        '110m_hurdles',
        '400m_hurdles',
        '3000m_steeple',
        '4x100m_relay',
        '4x400m_relay',
        'marathon'
      ],
      'distance': [
        'high_jump',
        'long_jump',
        'triple_jump',
        'pole_vault',
        'shot_put',
        'discus',
        'hammer',
        'javelin'
      ],
      'points': [
        'pentathlon',
        'heptathlon',
        'decathlon'
      ]
    };

    var picture = profile_data.picture ? profile_data.picture : ( profile_data.male ? '/images/profile_pics/default_male.png' : '/images/profile_pics/default_female.png' );

    // The data that will go to the front end
    var view_data = {
      'profile': {
        '_id'         : profile_data._id,
        'first_name'  : profile_data.first_name,
        'last_name'   : profile_data.last_name,
        'discipline'  : profile_data.discipline,
        'country'     : profile_data.country,
        'picture'     : picture
      },
      'user': {
        '_id'         : user_data._id,
        'first_name'  : user_data.first_name
      },
      'disciplines' : disciplines,
      'activities'  : activities,
      'tr'          : translations[user_data.language],
      'section'     : 'profile'
    };

    res.render( 'profile', view_data );
  });
}