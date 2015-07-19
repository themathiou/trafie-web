'use strict';

// Loading models
const Profile = require('../models/profile.js'),
	Activity = require('../models/activity.js');

// Loading helpers
const accessHelper = require('../helpers/accessHelper.js');

// Initialize translations
const translations = require('../languages/translations.js');

/**
 * Disciplines - GET
 */
exports.get = function(req, res) {
	var profileId = req.params.userId,
		userId = typeof req.session.userId !== 'undefined' ? req.session.userId : null;

	if (profileId) {
		accessHelper.validateAccess(userId, profileId, function(validation) {
			// If the user has a valid session and they are not visiting a private profile
			if (validation.success) {
				let user = validation.user;
				let profile = validation.profile;

				let where = {
					'userId': profileId
				};
				if (!userId || validation.user._id.toString() !== validation.profile._id.toString()) {
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
				.catch(function(error) {
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
