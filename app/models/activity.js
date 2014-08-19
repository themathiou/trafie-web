var mongoose = require('mongoose');
var db = mongoose.connection;
var q = require('q');

//Define User SCHEMA
var activitySchema = mongoose.Schema({
  user_id		: { type: String, required: true, index: true },
  discipline	: { type: String, required: true },
  performance	: { type: String },
  date 			: { type: Date, default: Date.now },
  place 		: { type: Number },
  location 		: { type: String },
  competition 	: { type: String },
  notes 		: { type: String },
  private 		: { type: Boolean, required: true, default: false }
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

var Activity = mongoose.model( 'Activity', activitySchema );

module.exports = Activity;