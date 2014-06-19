var activityHelper = {};

/**
 * Converts the activity data to a more readable format
 * @param array activities
 * @param string language
 * @param string date_format
 */
activityHelper.formatActivities = function( activities, language, dateFormat ) {
	var activities_count = activities.length;
	for( var i=0 ; i<activities_count ; i++ ) {
		activities[i] = activityHelper.formatActivity( activities[i], language, dateFormat );
	}
	return activities;
};


/**
 * Converts the activity data to a more readable format
 * @param object activity
 * @param string language
 * @param string date_format
 */
activityHelper.formatActivity = function( activity, language, dateFormat ) {
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
		var performanceParts = activity.performance.split('.')[0].split(':');
		// If the first part of the time is 0, remove it (affects hours and minutes)
		for( var j=0 ; j<2 ; j++ ) {
			if( performanceParts[0] == 0 ) {
				performanceParts.splice( 0, 1 );
			} else {
				break;
			}
		}

		// Joining the parts with :
		var performance = performanceParts.join(':');
		// Joining with the centiseconds
		activity.formattedPerformance = performance + '.' + centiseconds;
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
        activity.formattedPerformance = (activity.performance / 10000).toFixed(2) + translations[language]['meters_short'];
        break;
      case 'pentathlon':
      case 'heptathlon':
      case 'decathlon':
       	activity.formattedPerformance = activity.performance + ' ' + translations[language]['points'];
        break;
	}

	activity.formattedDiscipline = translations[language][activity.discipline];

	// Adjusting the time to the user's timezone
	activity.date.setHours( activity.date.getHours() + 3 );
	switch( dateFormat ) {
		case 'd-m-y':
			activity.formattedDate = activity.date.getDate() + '-' + ( activity.date.getMonth() + 1 ) + '-' + activity.date.getFullYear();
			break;
		case 'm-d-y':
			activity.formattedDate = ( activity.date.getMonth() + 1 ) + '-' + activity.date.getDate() + '-' + activity.date.getFullYear();
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
activityHelper.validateTime = function( performance ) {
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
activityHelper.validateDistance = function( performance ) {
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
activityHelper.validatePoints = function( performance ) {
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
activityHelper.parseDate = function( date ) {
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

	date = date.split(' ');
	var currentDate = new Date();

	// If the date is invalid, return an empty string
	if( date.length != 4 || months.indexOf( date[1] ) < 0 || !parseInt(date[2]) || date[2] < 1 || date[2] > 31 || !parseInt(date[3]) || date[3] < 1900 || date[3] > currentDate.getFullYear() ) {
		return '';
	} else {
		// Create the date object
		var parsedDate = new Date( date[3], months.indexOf( date[1] ), date[2] );
		return parsedDate < currentDate ? parsedDate : currentDate;
	}
};

/**
 * Parses the dates as they are stored in the db
 * @param  string 		date
 * @return date object
 */
activityHelper.parseDbDate = function( date ) {
	date = date.split('T')[0];
	var dateParts = date.split('-');

	return new Date( dateParts[0], dateParts[1]-1, dateParts[2] );
}

module.exports = activityHelper;