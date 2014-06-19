// Loading modules
var path = require('path'),
	root_dir = path.dirname( require.main.filename );

// Loading models
var Profile = require('../models/profile.js'),
	Activity = require('../models/activity.js');

// Loading helpers
var activityHelper = require('../helpers/activities.js');

// Initialize translations
var translations = require('../languages/translations.js');


/**
 * Activities - GET
 */
exports.get = function( req, res ){
	var user_id = req.session.user_id;

	if( !user_id || ( user_id !== req.params.user_id ) ) {
		return_activity( res, 403, {}, 'en', 'd-m-y' );
	} else {
		// Find the profile
		Profile.schema.findOne({ '_id': user_id }, 'language date_format')
		.then( function( profile_data ) {
			// If the profile doesn't exist, return an empty json
			if( typeof profile_data.language === 'undefined' ) return_activity( res, 404, {}, 'en', 'd-m-y' );

			// If the activity id was specified, try to find the activity
			if( typeof req.params.activity_id !== 'undefined' ) {
				return_activity( res, 200, { '_id': req.params.activity_id, 'user_id': user_id }, profile_data.language, profile_data.date_format );
			} else {
				// If the activity id wasn't specified, try to fetch all the activities of the user
				var where = {};
				// If there was a discipline in the parameters of the GET request,
				// fetch the activities only of this discipline
				if( typeof req.query.discipline !== 'undefined' ) {
					where.discipline = req.query.discipline;
				}
				if( typeof req.query.from !== 'undefined' && typeof req.query.to !== 'undefined' ) {
					where.date = { "$gte": activityHelper.parseDbDate( req.query.from ), "$lte": activityHelper.parseDbDate( req.query.to ) };
				}
				else if( typeof req.query.from !== 'undefined' ) {
					where.date = { "$gte": activityHelper.parseDbDate( req.query.from ) };
				}
				else if( typeof req.query.to !== 'undefined' ) {
					where.date = { "$lte": activityHelper.parseDbDate( req.query.to ) };
				}
				where.user_id = user_id;

				return_activities( res, 200, where, profile_data.language, profile_data.date_format );
			}
		})
		.fail( function( error ) {
			send_error_page( error, res );
		});
	}
};


/**
 * Activities - POST
 */
exports.post = function( req, res ) {
	// Get the user id from the session
	var user_id = req.session.user_id;
	// If there is no user id, or the user id is different than the one in the session
	if( !user_id || ( user_id !== req.params.user_id ) ) {
		return_activity( res, 403, {}, 'en', 'd-m-y' );
	} else {
		// Find the profile
		Profile.schema.findOne({ '_id': user_id }, 'language date_format')
		.then( function( profile_data ) {
			// If the profile doesn't exist, send an empty json
			if( typeof profile_data.language === 'undefined' ) return_activity( res, 404, {}, 'en', 'd-m-y' );

			var errors = false;
			var error_messages = {};
			var discipline = typeof req.body.discipline !== 'undefined' ? req.body.discipline : '';

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

			var performance = {};
			
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
				error_messages.performance = 'invalid_performance';
			}

			// If there are no errors
			if( !errors ) {
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
					return_activity( res, 201, { '_id': activity._id, 'user_id': user_id }, profile_data.language, profile_data.date_format );
				})
				.fail( function( error ) {
					send_error_page( error, res );
				});
			} else {
				// If there are errors, send the error messages to the client
				return_activity( res, 400, {}, profile_data.language, profile_data.date_format, error_messages );
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
		return_activity( res, 403, {}, 'en', 'd-m-y' );
	} else {
		// Find the profile
		Profile.schema.findOne({ '_id': user_id }, 'language date_format')
		.then( function( profile_data ) {
			// If the profile doesn't exist, redirect
			if( typeof profile_data.language === 'undefined' ) return_activity( res, 404, {}, 'en', 'd-m-y' );

			language = profile_data.language;
			date_format = profile_data.date_format;

			return Activity.schema.findOne( {'_id': activity_id}, '' );
		})
		.then( function( activity ) {
			if( typeof activity._id == 'undefined' ) return_activity( res, 404, {}, language, date_format );

			var errors = false;
			var error_messages = {};

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
				error_messages.performance = 'invalid_performance';
			}

			// If there are no errors
			if( !errors ) {
				// Create the record that will be inserted in the db
				var activity = {
					'performance' : performance,
					'date'        : date
				};

				Activity.findByIdAndUpdate( activity_id, activity, '', function ( err, activity ) {
					return_activity( res, 200, { '_id': activity._id, 'user_id': user_id }, language, date_format );
				});
			} else {
				// If there are errors, send the error messages to the client
				return_activity( res, 400, {}, language, date_format, error_messages );
			}
		})
		.fail( function( error ) {
			send_error_page( error, res );
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
		send_error_page( error, res );
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
function return_activity( res, status_code, where, language, date_format, error_messages ) {
	// If an activity id wasn't supplied
	if( typeof where._id == 'undefined' ) {
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
	Activity.schema.findOne( where, '' ).then( function( activity ) {
		activity = {
			'_id'                   : activity._id,
			'discipline'            : activity.discipline,
			'performance'           : activity.performance,
			'date'                  : activity.date
		};

		// Format the date of the activity
		activity = activityHelper.formatActivity( activity, language, date_format );
		
		res.json( activity );
	})
	.fail( function( error ) {
		send_error_page( error, res );
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
		for( var i in activities ) {
			activities[i] = {
				'_id'                   : activities[i]._id,
				'discipline'            : activities[i].discipline,
				'performance'           : activities[i].performance,
				'date'                  : activities[i].date
			};
		}

		// Format the date of the activities
		activities = activityHelper.formatActivities( activities, language, date_format );

		res.statusCode = status_code;
		res.json( activities );
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
	res.json( null );
}