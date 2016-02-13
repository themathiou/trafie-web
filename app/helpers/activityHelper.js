'use strict';
let moment = require('moment');

let activityHelper = {};

/**
 * Checks if the discipline is valid
 * @param  string discipline
 * @return string
 */
activityHelper.validateDiscipline = function(discipline) {
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
			return 'points';
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
	return isPositiveInteger(performance) ? parseInt(performance) : null;
};

activityHelper.validateDistance = function(performance) {
	return isPositiveInteger(performance) ? parseInt(performance) : null;
};

/**
 * Checks points inputs for validity
 * If the values are invalid, it returns an empty string
 * @param object performance
 * @return string
 */
activityHelper.validatePoints = function(performance) {
	return isPositiveInteger(performance) ? parseInt(performance) : null;
};

/**
 * Parses the given date, from format "YYYY-MM-DD HH:mm:ss" to
 * a JavaScript date object
 * @param string date
 */
activityHelper.parseDate = function(date) {
	if(date instanceof Date) {
		date = moment(date);
	} else if(parseInt(date)) {
		date = moment.unix(parseInt(date));
	} else {
        return null;
    }

	return date.isValid() && moment().unix() > date.unix() && date.unix() >= 0 ? date.toDate() : null;
};

/**
 * Checks if the length of the location string is acceptable
 * @param  string  location
 * @return boolean
 */
activityHelper.locationIsValid = function(location) {
	return typeof location === 'string' && location.length < 120;
};

/**
 * Checks if the rank is a valid integer
 * @param  number  rank
 * @return boolean
 */
activityHelper.rankIsValid = function(rank) {
	return isPositiveInteger(rank);
};

/**
 * Checks if the length of the competition string is acceptable
 * @param  string  competition
 * @return boolean
 */
activityHelper.competitionIsValid = function(competition) {
	return typeof competition === 'string' && competition.length < 120;
};

/**
 * Checks if the length of the notes string is acceptable
 * @param  string  location
 * @return boolean
 */
activityHelper.notesAreValid = function(notes) {
	return typeof notes === 'string' && notes.length < 1000;
};

/**
 * Parses the dates as they are stored in the db
 * @param  string 		date
 * @return date object
 */
activityHelper.parseDbDate = function(date) {
	date = date.split('T')[0];
	let dateParts = date.split('-');

	return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
};

/**
 * Checks if private is true/false
 * @param  boolean  private
 * @return boolean
 */
activityHelper.privacyIsValid = function(privateSetting) {
	return typeof privateSetting === 'boolean' || privateSetting.toLowerCase() === 'true' || privateSetting.toLowerCase() === 'false';
};

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
};

/**
 * Checks if the given value is a positive integer number
 * @param number value
 * @return boolean
 */
function isPositiveInteger(value) {
	return typeof value !== 'undefined' && !isNaN(parseInt(value)) && isFinite(value) && value >= 0 && value % 1 === 0;
};

module.exports = activityHelper;
