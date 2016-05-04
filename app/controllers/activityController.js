'use strict';

var moment = require('moment');

// Loading models
var Activity = require('../models/activityModel');

// Loading helpers
var accessHelper = require('../helpers/accessHelper'),
	activityHelper = require('../helpers/activityHelper');

/**
 * Activities - GET
 */
exports.get = function(req, res) {
	var profileId = req.params.userId,
		userId = req.user && req.user._id || null;

	if (typeof req.params.userId === 'undefined') {
		res.status(404).json({message: 'Resource not found', errors: [{
            resource: 'user',
            code: 'not_found'
        }]});
		return;
	}
	accessHelper.validateAccess(req.user, profileId)
	.then(function(response) {
		// If the user has a valid session and they are not visiting a private profile
		if (response.success) {
			// If the activity id was specified, try to find the activity
			if (typeof req.params.activityId !== 'undefined') {
				var where = {};
				if(userId && profileId && userId === profileId) {
					where = {
						$and: [{
							_id: req.params.activityId
						}, {
							userId: profileId
						}]
					};
				} 
				else {
					where = {
						$and: [{
							_id: req.params.activityId
						}, {
							isPrivate: false
						}, {
							userId: profileId
						}]
					};
				}

				// Find the activity and return it
				Activity.schema.findOne(where, '').then(function(activity) {
					if(activity) {
                        res.status(200).json(activity);
                    } else {
                        res.status(404).json({message: 'Resource not found', errors: [{
                            resource: 'activity',
                            code: 'not_found'
                        }]});
                    }
                    return;
				})
				.catch(function(error) {
					res.status(500).json({message: 'Server error'});
				});
			} else {
				// If the activity id wasn't specified, try to fetch all the activities of the user
				let where = {};
				// If there was a discipline in the parameters of the GET request,
				// fetch the activities only of this discipline
				if (typeof req.query.discipline !== 'undefined' && req.query.discipline) {
					where.discipline = req.query.discipline;
				}

                if(typeof req.query.isDeleted !== 'undefined' && ['true', 'false'].indexOf(req.query.isDeleted) >= 0) {
                    where.isDeleted = req.query.isDeleted === 'true';
                }

                if (typeof req.query.from !== 'undefined') {
                    let from = parseInt(req.query.from);
                    if(from >= 0 && from <= moment().unix()) {
                        where.date = {
                            "$gte": from
                        };
                    }
                }
				if (typeof req.query.to !== 'undefined') {
					let to = parseInt(req.query.to);
                    if(to >= 0 && to <= moment().unix()) {
                        if(where.hasOwnProperty('date')) {
                            where.date.$lte = to;
                        } else {
                            where.date = {
                                "$lte": to
                            };
                        }
                    }
				}

                if (typeof req.query.updatedFrom !== 'undefined') {
                    let from = parseInt(req.query.updatedFrom);
                    if(from >= 0 && from <= moment().unix()) {
                        where.dateUpdated = {
                            "$gte": moment.unix(from).toDate()
                        };
                    }
                }
                if (typeof req.query.updatedTo !== 'undefined') {
                    let to = parseInt(req.query.updatedTo);
                    if(to >= 0 && to <= moment().unix()) {
                        if(where.hasOwnProperty('dateUpdated')) {
                            where.dateUpdated.$lte = moment.unix(to).toDate();
                        } else {
                            where.dateUpdated = {
                                "$lte": moment.unix(to).toDate()
                            };
                        }
                    }
                }

				where.userId = response.profile._id;

				if (!response.user._id || response.user._id.toString() !== response.profile._id.toString()) {
					where.isPrivate = false;
				}
                
				Activity.schema.getActivitiesOfUser(where, '', -1)
				.then(function(activities) {
					res.json(activities);
				})
				.catch(function(error) {
					res.status(500).json({message: 'Server error'});
				});
			}
		} else {
			// Otherwise, if it's a server error, send the error
			if (response.error === 'query_error') {
				res.status(500).json({message: 'Server error'});
			} else {
				// If the user doesn't have access to the data, or the data don't exist, do not send anything
				res.status(404).json({message: 'Resource not found', errors: [{
                    resource: 'activity',
                    code: 'not_found'
                }]});
			}
		}
	});
};

/**
 * Activities - POST
 */
exports.post = function(req, res) {
	// Get the user id from the session
	var userId = req.user && req.user._id || null;
	// If there is no user id, or the user id is different than the one in the session
	if (!userId) {
		res.status(401).json({message: 'Unauthorized'});
	}
    else if(userId.toString() !== req.params.userId) {
        res.status(403).json({message: 'Forbidden'});
    }
	else {
		Activity.count({userId: userId, isDeleted: false}, function(err, activitiesCount) {
			if(activitiesCount >= 500) {
				res.status(403).json({message: 'Forbidden', errors: [{
					resource: 'activity',
					code: 'user_activity_limit'
				}]});
				return;
			}
            else if(!req.user.isValid && activitiesCount >= 10) {
                res.status(403).json({message: 'Forbidden', errors: [{
                    resource: 'activity',
                    code: 'non_verified_user_activity_limit'
                }]});
                return;
            }

			// Create the record that will be inserted in the db
			var activityData = {
				userId: userId,
				discipline: req.body.discipline || null,
				performance: typeof req.body.performance !== 'undefined' ? req.body.performance : null,
				date: req.body.date || null,
				rank: req.body.rank || null,
				location: req.body.location || null,
				competition: req.body.competition || null,
				notes: req.body.notes || null,
				isPrivate: typeof req.body.isPrivate !== 'undefined' ? req.body.isPrivate : false,
				isOutdoor: typeof req.body.isOutdoor !== 'undefined' ? req.body.isOutdoor : false
			};
			var activity = new Activity(activityData),
				errors = activity.checkValid();

			if(!errors) {
				// Save the activity
				activity.save()
					.then(function(activityRes) {
						res.status(201).json(activityRes);
					}, function(err) {
						res.status(500).json({message: 'Server error'});
					});
			} else {
				// If there are errors, send the error messages to the client
				res.status(422).json({message: 'Invalid data', errors: errors});
			}
		});
	}
};

/**
 * Activities - PUT
 */
exports.put = function(req, res) {
	// Get the user id from the session
	var userId = req.user && req.user._id.toString() || null;
	// Get the activity id from the url
	var activityId = typeof req.params.activityId !== 'undefined' ? req.params.activityId : null;

	if (!userId) {
        res.status(401).json({message: 'Unauthorized'});
	}
    else if (!activityId) {
        res.status(400).json({message: 'Bad Request'});
    }
    else if(userId.toString() !== req.params.userId) {
        res.status(403).json({message: 'Forbidden'});
    }
    else {
		Activity.schema.findOne({_id: activityId, userId: userId}, '')
		.then(function(activity) {
			if (!activity || typeof activity._id == 'undefined') res.status(404).json({message: 'Resource not found', errors: [{
                resource: 'activity',
                code: 'not_found'
            }]});

			// Create the record that will be inserted in the db
			activity.discipline = typeof req.body.discipline !== 'undefined' ? req.body.discipline : activity.discipline;
			activity.performance = typeof req.body.performance !== 'undefined' ? req.body.performance : activity.performance;
			activity.date = typeof req.body.date !== 'undefined' ? req.body.date : activity.date;
			activity.rank = typeof req.body.rank !== 'undefined' ? req.body.rank : activity.rank;
			activity.location = typeof req.body.location !== 'undefined' ? req.body.location : activity.location;
			activity.competition = typeof req.body.competition !== 'undefined' ? req.body.competition : activity.competition;
			activity.notes = typeof req.body.notes !== 'undefined' ? req.body.notes : activity.notes;
			activity.isPrivate = typeof req.body.isPrivate !== 'undefined' ? req.body.isPrivate : activity.isPrivate;
            activity.isOutdoor = typeof req.body.isOutdoor !== 'undefined' ? req.body.isOutdoor : activity.isOutdoor;

            var errors = activity.checkValid();

			// If there are no errors
			if (!errors) {
				activity.save(function(err, activity) {
					if(err) {
						res.status(500).json({message: 'Server error'});
					} else {
						res.status(200).json(activity);
					}
				});
			} else {
				// If there are errors, send the error messages to the client
                res.status(422).json({message: 'Invalid data', errors: errors});
			}
		})
		.catch(function(error) {
			res.status(500).json({message: 'Server error'});
		});
	}
};

/**
 * Activites - DELETE
 */
exports.delete = function(req, res) {
	// Get the user id from the session
	var userId = req.user && req.user._id.toString();
	// Get the activity id from the url
	var activityId = req.params.activityId;

    if (!userId) {
        res.status(401).json({message: 'Unauthorized'});
    }
    else if (!activityId) {
        res.status(400).json({message: 'Bad Request'});
    }
    else if(userId.toString() !== req.params.userId) {
        res.status(403).json({message: 'Forbidden'});
    }
    else {
        Activity.schema.findOne({_id: activityId, userId: userId}, '')
        .then(function(activity) {
            if(!activity) {
                res.status(404).json({message: 'Resource not found', errors: [{
                    resource: 'activity',
                    code: 'not_found'
                }]});
            } else {
                activity.isDeleted = true;
                activity.save(function(err, activity) {
                    if(err) {
                        res.status(500).json({message: 'Server error'});
                    } else {
                        res.status(200).json(activity);
                    }
                });
            }
        })
		.catch(function(error) {
			res.status(500).json({message: 'Server error'});
		});
	}
};