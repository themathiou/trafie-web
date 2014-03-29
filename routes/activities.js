var path = require('path'),
    root_dir = path.dirname( require.main.filename );

var Profile = require('../models/profile.js'),
    Activity = require('../models/activity.js');

// Initialize translations
var translations = require('../languages/translations.js');


/**
 * Activities - GET
 */
/*exports.get = function( req, res ){
  var user_id = req.session.user_id;

  if(!user_id) {
	  res.redirect('/register');
  } else {
    Profile.schema.findOne( { '_id': user_id }, 'first_name' )
    .then( function( profile_data ) {
      // If the user was found
      if( typeof profile_data.first_name !== 'undefined' ) {
        if( req.body.discipline )
        return user_id;
      // If the user wasn't found
      } else {
        res.json( null );
      }
    })
    .then( Activity.schema.findOne( { '_id': user_id }, 'first_name last_name discipline country male birthday picture' )

    })
    .then( function( profile_data ) {
    
    });
  }
};*/


/**
 * Activities - POST
 */
exports.post = function( req, res ) {
  // Get the user id from the session
  var user_id = req.session.user_id;
  // If there is no user id, redirect to login
  if(!user_id) {
    return_activity( res, '' );
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
        return_activity( res, '' );
      }
    });
  }
};

function return_activity( res, activity_id ) {
  if( !activity_id) {
    res.statusCode = 400;
    res.json( null );
  }

  Activity.schema.findOne( {'_id': activity_id}, '' )
  .then( function( activity ) {
    var activity = Activity.schema.formatActivity( activity );

    var tr = translations['en'].getProfileTranslations();
    activity.discipline = tr[activity.discipline];

    res.statusCode = 201;
    res.json( activity );
  });
}