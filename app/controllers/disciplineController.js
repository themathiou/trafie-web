'use strict';

// Loading models
const Profile = require('../models/profileModel'),
	Activity = require('../models/activityModel');

// Loading helpers
const accessHelper = require('../helpers/accessHelper');

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
				let where = {
					'userId': profileId
				};
				if (!userId || validation.user._id.toString() !== validation.profile._id.toString()) {
					where.private = false;
				}

				Activity.schema.getDisciplinesPerformedByUser(where)
				.then(function(disciplines) {
					res.status(200).json(disciplines);
				})
				.catch(function(error) {
					res.status(500).json({message: 'Server error'});
				});
			} else {
				res.status(404).json({message: 'Resource not found', errors: [{
					resource: 'discipline',
					code: 'not_found'
				}]});
			}
		});
	} else {
		res.status(404).json({message: 'Resource not found', errors: [{
			resource: 'user',
			code: 'not_found'
		}]});
	}
};
