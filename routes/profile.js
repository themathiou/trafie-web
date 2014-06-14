var Profile = require('../models/profile.js'),
    Activity = require('../models/activity.js');

// Initialize translations
var translations = require('../languages/translations.js');

/**
 * Profile - GET
 */
exports.get = function( req, res ){
  if( typeof req.session.user_id === 'undefined' ) {
    res.json( null );
  }

  var user_id = req.session.user_id;

  // When there is a profile_id or a username in the url
  if( typeof req.params.profile_id !== 'undefined' ) {
    Profile.schema.findOne({ '_id': user_id }, 'language date_format').then( function( user_data ) {

      // Find the profile by id
      Profile.schema.findOne({ '_id': req.params.profile_id }, '_id first_name last_name discipline country male picture')
      .then( function( profile_data ) {

        // If the profile was found, get the data of the user
        if( profile_data !== null && profile_data !== undefined ) {
          send_profile_data( res, profile_data, user_data );
        } else {
          // If the profile wasn't found, try to find it by username
          Profile.schema.findOne({ 'username': req.params.profile_id }, '_id first_name last_name discipline country male picture')
          .then( function( profile_data ) {

            // If the profile was found, get the data of the user
            if( profile_data !== null && profile_data !== undefined ) {
              send_profile_data( res, profile_data, user_data );
            } else {
              // Else, the user was searching for a profile that doesn't exist
              res.json( null );
            }
            
          })
          .fail( function( error ) {
            send_error( res, error );
          });
        }

      })
      .fail( function( error ) {
        send_error( res, error );
      });

    })
    .fail( function( error ) {
        send_error( res, error );
    });
  } else {
    // If no profile id was provided, return null
	  res.json( null );
  }
};

/**
 * Sends the profile data as a JSON object
 * @param  object res          (the response object)
 * @param  object profile_data (the data of the profile before they get formatted according the the user's preferences)
 * @param  object user_data    (the object that contains the data of the user who is viewing the profile)
 * @return object              (the profile data as a json object)
 */
function send_profile_data( res, profile_data, user_data ) {
  var tr = translations[user_data.language];
  var gender = profile_data.male ? tr['male'] : tr['female'];
  var discipline = profile_data.discipline ? tr[profile_data.discipline] : '';
  var country = profile_data.country ? tr[profile_data.country] : '';

  var profile = {
    '_id':        profile_data._id,
    'first_name': profile_data.first_name,
    'last_name':  profile_data.last_name,
    'discipline': discipline,
    'country':    country,
    'gender':     gender,
    'picture':    profile_data.picture
  }

  res.json( profile );
}

/**
 * Sends an error in case a query fails
 * @param string error
 * @param object res
 */
function send_error( res, error ) {
  res.statusCode = 500;
  res.json( null );
}

exports.get_view = function( req, res ) {
  if( typeof req.session.user_id === 'undefined' ) {
    return null;
  }

  var user_id = req.session.user_id;

  // Get the user and his profile
  Profile.schema.findOne( { '_id': user_id }, 'language date_format' ).then( function( profile_data ) {
    if( profile_data.language ) {
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

      // The data that will go to the front end
      var view_data = {
        'disciplines' : disciplines,
        'tr'          : translations[profile_data.language]
      };

      res.render( 'profile', view_data );
    } else {
      return null;
    }
  })
  .fail( function( error ) {
    send_error_page( error, res );
  });
};

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