// The User Model

var mongoose = require('mongoose');
var db = mongoose.connection;
var q = require('q');

//Define User SCHEMA
var activitySchema = mongoose.Schema({
  user_id		: { type: String, required: true, index: true },
  discipline	: { type: String, required: true },
  performance	: { type: String },
  date 			: { type: Date, default: Date.now }
});

/**
* Find user by element
* @param json where({email:someone@trafie.com})
* @param String select
* @param int sort (-1 == descending)
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
			d.resolve(activity);
		}
	);

	return d.promise;
};

/**
 * Converts the activity data to a more readable format
 * @param array activities
 */
activitySchema.formatActivities = function( activities ) {
	for( var i in activities ) {
		switch ( activities[i] ) {
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
          	var counter = 0;

			var centiseconds = activities[i].performance.split('.')[1];
			var performance_parts = activities[i].performance.split('.')[0].split(':');

			for( var i=0 ; i<2 ; i++ ) {
				if( performance_parts[i] == 0 ) {
					counter++;
				} else {
					break;
				}
			}

			for( var i=0 ; i<counter ; i++ ) {
			    performance_parts.splice(0, 1);
			}
			performance = performance_parts.join(':');
			activities[i].performance = performance + '.' + centiseconds;
            break;
          case 'high_jump':
          case 'long_jump':
          case 'triple_jump':
          case 'pole_vault':
          case 'shot_put':
          case 'discus':
          case 'hammer':
          case 'javelin':
            activities[i].performance = (activities[i].performance / 10000).toFixed(2);
            break;
          case 'pentathlon':
          case 'heptathlon':
          case 'decathlon':
           	
            break;
		}
	}
	return activities;
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
	var time = null;

	if( typeof performance.hours !== 'string' || parseInt( performance.hours ) != performance.hours || performance.hours.length > 2 || performance.hours < 0 ) {
		valid = false;
	}
	else if( typeof performance.minutes !== 'string' || parseInt( performance.minutes ) != performance.minutes || performance.minutes.length > 2 || performance.minutes > 59 || performance.minutes < 0 ) {
		valid = false;
	}
	else if( typeof performance.seconds !== 'string' || parseInt( performance.seconds ) != performance.seconds || performance.seconds.length > 2 || performance.seconds > 59 || performance.seconds < 0 ) {
		valid = false;
	}
	else if( typeof performance.centiseconds !== 'string' || parseInt( performance.centiseconds ) != performance.centiseconds || performance.centiseconds.length > 2 || performance.centiseconds < 0 ) {
		valid = false;
	}

	if( performance.hours == 0 && performance.minutes == 0 && performance.seconds == 0 && performance.centiseconds == 0 ) {
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
};

/**
 * Checks time inputs for validity, if they are valid, it adds leading zeros to
 * single digit values and it creates the performance string, ready to be stored
 * If the values are invalid, it returns an empty string
 * @param object performance
 * @return string
 */
activitySchema.validateDistance = function( performance ) {
	var valid = true;
	var distance = null;

	if( typeof performance.distance_1 !== 'string' || parseInt( performance.distance_1 ) != performance.distance_1 || performance.distance_1.length > 2 || performance.distance_1 < 0 ) {
		valid = false;
	}
	else if( typeof performance.distance_2 !== 'string' || parseInt( performance.distance_2 ) != performance.distance_2 || performance.distance_2.length > 2 || performance.distance_2 < 0 ) {
		valid = false;
	}

	if( performance.distance_1 == 0 && performance.distance_2 == 0 ) {
		valid = false;
	}

	if( valid ) {
		var distance = performance.distance_1 * 10000 + performance.distance_2 * 100;
	}

	return distance;
};

/**
 * Checks time inputs for validity, if they are valid, it adds leading zeros to
 * single digit values and it creates the performance string, ready to be stored
 * If the values are invalid, it returns an empty string
 * @param object performance
 * @return string
 */
activitySchema.validatePoints = function( performance ) {
	var points = null;

	if( typeof performance.points === 'string' && parseInt( performance.points ) == performance.points && performance.points.length <= 5 && performance.points > 0 ) {
		points = performance.points;
	}

	return points;
};

var Activity = mongoose.model( 'Activity', activitySchema );

module.exports = Activity;