'use strict';

var mongoose = require('mongoose');
var db = mongoose.connection;
var moment = require('moment');
var q = require('q');
// Loading helpers
var activityHelper = require('../helpers/activityHelper.js');

//Define User SCHEMA
var activitySchema = mongoose.Schema({
	userId		: { type: String, 	required: true, 	index: true },
	discipline	: { type: String, 	required: true },
	performance	: { type: Number, 	required: true },
	date 		: { type: Number, 	required: true },
	rank 		: { type: Number, 	required: false, 	default: null },
	location 	: { type: String, 	required: false, 	default: '' },
	competition : { type: String, 	required: false, 	default: '' },
	notes 		: { type: String, 	required: false, 	default: '' },
	isPrivate 	: { type: Boolean, 	required: false, 	default: false },
	type 		: { type: String, 	required: false, 	default: 'competition' },
    isOutdoor 	: { type: Boolean, 	required: false, 	default: true },
	dateCreated : { type: Date },
	dateUpdated : { type: Date }
});

activitySchema.pre('save', function(next){
	var now = new Date();
	this.dateUpdated = now;
	if ( !this.dateCreated ) {
		this.dateCreated = now;
	}
	next();
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
	select = select || 'userId discipline performance date rank location competition notes isPrivate type isOutdoor';
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
		function(err, activities) {
			if (err) d.reject(err);
			d.resolve(activities);
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
		if (err) d.reject(err);
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
		if (err) d.reject(err);
		d.resolve(deleted);
	});

	return d.promise;
};

/**
 * WARNING: DO NOT RENAME TO VALIDATE, IT MAKES MONGOOSE HANG
 * Checks if all the data in the model are valid
 */
activitySchema.methods.checkValid = function() {
	var errors = false,
		errorMessages = {},
		disciplineType = '';

	if(!this.discipline) {
		errors = true;
		errorMessages.performance = 'discipline_is_required';
	} else {
		disciplineType = activityHelper.validateDiscipline(this.discipline);
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
				this.performance = activityHelper.validateTime(this.performance);
				break;
			case 'distance':
				this.performance = activityHelper.validateDistance(this.performance);
				break;
			case 'points':
				this.performance = activityHelper.validatePoints(this.performance);
				break;
		}
		if(this.performance === null) {
			errors = true;
			errorMessages.performance = 'invalid_performance';
		}
	}

	// Validating date (required field)
	if(!this.date) {
		errors = true;
		errorMessages.date = 'date_is_required';
	} else {
		this.date = activityHelper.timestampIsValid(this.date);
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

	// Validating rank
	if (this.rank && !activityHelper.rankIsValid(this.rank)) {
		errors = true;
		errorMessages.rank = 'invalid_rank';
	}

	// Validating competition
	if (this.competition && !activityHelper.competitionIsValid(this.competition)) {
		errors = true;
		errorMessages.competition = 'too_long_text';
	}

	// Validating notes
	if (this.notes && !activityHelper.notesAreValid(this.notes)) {
		errors = true;
		errorMessages.notes = 'too_long_text';
	}

	// Validating privacy (required field)
	if (!('isPrivate' in this) || ('isPrivate' in this && !activityHelper.privacyIsValid(this.isPrivate))) {
		errors = true;
		errorMessages.isPrivate = 'invalid_privacy';
	}

	return errors ? errorMessages : null;
};

var Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
