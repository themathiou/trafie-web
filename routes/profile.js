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
      // If the profile was found, get the data of the user
      if( profile_data !== null && profile_data !== undefined ) {
        prerender_other_profile( res, user_id, profile_data );
      } else {
        // If the profile wasn't found, try to find it by username
        return Profile.schema.findOne({ 'username': req.params.profile_id }, '_id first_name last_name discipline country male picture');
      }
    })
    .then( function( profile_data ) {
      // If the profile was found, get the data of the user
      if( profile_data !== null && profile_data !== undefined ) {
        prerender_other_profile( res, user_id, profile_data );
      } else {
        // Else, the user was searching for a profile that doesn't exist
        res.redirect('/');
      }
    })
    .fail( function( error ) {
      send_error_page( error, res );
    });
  }
  // If the user is not searching for a particular profile, he wants to view his own (no parameter "/")
  else if( user_id ) {
    prerender_my_profile( res, user_id );
  } else {
    // If no user_id was provided, redirect to the registration screen
	  res.redirect('/register');
  }
};

/**
 * Gets data about the user and his profile that is going to be rendered later
 * @param object res
 * @param string user_id
 */
function prerender_my_profile( res, user_id ) {
  // Get the user and his profile
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
  })
  .fail( function( error ) {
    send_error_page( error, res );
  });
}

/**
 * Gets data about the user only. The profile data have already been loaded.
 * In this case, the profile probably belongs to another user
 * @param object res
 * @param string user_id
 * @param object profile_data
 */
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
    })
    .fail( function( error ) {
      send_error_page( error, res );
    });
  } else {
    // Load default data for the user
    var user_data = {
      '_id'         : '',
      'first_name'  : '',
      'language'    : 'en',
      'date_format' : 'd-m-y'
    };
    render( res, user_data, profile_data);
  }
}

/**
 * Getting the activities and rendering the profile
 * @param object res
 * @param object user_data
 * @param object profile_data
 */
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
  })
  .fail( function( error ) {
    send_error_page( error, res );
  });
}

/**
 * Sends an error page in case a query fails
 * @param string error
 * @param object res
 */
function send_error_page( error, res ) {
  res.statusCode = 500;
  res.sendfile('./views/five_oh_oh.html');
}