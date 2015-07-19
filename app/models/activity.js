'use strict';

var mongoose = require('mongoose');
var db = mongoose.connection;
var q = require('q');
// Loading helpers
var activityHelper = require('../helpers/activityHelper.js');

//Define User SCHEMA
var activitySchema = mongoose.Schema({
	userId		: { type: String, required: true, index: true },
	discipline	: { type: String, required: true },
	performance	: { type: String },
	date 		: { type: Date, default: Date.now },
	place 		: { type: Number },
	location 	: { type: String },
	competition : { type: String },
	notes 		: { type: String },
	private 	: { type: Boolean, required: true, default: false }
});


/**
 * Find activity by element
 * @param json where( { _id: id } )
 * @param String select
 */
activitySchema.findOne = function(where, select) {
	var d = q.defer();
	Activity.findOne(where, select, function(err, activity) {
		d.resolve(activity);
	});
	return d.promise;
};

/**
 * Find user by element
 * @param json where( { email: someone@trafie.com } )
 * @param String select
 * @param number sort (-1 == descending)
 */
activitySchema.getActivitiesOfUser = function(where, select, sort) {
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
			sort: {
				// -1 = descending
				date: sort
			}
		},
		function(err, activity) {
			if (err) handleError(err);
			d.resolve(activity);
		}
	);

	return d.promise;
};

/**
 * Returns all the names of the disciplines, that are included
 * in the user's activities
 * @param json where( { userId: hash } )
 */
activitySchema.getDisciplinesPerformedByUser = function(where) {
	var d = q.defer();
	Activity.distinct('discipline', where, function(err, activity) {
		if (err) handleError(err);
		d.resolve(activity);
	});

	return d.promise;
};

/**
 * Delete an activity
 * @param json where
 */
activitySchema.delete = function(where) {
	var d = q.defer();

	Activity.remove(where, function(err, deleted) {
		if (err) handleError(err);
		d.resolve(deleted);
	});

	return d.promise;
};

activitySchema.methods.validate = function() {
	var errors = false,
		errorMessages = {},
		disciplineType = '';

	if(!this.discipline) {
		errors = true;
		errorMessages.performance = 'discipline_is_required';
	} else {
		disciplineType = activityHelper.validateDiscipline(this.discinpline);
		if(!disciplineType) {
			errors = true;
			errorMessages.performance = 'invalid_discipline';
		}
	}

	if(!('performance' in this)) {
		errors = true;
		errorMessages.performance = 'performance_is_required';
	} 
	else if(disciplineType) {
		var performance = null;
		switch (disciplineType) {
			case 'time':
				performance = activityHelper.validateTime(this.performance);
				break;
			case 'distance':
				performance = activityHelper.validateDistance(this.performance);
				break;
			case 'points':
				performance = activityHelper.validatePoints(this.performance);
				break;
		}
		this.performance = perfrormance;
		if (!performance) {
			errors = true;
			errorMessages.performance = 'invalid_performance';
		}
	}

	// Validating date (required field)
	if(!this.date) {
		errors = true;
		errorMessages.date = 'date_is_required';
	} 
	else {
		this.date = activityHelper.parseDate(this.date);
		if(!this.date) {
			errors = true;
			errorMessages.date = 'wrong_date_format';
		}
	}

	// Validating location
	if (this.location && !activityHelper.locationIsValid(this.location)) {
		errors = true;
		errorMessages.location = 'too_long_text';
	}

	// Validating place
	if (this.place && !activityHelper.placeIsValid(this.place)) {
		errors = true;
		errorMessages.place = 'invalid_place';
	}

	// Validating competition
	if (this.competition && !activityHelper.competitionIsValid(this.competition)) {
		errors = true;
		errorMessages.competition = 'too_long_text';
	}

	// Validating notes
	if (this.notes && !activityHelper.notesAreValid(req.body.notes)) {
		errors = true;
		errorMessages.notes = 'too_long_text';
	}

	// Validating privacy (required field)
	if (!('private' in this) || ('private' in this && !activityHelper.privacyIsValid(this.private))) {
		errors = true;
		errorMessages.private = 'invalid_privacy';
	}

	return errors ? errorMessages : null;
};

var Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
