'use strict';

var mongoose = require('mongoose');
var db = mongoose.connection;
var moment = require('moment');
var q = require('q');
// Loading helpers
var activityHelper = require('../helpers/activityHelper');

//Define User SCHEMA
var activitySchema = mongoose.Schema({
    userId      : { type: String,   required: true,     index: true },
    discipline  : { type: String,   required: true },
    performance : { type: Number,   required: true },
    date        : { type: Number,   required: true },
    rank        : { type: Number,   required: false,    default: null },
    location    : { type: String,   required: false,    default: '' },
    competition : { type: String,   required: false,    default: '' },
    notes       : { type: String,   required: false,    default: '' },
    comments    : { type: String,   required: false,    default: '' },
    isPrivate   : { type: Boolean,  required: false,    default: false },
    isDeleted   : { type: Boolean,  required: false,    default: false },
    type        : { type: String,   required: false,    default: 'competition' },
    isOutdoor   : { type: Boolean,  required: false,    default: true },
    picture     : { type: String,   required: false,    default: '' },
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
    var errors = [],
        disciplineType = '';

    if(!this.discipline) {
        errors.push({
            resource: 'activity',
            field: 'discipline',
            code: 'missing'
        });
    } else {
        disciplineType = activityHelper.validateDiscipline(this.discipline);
        if(!disciplineType) {
            errors.push({
                resource: 'activity',
                field: 'discipline',
                code: 'invalid'
            });
        }
    }

    if(!('performance' in this)) {
        errors.push({
            resource: 'activity',
            field: 'performance',
            code: 'missing'
        });
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
            errors.push({
                resource: 'activity',
                field: 'performance',
                code: 'invalid'
            });
        }
    }

    // Validating date (required field)
    if(!this.date) {
        errors.push({
            resource: 'activity',
            field: 'date',
            code: 'missing'
        });
    } else {
        this.date = activityHelper.timestampIsValid(this.date);
        if(!this.date) {
            errors.push({
                resource: 'activity',
                field: 'date',
                code: 'invalid'
            });
        }
    }

    // Validating competition
    if(!this.competition) {
        errors.push({
            resource: 'activity',
            field: 'competition',
            code: 'missing'
        });
    }
    else if (this.competition && !activityHelper.competitionIsValid(this.competition)) {
        errors.push({
            resource: 'activity',
            field: 'competition',
            code: 'invalid'
        });
    }

    // Validating location
    if (this.location && !activityHelper.locationIsValid(this.location)) {
        errors.push({
            resource: 'activity',
            field: 'location',
            code: 'invalid'
        });
    }

    // Validating rank
    if (this.rank && !activityHelper.rankIsValid(this.rank)) {
        errors.push({
            resource: 'activity',
            field: 'rank',
            code: 'invalid'
        });
    }

    // Validating notes
    if (this.notes && !activityHelper.notesAreValid(this.notes)) {
        errors.push({
            resource: 'activity',
            field: 'notes',
            code: 'invalid'
        });
    }

    // Validating comments
    if (this.comments && !activityHelper.commentsAreValid(this.comments)) {
        errors.push({
            resource: 'activity',
            field: 'comments',
            code: 'invalid'
        });
    }

    // Validating privacy (required field)
    if (!('isPrivate' in this) || ('isPrivate' in this && !activityHelper.privacyIsValid(this.isPrivate))) {
        errors.push({
            resource: 'activity',
            field: 'isPrivate',
            code: 'invalid'
        });
    }

    // Validating the outdoor flag (required field)
    if (!('isOutdoor' in this) || ('isOutdoor' in this && !activityHelper.outdoorIsValid(this.isOutdoor))) {
        errors.push({
            resource: 'activity',
            field: 'isOutdoor',
            code: 'invalid'
        });
    }
    return errors.length ? errors: null;
};

var Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
