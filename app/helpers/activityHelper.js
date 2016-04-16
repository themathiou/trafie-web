'use strict';

const config = require('../config/constantConfig');
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

activityHelper.validateTime = function(performance) {
	return isPositiveInteger(performance) && parseInt(performance) < config.validations.activity.performance.timeMaxValue ? parseInt(performance) : null;
};

activityHelper.validateDistance = function(performance) {
	return isPositiveInteger(performance) && parseInt(performance) < config.validations.activity.performance.distanceMaxValue ? parseInt(performance) : null;
};

activityHelper.validatePoints = function(performance) {
	return isPositiveInteger(performance) && parseInt(performance) < config.validations.activity.performance.pointsMaxValue ? parseInt(performance) : null;
};

activityHelper.timestampIsValid = function(timestamp) {
	return isPositiveInteger(timestamp) && parseInt(timestamp) < moment().unix() ? parseInt(timestamp) : null;
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
	return config.validations.activity.location.test(location);
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
	return config.validations.activity.competition.test(competition);
};

/**
 * Checks if the length of the notes string is acceptable
 * @param  string  location
 * @return boolean
 */
activityHelper.notesAreValid = function(notes) {
	return config.validations.activity.notes.test(notes);
};

/**
 * Checks if private is true/false
 * @param  boolean  private
 * @return boolean
 */
activityHelper.privacyIsValid = function(privateSetting) {
	return typeof privateSetting === 'boolean' || privateSetting.toLowerCase() === 'true' || privateSetting.toLowerCase() === 'false';
};

activityHelper.outdoorIsValid = function(outdoorSetting) {
	return typeof outdoorSetting === 'boolean' || outdoorSetting.toLowerCase() === 'true' || outdoorSetting.toLowerCase() === 'false';
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
