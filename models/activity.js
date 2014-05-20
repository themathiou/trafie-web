var mongoose = require('mongoose');
var db = mongoose.connection;
var q = require('q');

// Initialize translations
var translations = require('../languages/translations.js');

//Define User SCHEMA
var activitySchema = mongoose.Schema({
  user_id		: { type: String, required: true, index: true },
  discipline	: { type: String, required: true },
  performance	: { type: String },
  date 			: { type: Date, default: Date.now }
});


/**
 * Find activity by element
 * @param json where( { _id: id } )
 * @param String select
 */
activitySchema.findOne = function( where, select ) {
	var d = q.defer();
	Activity.findOne(where, select, function ( err, activity ) {
		d.resolve( activity );
	});
	return d.promise;
};


/**
 * Find user by element
 * @param json where( { email: someone@trafie.com } )
 * @param String select
 * @param number sort (-1 == descending)
 */
activitySchema.getActivitiesOfUser = function( where, select, sort ) {
	var d = q.defer();
	Activity.find(
		// Where
	    where,
	    // Select
	    select,
	    // Other parameters
	    {
	      //skip:0,
	      //limit:10,
	      sort:{
	        // -1 = descending
	        date: sort
	      }
	    },
		function ( err, activity ) {
			if (err) handleError(err);
			d.resolve(activity);
		}
	);

	return d.promise;
};


/**
 * Returns all the names of the disciplines, that are included
 * in the user's activities
 * @param json where( { user_id: hash } )
 */
activitySchema.getDisciplinesPerformedByUser = function( where ) {
	var d = q.defer();
	Activity.distinct( 'discipline', where, function ( err, activity ) {
			if (err) handleError(err);
			d.resolve(activity);
		}
	);

	return d.promise;
};


/**
 * Delete an activity
 * @param json where
 */
activitySchema.delete = function( where ) {
	var d = q.defer();

	Activity.remove( where, function( err, deleted ){
		if (err) handleError(err);
		d.resolve( deleted );
	});

	return d.promise;
};


/**
 * Converts the activity data to a more readable format
 * @param array activities
 * @param string language
 * @param string date_format
 */
activitySchema.formatActivities = function( activities, language, date_format ) {
	var activities_count = activities.length;
	for( var i=0 ; i<activities_count ; i++ ) {
		activities[i] = activitySchema.formatActivity( activities[i], language, date_format );
	}
	return activities;
};


/**
 * Converts the activity data to a more readable format
 * @param object activity
 * @param string language
 * @param string date_format
 */
activitySchema.formatActivity = function( activity, language, date_format ) {
	switch ( activity.discipline ) {
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
      	// Getting the centiseconds
		var centiseconds = activity.performance.split('.')[1];
		// Getting the rest of the performance parts
		var performance_parts = activity.performance.split('.')[0].split(':');
		// If the first part of the time is 0, remove it (affects hours and minutes)
		for( var j=0 ; j<2 ; j++ ) {
			if( performance_parts[0] == 0 ) {
				performance_parts.splice( 0, 1 );
			} else {
				break;
			}
		}

		// Joining the parts with :
		var performance = performance_parts.join(':');
		// Joining with the centiseconds
		activity.formatted_performance = performance + '.' + centiseconds;
        break;
      case 'high_jump':
      case 'long_jump':
      case 'triple_jump':
      case 'pole_vault':
      case 'shot_put':
      case 'discus':
      case 'hammer':
      case 'javelin':
      	// Converting the distance back to meters
        activity.formatted_performance = (activity.performance / 10000).toFixed(2) + translations[language]['meters_short'];
        break;
      case 'pentathlon':
      case 'heptathlon':
      case 'decathlon':
       	activity.formatted_performance = activity.performance + ' ' + translations[language]['points'];
        break;
	}

	activity.formatted_discipline = translations[language][activity.discipline];

	// Adjusting the time to the user's timezone
	activity.date.setHours( activity.date.getHours() + 3 );
	switch( date_format ) {
		case 'd-m-y':
			activity.formatted_date = activity.date.getDate() + '-' + ( activity.date.getMonth() + 1 ) + '-' + activity.date.getFullYear();
			break;
		case 'm-d-y':
			activity.formatted_date = ( activity.date.getMonth() + 1 ) + '-' + activity.date.getDate() + '-' + activity.date.getFullYear();
			break;
	}

	return activity;
};


/**
 * Checks time inputs for validity, if they are valid, it adds leading zeros to
 * single digit values and it creates the performance string, ready to be stored
 * If the values are invalid, it returns an empty string
 * @param object performance
 * @return string
 */
activitySchema.validateTime = function( performance ) {
	var valid = true;
	var time = '';

	// Validating hours
	if( typeof performance.hours !== 'string' || parseInt( performance.hours ) != performance.hours || performance.hours.length > 2 || performance.hours < 0 ) {
		valid = false;
	}
	// Validating minutes
	else if( typeof performance.minutes !== 'string' || parseInt( performance.minutes ) != performance.minutes || performance.minutes.length > 2 || performance.minutes > 59 || performance.minutes < 0 ) {
		valid = false;
	}
	// Validating seconds
	else if( typeof performance.seconds !== 'string' || parseInt( performance.seconds ) != performance.seconds || performance.seconds.length > 2 || performance.seconds > 59 || performance.seconds < 0 ) {
		valid = false;
	}
	// Validating centiseconds
	else if( typeof performance.centiseconds !== 'string' || parseInt( performance.centiseconds ) != performance.centiseconds || performance.centiseconds.length > 2 || performance.centiseconds < 0 ) {
		valid = false;
	}

	// If the time is zero in total, it's invalid
	if( performance.hours == 0 && performance.minutes == 0 && performance.seconds == 0 && performance.centiseconds == 0 ) {
		valid = false;
	}

	// Sanitizing the data if it's valid
	if( valid ) {
		if( performance.hours.length == 1 ) {
			performance.hours = '0' + performance.hours;
		}
		else if( performance.hours.length == 0 ) {
			performance.hours = '00';
		}
		if( performance.minutes.length == 1 ) {
			performance.minutes = '0' + performance.minutes;
		}
		else if( performance.minutes.length == 0 ) {
			performance.minutes = '00';
		}
		if( performance.seconds.length == 1 ) {
			performance.seconds = '0' + performance.seconds;
		}
		else if( performance.seconds.length == 0 ) {
			performance.seconds = '00';
		}
		if( performance.centiseconds.length == 1 ) {
			performance.centiseconds = '0' + performance.centiseconds;
		}
		else if( performance.centiseconds.length == 0 ) {
			performance.centiseconds = '00';
		}

		var time = performance.hours + ':' + performance.minutes + ':' + performance.seconds + '.' + performance.centiseconds;
	}

	return time;
};


/**
 * Checks distance inputs for validity
 * If the values are invalid, it returns zero
 * @param object performance
 * @return number
 */
activitySchema.validateDistance = function( performance ) {
	var valid = true;
	var distance = 0;

	// Validating the first part of the measurement
	if( typeof performance.distance_1 !== 'string' || parseInt( performance.distance_1 ) != performance.distance_1 || performance.distance_1.length > 2 || performance.distance_1 < 0 ) {
		valid = false;
	}
	// Validating the second part of the measurement
	else if( typeof performance.distance_2 !== 'string' || parseInt( performance.distance_2 ) != performance.distance_2 || performance.distance_2.length > 2 || performance.distance_2 < 0 ) {
		valid = false;
	}

	// If the total distance was 0, it's invalid
	if( performance.distance_1 == 0 && performance.distance_2 == 0 ) {
		valid = false;
	}

	// Convertin the distance to a value that can be easily changed between meters and feet
	if( valid ) {
		distance = performance.distance_1 * 10000 + performance.distance_2 * 100;
	}

	return distance;
};


/**
 * Checks points inputs for validity
 * If the values are invalid, it returns an empty string
 * @param object performance
 * @return string
 */
activitySchema.validatePoints = function( performance ) {
	var points = '';

	if( typeof performance.points === 'string' && parseInt( performance.points ) == performance.points && performance.points.length <= 5 && performance.points > 0 ) {
		points = performance.points;
	}

	return points;
};


/**
 * Parses the given date, from format "Thu Apr 11 2014" to
 * to a JavaScript date object
 * @param string date
 */
activitySchema.parseDate = function( date ) {
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

	date = date.split(' ');
	var current_date = new Date();

	// If the date is invalid, return an empty string
	if( date.length != 4 || months.indexOf( date[1] ) < 0 || !parseInt(date[2]) || date[2] < 1 || date[2] > 31 || !parseInt(date[3]) || date[3] < 1900 || date[3] > current_date.getFullYear() ) {
		return '';
	} else {
		// Create the date object
		var parsed_date = new Date( date[3], months.indexOf( date[1] ), date[2] );
		return parsed_date < current_date ? parsed_date : current_date;
	}
};

activitySchema.parseDbDate = function( date ) {
	date = date.split('T')[0];
	var date_parts = date.split('-');

	return new Date( date_parts[0], date_parts[1]-1, date_parts[2] );
}

var Activity = mongoose.model( 'Activity', activitySchema );

module.exports = Activity;