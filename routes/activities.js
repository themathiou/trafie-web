var path = require('path'),
    root_dir = path.dirname( require.main.filename );

var Profile = require('../models/profile.js'),
    Activity = require('../models/activity.js');

// Initialize translations
var translations = require('../languages/translations.js');


/**
 * Activities - GET
 */
exports.get = function( req, res ){
  var user_id = req.session.user_id;

  if( !user_id || ( user_id !== req.params.user_id ) ) {
	  return_activity( res, 403, '', 'en', 'd-m-y' );
  } else {
    // Find the profile
    Profile.schema.findOne({ '_id': user_id }, 'language date_format')
    .then( function( profile_data ) {
      // If the profile doesn't exist, return an empty json
      if( typeof profile_data.language === 'undefined' ) return_activity( res, 404, '', 'en', 'd-m-y' );

      if( typeof req.params.activity_id !== 'undefined' ) {
        return_activity( res, 200, req.params.activity_id, profile_data.language, profile_data.date_format );
      } else {
        return_activities( res, 200, { 'user_id': user_id }, profile_data.language, profile_data.date_format );
      }
    });
  }
};


/**
 * Activities - POST
 */
exports.post = function( req, res ) {
  // Get the user id from the session
  var user_id = req.session.user_id;
  // If there is no user id, redirect to login
  if( !user_id || ( user_id !== req.params.user_id ) ) {
    return_activity( res, 403, '', 'en', 'd-m-y' );
  } else {
    // Find the profile
    Profile.schema.findOne({ '_id': user_id }, 'language date_format')
    .then( function( profile_data ) {
      // If the profile doesn't exist, redirect
      if( typeof profile_data.language === 'undefined' ) return_activity( res, 404, '', 'en', 'd-m-y' );

      var discipline = typeof req.body.discipline !== 'undefined' ? req.body.discipline : '';
      var date = typeof req.body.date !== 'undefined' && req.body.date ? Activity.schema.parseDate( req.body.date ) : new Date();
      var performance = {};
      
      switch ( discipline ) {
        case '100m':
        case '200m':
        case '400m':
        case '800m':
        case '1500m':
        case '3000m':
        case '60m_hurdles':
        case '100m_hurdles':
        case '110m_hurdles':
        case '400m_hurdles':
        case '3000m_steeple':
        case '4x100m_relay':
        case '4x400m_relay':
        case 'marathon':
          // Get the posted values. If a value was not posted, replace it with 00
          performance.hours = typeof req.body.hours !== 'undefined' && req.body.hours != '' ? req.body.hours : '00';
          performance.minutes = typeof req.body.minutes !== 'undefined' && req.body.minutes != '' ? req.body.minutes: '00';
          performance.seconds = typeof req.body.seconds !== 'undefined' && req.body.seconds != '' ? req.body.seconds: '00';
          performance.centiseconds = typeof req.body.centiseconds !== 'undefined' && req.body.centiseconds != '' ? req.body.centiseconds : '00';
          // Format the performance
          performance = Activity.schema.validateTime( performance );

          break;
        case 'high_jump':
        case 'long_jump':
        case 'triple_jump':
        case 'pole_vault':
        case 'shot_put':
        case 'discus':
        case 'hammer':
        case 'javelin':
          // Get the posted values. If a value was not posted, replace it with 0
          performance.distance_1 = typeof req.body.distance_1 !== 'undefined' && req.body.distance_1 != '' ? req.body.distance_1 : '0';
          performance.distance_2 = typeof req.body.distance_2 !== 'undefined' && req.body.distance_2 != '' ? req.body.distance_2: '0';

          // Format the performance
          performance = Activity.schema.validateDistance( performance );
          break;
        case 'pentathlon':
        case 'heptathlon':
        case 'decathlon':
          // Get the posted values. If a value was not posted, replace it with null
          performance.points = typeof req.body.points !== 'undefined' ? req.body.points : null;

          // Format the performance
          performance = Activity.schema.validatePoints( performance );
          break;
        default:
          performance = null;
          break;
      }

      // If there is a valid performance value
      if( performance !== null ) {

        // Create the record that will be inserted in the db
        var new_activity = {
          'user_id'     : user_id,
          'discipline'  : discipline,
          'performance' : performance,
          'date'        : date
        };

        var activity = new Activity( new_activity );
        // Save the activity
        activity.save(function ( err, activity ) {
          return_activity( res, 201, activity._id, profile_data.language, profile_data.date_format );
        });
      } else {
        return_activity( res, 400, '', profile_data.language, profile_data.date_format );
      }
    });
  }
};

/**
 * Activities - PUT
 */
exports.put = function( req, res ) {
  // Get the user id from the session
  var user_id = req.session.user_id;
  // Get the activity id from the url
  var activity_id = req.params.activity_id;

  var language = '';
  var date_format = '';

  // If there is no user id, redirect to login
  if( !user_id || !activity_id || ( user_id !== req.params.user_id ) ) {
    return_activity( res, 403, '', 'en' );
  } else {
    // Find the profile
    Profile.schema.findOne({ '_id': user_id }, 'language date_format')
    .then( function( profile_data ) {
      // If the profile doesn't exist, redirect
      if( typeof profile_data.language === 'undefined' ) return_activity( res, 404, '', 'en', 'd-m-y' );

      language = profile_data.language;
      date_format = profile_data.date_format;

      return Activity.schema.findOne( {'_id': activity_id}, '' );
    })
    .then( function( activity ) {

      if( typeof activity._id == 'undefined' ) return_activity( res, 404, '', language, date_format );

      var discipline = activity.discipline;
      var performance = {};
      
      switch ( discipline ) {
        case '100m':
        case '200m':
        case '400m':
        case '800m':
        case '1500m':
        case '3000m':
        case '60m_hurdles':
        case '100m_hurdles':
        case '110m_hurdles':
        case '400m_hurdles':
        case '3000m_steeple':
        case '4x100m_relay':
        case '4x400m_relay':
        case 'marathon':
          // Get the posted values. If a value was not posted, replace it with 00
          performance.hours = typeof req.body.hours !== 'undefined' && req.body.hours != '' ? req.body.hours : '00';
          performance.minutes = typeof req.body.minutes !== 'undefined' && req.body.minutes != '' ? req.body.minutes: '00';
          performance.seconds = typeof req.body.seconds !== 'undefined' && req.body.seconds != '' ? req.body.seconds: '00';
          performance.centiseconds = typeof req.body.centiseconds !== 'undefined' && req.body.centiseconds != '' ? req.body.centiseconds : '00';
          // Format the performance
          performance = Activity.schema.validateTime( performance );

          break;
        case 'high_jump':
        case 'long_jump':
        case 'triple_jump':
        case 'pole_vault':
        case 'shot_put':
        case 'discus':
        case 'hammer':
        case 'javelin':
          // Get the posted values. If a value was not posted, replace it with 0
          performance.distance_1 = typeof req.body.distance_1 !== 'undefined' && req.body.distance_1 != '' ? req.body.distance_1 : '0';
          performance.distance_2 = typeof req.body.distance_2 !== 'undefined' && req.body.distance_2 != '' ? req.body.distance_2: '0';

          // Format the performance
          performance = Activity.schema.validateDistance( performance );
          break;
        case 'pentathlon':
        case 'heptathlon':
        case 'decathlon':
          // Get the posted values. If a value was not posted, replace it with null
          performance.points = typeof req.body.points !== 'undefined' ? req.body.points : null;

          // Format the performance
          performance = Activity.schema.validatePoints( performance );
          break;
        default:
          performance = null;
          break;
      }

      // If there is a valid performance value
      if( performance !== null ) {
        // Create the record that will be inserted in the db
        var activity = {
          'performance': performance
        };

        Activity.findByIdAndUpdate( activity_id, activity, '', function ( err, activity ) {
          return_activity( res, 200, activity._id, language, date_format );
        });
      } else {
        return_activity( res, 400, '', language, date_format );
      }
    });
  }
};

/**
 * Activites - DELETE
 */
exports.delete = function( req, res ) {
  // Get the user id from the session
  var user_id = req.session.user_id;
  // Get the activity id from the url
  var activity_id = req.params.activity_id;

  // If there is no user id, return an empty json
  if( !user_id || !activity_id  || ( user_id !== req.params.user_id ) ) return_activity( res, 403, '', 'en' );

  Activity.schema.delete( { '_id': activity_id, 'user_id': user_id } ).then( function( deleted ) {
    if( deleted ) {
      res.statusCode = 200;
    } else {
      res.statusCode = 403;
    }
    res.json( null );
  });
};

function return_activity( res, status_code, activity_id, language, date_format ) {
  if( !activity_id) {
    res.statusCode = 400;
    res.json( null );
  }
  res.statusCode = status_code;

  Activity.schema.findOne( {'_id': activity_id}, '' ).then( function( activity ) {
    activity = {
      '_id'                   : activity._id,
      'discipline'            : activity.discipline,
      'performance'           : activity.performance,
      'date'                  : activity.date
    };

    activity = Activity.schema.formatActivity( activity, language, date_format );
    res.json( activity );
  });
}

function return_activities( res, status_code, where, language, date_format ) {
  Activity.schema.getActivitiesOfUser( where, '', -1 ).then( function( activities ) {
    for( var i in activities ) {
      activities[i] = {
        '_id'                   : activities[i]._id,
        'discipline'            : activities[i].discipline,
        'performance'           : activities[i].performance,
        'date'                  : activities[i].date
      };
    }
    activities = Activity.schema.formatActivities( activities, language, date_format );

    res.statusCode = status_code;
    res.json( activities );
  });
}