'use strict';

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
		res.status(404).json(null);
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
					var statusCode = activity ? 200 : 404;
					res.status(statusCode).json(activity);
                    return;
				})
				.catch(function(error) {
					res.status(500).json(null);
				});
			} else {
				// If the activity id wasn't specified, try to fetch all the activities of the user
				let where = {};
				// If there was a discipline in the parameters of the GET request,
				// fetch the activities only of this discipline
				if (typeof req.query.discipline !== 'undefined' && req.query.discipline) {
					where.discipline = req.query.discipline;
				}
				if (typeof req.query.from !== 'undefined' && req.query.from && typeof req.query.to !== 'undefined' && req.query.to) {
					where.date = {
						"$gte": parseInt(req.query.from),
						"$lte": parseInt(req.query.to)
					};
				} else if (typeof req.query.from !== 'undefined') {
					where.date = {
						"$gte": parseInt(req.query.from)
					};
				} else if (typeof req.query.to !== 'undefined') {
					where.date = {
						"$lte": parseInt(req.query.to)
					};
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
					res.status(500).json(null);
				});
			}
		} else {
			// Otherwise, if it's a server error, send the error
			if (response.error === 'query_error') {
				res.status(500).json(null);
			} else {
				// If the user doesn't have access to the data, or the data don't exist, do not send anything
				res.status(404).json(null);
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
	if (!userId || (userId.toString() !== req.params.userId)) {
		res.status(403).json(null);
	} else {
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
				res.status(500).json(null);
			});
		} else {
			// If there are errors, send the error messages to the client
			res.status(400).json({errors: errors});
		}
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

	if (!userId || !activityId || (userId !== req.params.userId)) {
		res.status(403).json(null);
	} else {
		Activity.schema.findOne({_id: activityId, userId: userId}, '')
		.then(function(activity) {
			if (!activity || typeof activity._id == 'undefined') res.status(404).json(null);

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
						res.status(500).json(null);
					} else {
						res.status(200).json(activity);
					}
				});
			} else {
				// If there are errors, send the error messages to the client
				res.status(400).json({errors: errors});
			}
		})
		.catch(function(error) {
			res.status(500).json(null);
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

	// If there is no user id, return an empty json
	if (!userId || !activityId || (userId !== req.params.userId)) {
		res.status(403).json(null);
	} else {
		Activity.schema.delete({'_id': activityId, 'userId': userId})
		.then(function(deleted) {
			var status = deleted ? 200 : 403;
			res.status(status).json(null);
		})
		.catch(function(error) {
			res.status(500).json(null);
		});
	}
};