'use strict';

// Loading models
const Profile = require('../models/profile.js'),
			Activity = require('../models/activity.js');

// Loading helpers
const mainHelper = require('../helpers/main_helper.js'),
			activityHelper = require('../helpers/activity.js');

// Initialize translations
const translations = require('../languages/translations.js');


/**
 * Activities - GET
 */
exports.get = function( req, res ) {
	var profile_id = false,
    	user_id = typeof req.session.user_id === 'undefined' ? null : req.session.user_id;

  if( typeof req.params.user_id !== 'undefined' ) {
    profile_id = req.params.user_id;
  } else {
    send_status( res, 404 );
    return;
  }

	mainHelper.validateAccess( user_id, profile_id, function( response ) {
		// If the user has a valid session and they are not visiting a private profile
    if( response.success ) {
			// If the activity id was specified, try to find the activity
			if( typeof req.params.activity_id !== 'undefined' ) {
				return_activity( res, 200, req.params.activity_id, response.profile.language, response.profile.date_format );
			} else {
				// If the activity id wasn't specified, try to fetch all the activities of the user
				let where = {};
				// If there was a discipline in the parameters of the GET request,
				// fetch the activities only of this discipline
				if( typeof req.query.discipline !== 'undefined' && req.query.discipline ) {
					where.discipline = req.query.discipline;
				}
				if( typeof req.query.from !== 'undefined' && req.query.from && typeof req.query.to !== 'undefined' && req.query.to ) {
					where.date = { "$gte": activityHelper.parseDbDate( req.query.from ), "$lte": activityHelper.parseDbDate( req.query.to ) };
				}
				else if( typeof req.query.from !== 'undefined' ) {
					where.date = { "$gte": activityHelper.parseDbDate( req.query.from ) };
				}
				else if( typeof req.query.to !== 'undefined' ) {
					where.date = { "$lte": activityHelper.parseDbDate( req.query.to ) };
				}
				where.user_id = response.profile._id;

				return_activities( res, 200, where, response.user.language, response.user.date_format );
			}
		} else {
      // Otherwise, if it's a server error, send the error
      if( response.error === 'query_error' ) {
        send_status( res, 500 );
      } else {
        // If the user doesn't have access to the data, or the data don't exist, do not send anything
        send_status( res, 404 );
      }
    }
	});
};


/**
 * Activities - POST
 */
exports.post = function( req, res ) {
	// Get the user id from the session
	var user_id = req.session.user_id;
	// If there is no user id, or the user id is different than the one in the session
	if( !user_id || ( user_id !== req.params.user_id ) ) {
		return_activity( res, 403, '', 'en', 'd-m-y' );
	} else {
		// Find the profile
		Profile.schema.findOne({ '_id': user_id }, 'language date_format')
		.then( function( profile_data ) {
			// If the profile doesn't exist, send an empty json
			if( typeof profile_data.language === 'undefined' ) return_activity( res, 404, '', 'en', 'd-m-y' );

			var errors = false,
				error_messages = {},
				discipline = typeof req.body.discipline !== 'undefined' ? req.body.discipline : '',
				performance = {},
				location = '',
				place = 0,
				competition = '',
				notes = '',
				isPrivate = false,
				tr = translations[profile_data.language];

			// Validating date
			if( typeof req.body.date !== 'undefined' && req.body.date ) {
				var date = activityHelper.parseDate( req.body.date );
				if( !date ) {
					errors = true;
					error_messages.date = 'wrong_date_format';
				}
			} else {
				errors = true;
				error_messages.date = 'date_is_required';
			}

			// Validating discipline and performance
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
					performance = activityHelper.validateTime( performance );

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
					performance = activityHelper.validateDistance( performance );
					break;
				case 'pentathlon':
				case 'heptathlon':
				case 'decathlon':
					// Get the posted values. If a value was not posted, replace it with null
					performance.points = typeof req.body.points !== 'undefined' ? req.body.points : null;

					// Format the performance
					performance = activityHelper.validatePoints( performance );
					break;
				default:
					performance = null;
					break;
			}

			if( performance === null ) {
				errors = true;
				error_messages.performance = tr['invalid_performance'];
			}

			if( typeof req.body.location !== 'undefined' ) {
				if( activityHelper.locationIsValid( req.body.location ) ) {
					location = req.body.location;
				} else {
					errors = true;
					error_messages.location = tr['too_long_text'];
				}
			}

			if( typeof req.body.place !== 'undefined' ) {
				if( activityHelper.placeIsValid( req.body.place ) ) {
					place = req.body.place;
				} else {
					errors = true;
					error_messages.place = tr['invalid_place'];
				}
			}

			if( typeof req.body.competition !== 'undefined' ) {
				if( activityHelper.competitionIsValid( req.body.competition ) ) {
					competition = req.body.competition;
				} else {
					errors = true;
					error_messages.competition = tr['too_long_text'];
				}
			}

			if( typeof req.body.notes !== 'undefined' ) {
				if( activityHelper.notesAreValid( req.body.notes ) ) {
					notes = req.body.notes;
				} else {
					errors = true;
					error_messages.notes = tr['too_long_text'];
				}
			}

			if( typeof req.body.private !== 'undefined' ) {
				if( activityHelper.privacyIsValid( req.body.private ) ) {
					isPrivate = req.body.private;
				} else {
					errors = true;
					error_messages.private = tr['privacy error'];
				}
			}

			// If there are no errors
			if( !errors ) {
				// Create the record that will be inserted in the db
				var new_activity = {
					'user_id'     	: user_id,
					'discipline'  	: discipline,
					'performance' 	: performance,
					'date'        	: date,
					'place'			: place,
					'location'		: location,
					'competition'	: competition,
					'notes'			: notes,
					'private'		: isPrivate
				};

				var activity = new Activity( new_activity );
				// Save the activity
				activity.save(function ( err, activity ) {
					return_activity( res, 201, activity._id, profile_data.language, profile_data.date_format );
				})
				.fail( function( error ) {
					send_status( res, 500 );
				});
			} else {
				// If there are errors, send the error messages to the client
				return_activity( res, 400, '', profile_data.language, profile_data.date_format, error_messages );
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

	var language = '',
		date_format = '';

	// If there is no user id, redirect to login
	if( !user_id || !activity_id || ( user_id !== req.params.user_id ) ) {
		return_activity( res, 403, '', 'en', 'd-m-y' );
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

			var errors = false,
				error_messages = {},
				location = '',
				place = 0,
				competition = '',
				notes = '',
				isPrivate = false,
				tr = translations[language];

			// Checking if the date value is valid
			if( typeof req.body.date !== 'undefined' && req.body.date ) {
				var date = activityHelper.parseDate( req.body.date );
				if( !date ) {
					errors = true;
					error_messages.date = 'wrong_date_format';
				}
			} else {
				errors = true;
				error_messages.date = 'date_is_required';
			}

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
					performance = activityHelper.validateTime( performance );

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
					performance = activityHelper.validateDistance( performance );
					break;
				case 'pentathlon':
				case 'heptathlon':
				case 'decathlon':
					// Get the posted values. If a value was not posted, replace it with null
					performance.points = typeof req.body.points !== 'undefined' ? req.body.points : null;

					// Format the performance
					performance = activityHelper.validatePoints( performance );
					break;
				default:
					performance = null;
					break;
			}

			if( performance === null ) {
				errors = true;
				error_messages.performance = tr['invalid_performance'];
			}

			if( typeof req.body.location !== 'undefined' ) {
				if( activityHelper.locationIsValid( req.body.location ) ) {
					location = req.body.location;
				} else {
					errors = true;
					error_messages.location = tr['too_long_text'];
				}
			}

			if( typeof req.body.place !== 'undefined' ) {
				if( activityHelper.placeIsValid( req.body.place ) ) {
					place = req.body.place;
				} else {
					errors = true;
					error_messages.place = tr['invalid_place'];
				}
			}

			if( typeof req.body.competition !== 'undefined' ) {
				if( activityHelper.competitionIsValid( req.body.competition ) ) {
					competition = req.body.competition;
				} else {
					errors = true;
					error_messages.competition = tr['too_long_text'];
				}
			}

			if( typeof req.body.notes !== 'undefined' ) {
				if( activityHelper.notesAreValid( req.body.notes ) ) {
					notes = req.body.notes;
				} else {
					errors = true;
					error_messages.notes = tr['too_long_text'];
				}
			}

			if( typeof req.body.private !== 'undefined' ) {
				if( activityHelper.privacyIsValid( req.body.private ) ) {
					isPrivate = req.body.private;
				} else {
					errors = true;
					error_messages.private = tr['privacy error'];
				}
			}

			// If there are no errors
			if( !errors ) {
				// Create the record that will be inserted in the db
				var activity = {
					'performance' 	: performance,
					'date'        	: date,
					'place'			: place,
					'location'		: location,
					'competition'	: competition,
					'notes'			: notes,
					'private'		: isPrivate
				};

				Activity.findByIdAndUpdate( activity_id, activity, '', function ( err, activity ) {
					return_activity( res, 200, activity._id, language, date_format );
				});
			} else {
				// If there are errors, send the error messages to the client
				return_activity( res, 400, '', language, date_format, error_messages );
			}
		})
		.fail( function( error ) {
			send_status( res, 500 );
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
	})
	.fail( function( error ) {
		send_status( res, 500 );
	});
};


/**
 * Returns the activity as a json object
 * @param object res            (response object of express)
 * @param number status_code    (status code that will be send with the response)
 * @param string activity_id    (activity id of the activity that will be returned)
 * @param string language       (language code of the translations)
 * @param string date_format    (date format that will be used for the dates of the activity)
 * @param json   error_messages (error messages that will be mapped to the input fields in the ui)
 */
function return_activity( res, status_code, _id, language, date_format, error_messages ) {
	// If an activity id wasn't supplied
	if( ! _id ) {
		res.statusCode = 400;
		// If there are error messages, send them
		if( typeof error_messages !== 'undefined' ) {
			res.json( { 'errors': error_messages } );
		} else {
			res.json( null );
		}
	}

	res.statusCode = status_code;

	// Find the activity and return it
	Activity.schema.findOne( {'_id': _id}, '' ).then( function( activity ) {
		activity = {
			'_id'                   : activity._id,
			'discipline'            : activity.discipline,
			'performance'           : activity.performance,
			'date'                  : activity.date,
			'place' 				: activity.place,
			'location'				: activity.location,
			'competition'			: activity.competition,
			'notes'					: activity.notes
		};

		// Format the date of the activity
		activity = activityHelper.formatActivity( activity, language, date_format );

		res.json( activity );
	})
	.fail( function( error ) {
		send_status( res, 500 );
	});
}

/**
 * Returns the activities as an array of json objects
 * @param object res            (response object of express)
 * @param number status_code    (status code that will be send with the response)
 * @param json   where          (the where conditions of the query (usually provides the user id))
 * @param string language       (language code of the translations)
 * @param string date_format    (date format that will be used for the dates of the activity)
 * @param json   error_messages (error messages that will be mapped to the input fields in the ui)
 */
function return_activities( res, status_code, where, language, date_format ) {
	Activity.schema.getActivitiesOfUser( where, '', -1 ).then( function( activities ) {
		for( let i in activities ) {
			activities[i] = {
				'_id'                   : activities[i]._id,
				'discipline'            : activities[i].discipline,
				'performance'           : activities[i].performance,
				'date'                  : activities[i].date,
				'place' 								: activities[i].place,
				'location'							: activities[i].location,
				'competition'						: activities[i].competition,
				'private'								: activities[i].private,
				'notes'									: activities[i].notes
			};
		}

		// Format the date of the activities
		activities = activityHelper.formatActivities( activities, language, date_format );

		res.statusCode = status_code;
		res.json( activities );
	})
	.fail( function( error ) {
		send_status( res, 500 );
	});
}

/**
 * Sends an error in case a query fails
 * @param string error
 * @param object res
 */
function send_status( res, status ) {
  res.statusCode = status;
  res.json( null );
}