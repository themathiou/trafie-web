'use strict';

// Loading models
const Profile = require('../models/profile.js'),
	Activity = require('../models/activity.js');

// Loading helpers
const mainHelper = require('../helpers/main_helper.js'),
	activityHelper = require('../helpers/activity.js');

// Initialize translations
const translations = require('../languages/translations.js');


/**
 * Activities - GET
 */
exports.get = function(req, res) {
	var profile_id = false,
		user_id = typeof req.session.user_id !== 'undefined' ? req.session.user_id : null;

	if (typeof req.params.user_id !== 'undefined') {
		profile_id = req.params.user_id;
	} else {
		send_status(res, 404);
		return;
	}

	mainHelper.validateAccess(user_id, profile_id, function(response) {
		// If the user has a valid session and they are not visiting a private profile
		if (response.success) {
			// If the activity id was specified, try to find the activity
			if (typeof req.params.activity_id !== 'undefined') {
				return_activity(res, 200, req.params.activity_id, user_id, response.profile.language, response.profile.date_format);
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
						"$gte": activityHelper.parseDbDate(req.query.from),
						"$lte": activityHelper.parseDbDate(req.query.to)
					};
				} else if (typeof req.query.from !== 'undefined') {
					where.date = {
						"$gte": activityHelper.parseDbDate(req.query.from)
					};
				} else if (typeof req.query.to !== 'undefined') {
					where.date = {
						"$lte": activityHelper.parseDbDate(req.query.to)
					};
				}

				where.user_id = response.profile._id;

				if (!response.user._id || response.user._id.toString() !== response.profile._id.toString()) {
					where.private = false;
				}

				return_activities(res, 200, where, response.user.language, response.user.date_format);
			}
		} else {
			// Otherwise, if it's a server error, send the error
			if (response.error === 'query_error') {
				send_status(res, 500);
			} else {
				// If the user doesn't have access to the data, or the data don't exist, do not send anything
				send_status(res, 404);
			}
		}
	});
};


/**
 * Activities - POST
 */
exports.post = function(req, res) {
	// Get the user id from the session
	var user_id = req.session.user_id;
	// If there is no user id, or the user id is different than the one in the session
	if (!user_id || (user_id !== req.params.user_id)) {
		return_activity(res, 403);
	} else {
		// Find the profile
		Profile.schema.findOne({
				'_id': user_id
			}, 'language date_format')
			.then(function(profile_data) {
				// If the profile doesn't exist, send an empty json
				if (typeof profile_data.language === 'undefined') return_activity(res, 404);

				var errors = false,
					error_messages = {},
					discipline = typeof req.body.discipline !== 'undefined' ? req.body.discipline : '',
					performance = '',
					location = '',
					place = 0,
					competition = '',
					notes = '',
					isPrivate = false,
					tr = translations[profile_data.language],
					disciplineType = false;

				// Validating discipline (required field)
				if (typeof req.body.discipline !== 'undefined' && typeof req.body.performance !== 'undefined') {
					disciplineType = activityHelper.disciplineIsValid(req.body.discipline);

					if (!disciplineType) {
						errors = true;
						error_messages.performance = tr['invalid_discipline'];
					}
				} else {
					errors = true;
					error_messages.performance = tr['discipline_is_required'];
				}

				// Validating performance (required field)
				if (typeof req.body.performance !== 'undefined') {
					switch (disciplineType) {
						case 'time':
							performance = activityHelper.validateTime(req.body.performance);
							break;
						case 'distance':
							performance = activityHelper.validateDistance(req.body.performance);
							break;
						case 'points':
							performance = activityHelper.validatePoints(req.body.performance);
							break;

							if (!performance) {
								errors = true;
								error_messages.performance = tr['invalid_performance'];
							}
					}
				} else {
					errors = true;
					error_messages.performance = tr['performance_is_required'];
				}

				// Validating date (required field)
				if (typeof req.body.date !== 'undefined' && req.body.date) {
					var date = activityHelper.parseDate(req.body.date);
					if (!date) {
						errors = true;
						error_messages.date = 'wrong_date_format';
					}
				} else {
					errors = true;
					error_messages.date = 'date_is_required';
				}

				// Validating location
				if (typeof req.body.location !== 'undefined') {
					if (activityHelper.locationIsValid(req.body.location)) {
						location = req.body.location;
					} else {
						errors = true;
						error_messages.location = tr['too_long_text'];
					}
				}

				// Validating place
				if (typeof req.body.place !== 'undefined' && req.body.place) {
					if (activityHelper.placeIsValid(req.body.place)) {
						place = req.body.place;
					} else {
						errors = true;
						error_messages.place = tr['invalid_place'];
					}
				}

				// Validating competition
				if (typeof req.body.competition !== 'undefined') {
					if (activityHelper.competitionIsValid(req.body.competition)) {
						competition = req.body.competition;
					} else {
						errors = true;
						error_messages.competition = tr['too_long_text'];
					}
				}

				// Validating notes
				if (typeof req.body.notes !== 'undefined') {
					if (activityHelper.notesAreValid(req.body.notes)) {
						notes = req.body.notes;
					} else {
						errors = true;
						error_messages.notes = tr['too_long_text'];
					}
				}

				// Validating privacy (required field)
				if (typeof req.body.private !== 'undefined' && activityHelper.privacyIsValid(req.body.private)) {
					isPrivate = activityHelper.parsePrivacy(req.body.private);
				} else {
					errors = true;
					error_messages.private = tr['invalid_privacy'];
				}

				// If there are no errors
				if (!errors) {
					// Create the record that will be inserted in the db
					var new_activity = {
						'user_id': user_id,
						'discipline': discipline,
						'performance': performance,
						'date': date,
						'place': place,
						'location': location,
						'competition': competition,
						'notes': notes,
						'private': isPrivate
					};

					var activity = new Activity(new_activity);
					// Save the activity
					activity.save(function(err, activity) {
							return_activity(res, 201, activity._id, user_id, profile_data.language, profile_data.date_format);
						})
						.fail(function(error) {
							send_status(res, 500);
						});
				} else {
					// If there are errors, send the error messages to the client
					return_activity(res, 400, '', user_id, profile_data.language, profile_data.date_format, error_messages);
				}
			});
	}
};


/**
 * Activities - PUT
 */
exports.put = function(req, res) {
	// Get the user id from the session
	var user_id = typeof req.session.user_id !== 'undefined' ? req.session.user_id : null;
	// Get the activity id from the url
	var activity_id = typeof req.params.activity_id !== 'undefined' ? req.params.activity_id : null;

	var language = '',
		date_format = '';

	// If there is no user id, redirect to login
	if (!user_id || !activity_id || (user_id !== req.params.user_id)) {
		return_activity(res, 403);
	} else {
		// Find the profile
		Profile.schema.findOne({
				'_id': user_id
			}, 'language date_format')
			.then(function(profile_data) {
				// If the profile doesn't exist, redirect
				if (typeof profile_data.language === 'undefined') return_activity(res, 404);

				language = profile_data.language;
				date_format = profile_data.date_format;

				return Activity.schema.findOne({
					'_id': activity_id
				}, '');
			})
			.then(function(activity) {
				if (typeof activity._id == 'undefined') return_activity(res, 404, '', user_id, language, date_format);

				var errors = false,
					error_messages = {},
					tr = translations[language],
					activity = {},
					disciplineType = false;

				// Validating discipline (required field)
				if (typeof req.body.discipline !== 'undefined' && typeof req.body.performance !== 'undefined') {
					disciplineType = activityHelper.disciplineIsValid(req.body.discipline);

					if (disciplineType) {
						activity.discipline = req.body.discipline;
					} else {
						errors = true;
						error_messages.performance = tr['invalid_discipline'];
					}
				}

				// Validating performance (required field)
				if (typeof req.body.performance !== 'undefined') {
					switch (disciplineType) {
						case 'time':
							activity.performance = activityHelper.validateTime(req.body.performance);
							break;
						case 'distance':
							activity.performance = activityHelper.validateDistance(req.body.performance);
							break;
						case 'points':
							activity.performance = activityHelper.validatePoints(req.body.performance);
							break;
						default:
							errors = true;
							error_messages.performance = tr['invalid_performance'];
							break;
					}
				}

				// Checking if the date value is valid
				if (typeof req.body.date !== 'undefined' && req.body.date) {
					let date = activityHelper.parseDate(req.body.date);
					if (date) {
						activity.date = date;
					} else {
						errors = true;
						error_messages.date = 'wrong_date_format';
					}
				}

				// Validating location
				if (typeof req.body.location !== 'undefined') {
					if (activityHelper.locationIsValid(req.body.location)) {
						activity.location = req.body.location;
					} else {
						errors = true;
						error_messages.location = tr['too_long_text'];
					}
				}

				// Validating place
				if (typeof req.body.place !== 'undefined' && req.body.place) {
					if (activityHelper.placeIsValid(req.body.place)) {
						activity.place = req.body.place;
					} else {
						errors = true;
						error_messages.place = tr['invalid_place'];
					}
				}

				// Validating competition
				if (typeof req.body.competition !== 'undefined') {
					if (activityHelper.competitionIsValid(req.body.competition)) {
						activity.competition = req.body.competition;
					} else {
						errors = true;
						error_messages.competition = tr['too_long_text'];
					}
				}

				// Validating notes
				if (typeof req.body.notes !== 'undefined') {
					if (activityHelper.notesAreValid(req.body.notes)) {
						activity.notes = req.body.notes;
					} else {
						errors = true;
						error_messages.notes = tr['too_long_text'];
					}
				}

				// Validating privacy
				if (typeof req.body.private !== 'undefined') {
					if (activityHelper.privacyIsValid(req.body.private)) {
						activity.private = activityHelper.parsePrivacy(req.body.private);
					} else {
						errors = true;
						error_messages.private = tr['invalid_privacy'];
					}
				}

				// If there are no errors
				if (!errors && Object.keys(activity).length) {
					Activity.findByIdAndUpdate(activity_id, activity, '', function(err, activity) {
						return_activity(res, 200, activity._id, user_id, language, date_format);
					});
				} else if (!Object.keys(activity).length) {
					// If there were no changes
					return_activity(res, 200, activity_id, user_id, language, date_format, error_messages);
				} else {
					// If there are errors, send the error messages to the client
					return_activity(res, 400, '', user_id, language, date_format, error_messages);
				}
			})
			.fail(function(error) {
				console.log('Error: Query failed while updating an activity');
				send_status(res, 500);
			});
	}
};


/**
 * Activites - DELETE
 */
exports.delete = function(req, res) {
	// Get the user id from the session
	var user_id = req.session.user_id;
	// Get the activity id from the url
	var activity_id = req.params.activity_id;

	// If there is no user id, return an empty json
	if (!user_id || !activity_id || (user_id !== req.params.user_id)) return_activity(res, 403);

	Activity.schema.delete({
			'_id': activity_id,
			'user_id': user_id
		}).then(function(deleted) {
			if (deleted) {
				res.statusCode = 200;
			} else {
				res.statusCode = 403;
			}
			res.json(null);
		})
		.fail(function(error) {
			send_status(res, 500);
		});
};


/**
 * Returns the activity as a json object
 * @param object res            (response object of express)
 * @param number status_code    (status code that will be send with the response)
 * @oaram
 * @param string activity_id    (activity id of the activity that will be returned)
 * @param string language       (language code of the translations)
 * @param string date_format    (date format that will be used for the dates of the activity)
 * @param json   error_messages (error messages that will be mapped to the input fields in the ui)
 */
function return_activity(res, status_code, activity_id, user_id, language, date_format, error_messages) {
	if (typeof language === 'undefined') {
		language = 'en';
	}
	if (typeof date_format === 'undefined') {
		date_format = 'd-m-y';
	}
	// If an activity id wasn't supplied
	if (!activity_id) {
		res.statusCode = 400;
		// If there are error messages, send them
		if (typeof error_messages !== 'undefined') {
			res.json({
				'errors': error_messages
			});
		} else {
			res.json(null);
		}
		return;
	}
	var where = {};
	if (typeof user_id === 'undefined') {
		where = {
			$and: [{
				'_id': activity_id
			}, {
				'private': false
			}]
		};
	} else {
		where = {
			$and: [{
				'_id': activity_id
			}, {
				$or: [{
					'user_id': user_id
				}, {
					'private': false
				}]
			}]
		};
	}

	// Find the activity and return it
	Activity.schema.findOne(where, '').then(function(activity) {
			if (activity && Object.keys(activity).length) {
				activity = {
					'_id': activity._id,
					'discipline': activity.discipline,
					'performance': activity.performance,
					'date': activity.date,
					'place': activity.place,
					'location': activity.location,
					'competition': activity.competition,
					'notes': activity.notes,
					'private': activity.private
				};

				// Format the date of the activity
				activity = activityHelper.formatActivity(activity, language, date_format);
			} else {
				status_code = 404;
			}
			res.statusCode = status_code;
			res.json(activity);
		})
		.fail(function(error) {
			send_status(res, 500);
		});
}

/**
 * Returns the activities as an array of json objects
 * @param object res            (response object of express)
 * @param number status_code    (status code that will be send with the response)
 * @param json   where          (the where conditions of the query (usually provides the user id))
 * @param string language       (language code of the translations)
 * @param string date_format    (date format that will be used for the dates of the activity)
 * @param json   error_messages (error messages that will be mapped to the input fields in the ui)
 */
function return_activities(res, status_code, where, language, date_format) {
	Activity.schema.getActivitiesOfUser(where, '', -1).then(function(activities) {
			for (let i in activities) {
				activities[i] = {
					'_id': activities[i]._id,
					'discipline': activities[i].discipline,
					'performance': activities[i].performance,
					'date': activities[i].date,
					'place': activities[i].place,
					'location': activities[i].location,
					'competition': activities[i].competition,
					'private': activities[i].private,
					'notes': activities[i].notes
				};
			}

			// Format the date of the activities
			activities = activityHelper.formatActivities(activities, language, date_format);

			res.statusCode = status_code;
			res.json(activities);
		})
		.fail(function(error) {
			send_status(res, 500);
		});
}

/**
 * Sends an error in case a query fails
 * @param string error
 * @param object res
 */
function send_status(res, status) {
	res.statusCode = status;
	res.json(null);
}
