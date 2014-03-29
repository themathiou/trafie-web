var path = require('path'),
    root_dir = path.dirname( require.main.filename );

var Profile = require('../models/profile.js'),
    Activity = require('../models/activity.js');


// Initialize translations
var translations = [];
translations['en'] = require('../languages/en.js');
translations['gr'] = require('../languages/gr.js');


/**
 * Profile - GET
 */
exports.get = function( req, res ){
  var user_id = req.session.user_id;

  if(!user_id) {
	  res.redirect('/register');
  } else {
    Profile.schema.findOne( { '_id': user_id }, 'first_name last_name discipline country male birthday picture' ).then( function( profile_data ) {
      // If the user was found
      if( typeof profile_data.first_name !== 'undefined' ) {
        render( res, user_id, profile_data );
      // If the user wasn't found
      } else {
        res.redirect('/login');
      }
    });
  }
};


/**
 * Profile - POST
 */
exports.post = function( req, res ){
  // Get the user id from the session
  var user_id = req.session.user_id;
  // If there is no user id, redirect to login
  if(!user_id) {
    res.json( null );
  } else {
    // Find the profile
    Profile.schema.findOne({ '_id': user_id }, 'first_name last_name discipline country male birthday picture')
    .then( function( profile_data ) {
      // If the profile doesn't exist, redirect
      if( typeof profile_data.first_name === 'undefined' ) redirect('/register');
      var discipline = typeof req.body.discipline !== 'undefined' ? req.body.discipline : '';
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
          'user_id': user_id,
          'discipline': discipline,
          'performance': performance
        };

        var activity = new Activity( new_activity );
        // Save the activity
        activity.save(function ( err, activity ) {
          return_activity( res, activity._id );
        });
      } else {
        return_activity( res, activity._id );
      }
    });
  }
};


/**
 * Profile - POST
 */
exports.delete = function( req, res ){
  // Get the user id from the session
  var user_id = req.session.user_id;
  // If there is no user id, redirect to login
  if(!user_id) {
    res.redirect('/register');
  } else {
    // Find the profile
    Profile.schema.findOne({ '_id': user_id }, 'first_name last_name discipline country male birthday picture')
    .then( function( profile_data ) {
      // If the profile was found
      
      // If the profile doesn't exist, redirect
      if( typeof response.first_name === 'undefined' ) redirect('/register');
      
      var discipline = typeof req.body.discipline !== 'undefined' ? req.body.discipline : '';
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
          'user_id': user_id,
          'discipline': discipline,
          'performance': performance
        };

        var activity = new Activity( new_activity );
        // Save the activity
        activity.save(function ( err, activity ) {
          render( res, user_id, profile_data );
        });
      } else {
        render( res, user_id, profile_data );
      }
    });
  }
};

function return_activity( res, activity_id ) {
  Activity.schema.findOne( {'id': activity_id}, '' )
  .then( function( activity ){
    var activity = Activity.schema.formatActivity( activity );
    res.json( activity );
  });
}

function render( res, user_id, profile_data ) {
  Activity.schema.getActivitiesOfUser( { 'user_id': user_id }, null, -1 )
  .then( function( activities ) {
    // Format the activity data
    var activities = Activity.schema.formatActivities( activities );
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
        'first_name'  : profile_data.first_name,
        'last_name'   : profile_data.last_name,
        'discipline'  : profile_data.discipline,
        'country'     : profile_data.country,
        'picture'     : picture
      },
      'disciplines' : disciplines,
      'activities'  : activities,
      'tr'          : translations['en'].getProfileTranslations()
    };

    res.render( 'profile', view_data );
  });
}