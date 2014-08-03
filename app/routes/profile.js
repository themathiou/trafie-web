// Loading models
var Profile = require('../models/profile.js'),
    Activity = require('../models/activity.js');

// Loading helpers
var mainHelper = require('../helpers/main_helper.js');
    activityHelper = require('../helpers/activity.js');

// Initialize translations
var translations = require('../languages/translations.js');

/**
 * Profile - GET
 */
exports.get = function( req, res ){
  if( typeof req.session.user_id === 'undefined' || typeof req.params.profile_id === 'undefined' ) {
    res.json( null );
  }

  mainHelper.validateAccess( req.session.user_id, req.params.profile_id, function( response ){
    if( response.success ) {
      send_profile_data( res, response.profile, response.user );
    } else {
      if( response.error == 'query_error' ) {
        send_error( res );
      } else {
        res.json( null );
      }
    }
  });
};

/**
 * Sends the profile data as a JSON object
 * @param  object res          (the response object)
 * @param  object profile_data (the data of the profile before they get formatted according the the user's preferences)
 * @param  object user_data    (the object that contains the data of the user who is viewing the profile)
 * @return object              (the profile data as a json object)
 */
function send_profile_data( res, profile_data, user_data ) {
  if( profile_data.private && profile_data._id !== user_data._id ) {
    res.json( null );
  }

  var tr = translations[user_data.language];
  var gender = profile_data.male ? tr['male'] : tr['female'];
  var formatted_discipline = profile_data.discipline ? tr[profile_data.discipline] : '';
  var country = profile_data.country ? tr[profile_data.country] : '';

  var disciplines = {
      '100m':           tr['100m'],
      '200m':           tr['200m'],
      '400m':           tr['400m'],
      '800m':           tr['800m'],
      '1500m':          tr['1500m'],
      '3000m':          tr['3000m'],
      '60m_hurdles':    tr['60m_hurdles'],
      '100m_hurdles':   tr['100m_hurdles'],
      '110m_hurdles':   tr['110m_hurdles'],
      '400m_hurdles':   tr['400m_hurdles'],
      '3000m_steeple':  tr['3000m_steeple'],
      '4x100m_relay':   tr['4x100m_relay'],
      '4x400m_relay':   tr['4x400m_relay'],
      'marathon':       tr['marathon'],
      'high_jump':      tr['high_jump'],
      'long_jump':      tr['long_jump'],
      'triple_jump':    tr['triple_jump'],
      'pole_vault':     tr['pole_vault'],
      'shot_put':       tr['shot_put'],
      'discus':         tr['discus'],
      'hammer':         tr['hammer'],
      'javelin':        tr['javelin'],
      'pentathlon':     tr['pentathlon'],
      'heptathlon':     tr['heptathlon'],
      'decathlon':      tr['decathlon']
  };

  var profile = {
    '_id':                  profile_data._id,
    'first_name':           profile_data.first_name,
    'last_name':            profile_data.last_name,
    'discipline':           profile_data.discipline,
    'formatted_discipline': formatted_discipline,
    'country':              country,
    'gender':               gender,
    'picture':              profile_data.picture,
    'disciplines':          disciplines
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
    var activities = activityHelper.formatActivities( activities, user_data.language, user_data.date_format );
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