'use strict';

// Loading models
const Profile = require('../models/profile.js'),
	Activity = require('../models/activity.js');

// Loading helpers
const mainHelper = require('../helpers/main_helper.js');

// Initialize translations
const translations = require('../languages/translations.js');

/**
 * Disciplines - GET
 */
exports.get = function(req, res) {
	var profile_id = req.params.user_id,
		user_id = typeof req.session.user_id !== 'undefined' ? req.session.user_id : null;

	if (profile_id) {
		mainHelper.validateAccess(user_id, profile_id, function(response) {
			// If the user has a valid session and they are not visiting a private profile
			if (response.success) {
				let user = response.user;
				let profile = response.profile;

				let where = {
					'user_id': profile_id
				};
				if (!user_id || response.user._id.toString() !== response.profile._id.toString()) {
					where.private = false;
				}

				Activity.schema.getDisciplinesPerformedByUser(where)
					.then(function(disciplines) {
						let response = [];
						let disciplines_length = disciplines.length;
						let tr = translations[user.language];

						for (var i = 0; i < disciplines_length; i++) {
							response[i] = {
								'discipline': disciplines[i],
								'formatted_discipline': tr[disciplines[i]]
							};
						}

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
