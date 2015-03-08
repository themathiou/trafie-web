'use strict';

// Loading models
const Profile = require('../models/profile.js'),
	Activity = require('../models/activity.js');

// Loading helpers
const mainHelper = require('../helpers/mainHelper.js');

// Initialize translations
const translations = require('../languages/translations.js');

/**
 * Disciplines - GET
 */
exports.get = function(req, res) {
	var profile_id = req.params.user_id,
		user_id = typeof req.session.user_id !== 'undefined' ? req.session.user_id : null;

	if (profile_id) {
		mainHelper.validateAccess(user_id, profile_id, function(validation) {
			// If the user has a valid session and they are not visiting a private profile
			if (validation.success) {
				let user = validation.user;
				let profile = validation.profile;

				let where = {
					'user_id': profile_id
				};
				if (!user_id || validation.user._id.toString() !== validation.profile._id.toString()) {
					where.private = false;
				}

				Activity.schema.getDisciplinesPerformedByUser(where)
				.then(function(disciplines) {
					let response = [];
					let tr = translations[user.language];
					disciplines.forEach(function(discipline) {
						response.push({
							'discipline': 			discipline,
							'formatted_discipline': tr[discipline]
						});
					});

					res.status(200).json(response);
				})
				.fail(function(error) {
					res.status(500).json(null);
				});
			} else {
				res.status(404).json(null);
			}
		});
	} else {
		res.status(404).json(null);
	}
};
