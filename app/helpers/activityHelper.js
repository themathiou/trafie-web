'use strict';

// Initialize translations
let translations = require('../languages/translations.js');

let activityHelper = {};

/**
 * Converts the activity data to a more readable format
 * @param array activities
 * @param string language
 * @param string date_format
 */
activityHelper.formatActivities = function(activities, language, dateFormat) {
	activities.map(function(activity) {
		return activityHelper.formatActivity(activity, language, dateFormat);
	});
	return activities;
};


/**
 * Converts the activity data to a more readable format
 * @param object activity
 * @param string language
 * @param string date_format
 */
activityHelper.formatActivity = function(activity, language, date_format) {
	if (!activity.discipline || !activity.performance) return null;

	switch (activity.discipline) {
		case '60m':
		case '100m':
		case '200m':
		case '400m':
		case '800m':
		case '1500m':
		case '3000m':
		case '5000m':
		case '10000m':
		case '60m_hurdles':
		case '100m_hurdles':
		case '110m_hurdles':
		case '400m_hurdles':
		case '3000m_steeplechase':
		case '4x100m_relay':
		case '4x400m_relay':
		case 'half_marathon':
		case 'marathon':
    	case '20km_race_walk':
    	case '50km_race_walk':
    	case 'cross_country_running':
			// Getting the centiseconds
			var centiseconds = activity.performance.split('.')[1];
			// Getting the rest of the performance parts
			var performance_parts = activity.performance.split('.')[0].split(':');
			// If the first part of the time is 0, remove it (affects hours and minutes)
			for (let j = 0; j < 2; j++) {
				if (performance_parts[0] == 0) {
					performance_parts.splice(0, 1);
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
	activity.date.setHours(activity.date.getHours() + 3);
	switch (date_format) {
		case 'd-m-y':
			activity.formatted_date = activity.date.getDate() + '-' + (activity.date.getMonth() + 1) + '-' + activity.date.getFullYear();
			break;
		case 'm-d-y':
			activity.formatted_date = (activity.date.getMonth() + 1) + '-' + activity.date.getDate() + '-' + activity.date.getFullYear();
			break;
	}

	return activity;
};

/**
 * Checks if the discipline is valid
 * @param  string discipline
 * @return string
 */
activityHelper.disciplineIsValid = function(discipline) {
	// Validating discipline and performance
	switch (discipline) {
		case '60m':
		case '100m':
		case '200m':
		case '400m':
		case '800m':
		case '1500m':
		case '3000m':
		case '5000m':
		case '10000m':
		case '60m_hurdles':
		case '100m_hurdles':
		case '110m_hurdles':
		case '400m_hurdles':
		case '3000m_steeplechase':
		case '4x100m_relay':
		case '4x400m_relay':
		case 'half_marathon':
		case 'marathon':
    	case '20km_race_walk':
    	case '50km_race_walk':
    	case 'cross_country_running':
			return 'time';
			break;
		case 'high_jump':
		case 'long_jump':
		case 'triple_jump':
		case 'pole_vault':
		case 'shot_put':
		case 'discus':
		case 'hammer':
		case 'javelin':
			return 'distance';
			break;
		case 'pentathlon':
		case 'heptathlon':
		case 'decathlon':
			return 'points'
			break;
		default:
			return '';
			break;
	}
};

/**
 * Checks time inputs for validity, if they are valid, it adds leading zeros to
 * single digit values and it creates the performance string, ready to be stored
 * If the values are invalid, it returns an empty string
 * @param object performance
 * @return string
 */
activityHelper.validateTime = function(performance) {
	let valid = true;
	let time = '';

	// If a value was not posted, replace it with 00
	performance.hours = typeof performance.hours !== 'undefined' && performance.hours != '' ? performance.hours : '00';
	performance.minutes = typeof performance.minutes !== 'undefined' && performance.minutes != '' ? performance.minutes : '00';
	performance.seconds = typeof performance.seconds !== 'undefined' && performance.seconds != '' ? performance.seconds : '00';
	performance.centiseconds = typeof performance.centiseconds !== 'undefined' && performance.centiseconds != '' ? performance.centiseconds : '00';

	// Validating hours
	if (typeof performance.hours !== 'string' || parseInt(performance.hours) != performance.hours || performance.hours.length > 2 || performance.hours < 0) {
		valid = false;
	}
	// Validating minutes
	else if (typeof performance.minutes !== 'string' || parseInt(performance.minutes) != performance.minutes || performance.minutes.length > 2 || performance.minutes > 59 || performance.minutes < 0) {
		valid = false;
	}
	// Validating seconds
	else if (typeof performance.seconds !== 'string' || parseInt(performance.seconds) != performance.seconds || performance.seconds.length > 2 || performance.seconds > 59 || performance.seconds < 0) {
		valid = false;
	}
	// Validating centiseconds
	else if (typeof performance.centiseconds !== 'string' || parseInt(performance.centiseconds) != performance.centiseconds || performance.centiseconds.length > 2 || performance.centiseconds < 0) {
		valid = false;
	}

	// If the time is zero in total, it's invalid
	if (performance.hours == 0 && performance.minutes == 0 && performance.seconds == 0 && performance.centiseconds == 0) {
		valid = false;
	}

	// Sanitizing the data if it's valid
	if (valid) {
		if (performance.hours.length == 1) {
			performance.hours = '0' + performance.hours;
		} else if (performance.hours.length == 0) {
			performance.hours = '00';
		}
		if (performance.minutes.length == 1) {
			performance.minutes = '0' + performance.minutes;
		} else if (performance.minutes.length == 0) {
			performance.minutes = '00';
		}
		if (performance.seconds.length == 1) {
			performance.seconds = '0' + performance.seconds;
		} else if (performance.seconds.length == 0) {
			performance.seconds = '00';
		}
		if (performance.centiseconds.length == 1) {
			performance.centiseconds = '0' + performance.centiseconds;
		} else if (performance.centiseconds.length == 0) {
			performance.centiseconds = '00';
		}

		let time = performance.hours + ':' + performance.minutes + ':' + performance.seconds + '.' + performance.centiseconds;
	}

	return time;
};


/**
 * Checks distance inputs for validity
 * If the values are invalid, it returns zero
 * @param object performance
 * @return number
 */
activityHelper.validateDistance = function(performance) {
	let valid = true;
	let distance = 0;

	// Get the posted values. If a value was not posted, replace it with 0
	performance.distance_1 = typeof performance.distance_1 !== 'undefined' && performance.distance_1 != '' ? performance.distance_1 : '0';
	performance.distance_2 = typeof performance.distance_2 !== 'undefined' && performance.distance_2 != '' ? performance.distance_2 : '0';

	// Validating the first part of the measurement
	if (typeof performance.distance_1 !== 'string' || parseInt(performance.distance_1) != performance.distance_1 || performance.distance_1.length > 2 || performance.distance_1 < 0) {
		valid = false;
	}
	// Validating the second part of the measurement
	else if (typeof performance.distance_2 !== 'string' || parseInt(performance.distance_2) != performance.distance_2 || performance.distance_2.length > 2 || performance.distance_2 < 0) {
		valid = false;
	}

	// If the total distance was 0, it's invalid
	if (performance.distance_1 == 0 && performance.distance_2 == 0) {
		valid = false;
	}

	// Convertin the distance to a value that can be easily changed between meters and feet
	if (valid) {
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
activityHelper.validatePoints = function(performance) {
	let points = 0;

	// Get the posted values. If a value was not posted, replace it with null
	performance.points = typeof performance.points !== 'undefined' ? performance.points : null;

	if (typeof performance.points === 'string' && parseInt(performance.points) == performance.points && performance.points.length <= 5 && performance.points > 0) {
		points = performance.points;
	}

	return points;
};

/**
 * Parses the given date, from format "Thu Apr 11 2014" to
 * to a JavaScript date object
 * @param string date
 */
activityHelper.parseDate = function(date) {
	let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	date = date.split(' ');
	let currentDate = new Date();

	// If the date is invalid, return an empty string
	if (date.length != 4 || months.indexOf(date[1]) < 0 || !parseInt(date[2]) || date[2] < 1 || date[2] > 31 || !parseInt(date[3]) || date[3] < 1900 || date[3] > currentDate.getFullYear()) {
		return '';
	} else {
		// Create the date object
		let parsedDate = new Date(date[3], months.indexOf(date[1]), date[2]);
		return parsedDate < currentDate ? parsedDate : currentDate;
	}
};

/**
 * Checks if the length of the location string is acceptable
 * @param  string  location
 * @return boolean
 */
activityHelper.locationIsValid = function(location) {
	return typeof location === 'string' && location.length < 120;
}

/**
 * Checks if the place if it's a valid integer
 * @param  number  place
 * @return boolean
 */
activityHelper.placeIsValid = function(place) {
	return isPositiveInteger(place);
}

/**
 * Checks if the length of the competition string is acceptable
 * @param  string  competition
 * @return boolean
 */
activityHelper.competitionIsValid = function(competition) {
	return typeof competition === 'string' && competition.length < 120;
}

/**
 * Checks if the length of the notes string is acceptable
 * @param  string  location
 * @return boolean
 */
activityHelper.notesAreValid = function(notes) {
	return typeof notes === 'string' && notes.length < 1000;
}

/**
 * Parses the dates as they are stored in the db
 * @param  string 		date
 * @return date object
 */
activityHelper.parseDbDate = function(date) {
	date = date.split('T')[0];
	let dateParts = date.split('-');

	return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
}

/**
 * Checks if private is true/false
 * @param  boolean  private
 * @return boolean
 */
activityHelper.privacyIsValid = function(privateSetting) {
	return typeof privateSetting === 'boolean' || privateSetting.toLowerCase() === 'true' || privateSetting.toLowerCase() === 'false';
}

/**
 * Parses the privacy setting, in case it's represented by a string
 * @param  string|boolean privateSetting
 * @return boolean
 */
activityHelper.parsePrivacy = function(privateSetting) {
	if (typeof privateSetting === 'boolean') {
		return privateSetting;
	} else if (privateSetting.toLowerCase() === 'true') {
		return true;
	} else {
		return false;
	}
}

/**
 * Checks if the given value is a positive integer number
 * @param number value
 * @return boolean
 */
function isPositiveInteger(value) {
	return typeof value !== 'undefined' && !isNaN(parseInt(value)) && isFinite(value) && value > 0 && value % 1 === 0;
};

module.exports = activityHelper;
