// The User Model

var mongoose = require('mongoose');
var db = mongoose.connection;

//Define User SCHEMA
var activitySchema = mongoose.Schema({
  user_id : { type: String, required: true, index: true },
  discipline : { type: String, required: true },
  performance : { type: String }
});

var Activity = mongoose.model( 'Activity', activitySchema );

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

	if( typeof performance.hours !== 'string' || parseInt( performance.hours ) != performance.hours || performance.hours.length > 2 ) {
		valid = false;
	}
	else if( typeof performance.minutes !== 'string' || parseInt( performance.minutes ) != performance.minutes || performance.minutes.length > 2 ) {
		valid = false;
	}
	else if( typeof performance.seconds !== 'string' || parseInt( performance.seconds ) != performance.seconds || performance.seconds.length > 2 ) {
		valid = false;
	}
	else if( typeof performance.centiseconds !== 'string' || parseInt( performance.centiseconds ) != performance.centiseconds || performance.centiseconds.length > 2 ) {
		valid = false;
	}

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
}

module.exports = Activity;