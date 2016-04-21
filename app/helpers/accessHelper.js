'use strict';

// Loading models
var Profile = require('../models/profileModel'),
	q = require('q'),
	sessions = require('../config/sessionsConfig');

var accessHelper = {};

/**
 * Checks if the user has access to the requested data
 * @param  String	  userId
 * @param  String     profileId
 */
accessHelper.validateAccess = function(user, profileId) {
	var defer = q.defer();
	var response = {
			success: false,
			user: {},
			profile: {},
			error: ''
		},
		userData = false,
		userId =  user && user._id || null;

	if (userId) {
		Profile.schema.findOne({
			'_id': userId
		}, '_id language dateFormat').then(function(userDataResponse) {
			// If the user wasn't found, there's no point to continue
			if (!userDataResponse) {
				response.error = 'user_not_valid';
				defer.resolve(response);
			}

			response.user = userDataResponse;
			userData = userDataResponse;

			// If the user didn't request profile specific data (E.g. he requested settings)
			if (typeof profileId === 'undefined') {
				// Just return the user
				response.success = true;
				defer.resolve(response);
			} else {
				accessProfile();
			}
		})
		.catch(function(error) {
			response.error = 'query_error';
			defer.resolve(response);
		});
	} else {
		// A user who is not logged in tries to access a profile
		response.user = {
			language: 'en',
			dateFormat: 'd-m-y'
		};
		accessProfile();
	}

	function accessProfile() {
		// If there is no profile id, return an error
		if (typeof profileId === 'undefined' || !profileId) {
			// Just return the user
			response.error = 'profile_not_valid';
			defer.resolve(response);
			return;
		}

		var selectQuery = '_id firstName lastName discipline country isMale picture username isPrivate about birthday usernameChangesCount';
		// Find the profile by id
		Profile.schema.findOne({
			'_id': profileId
		}, selectQuery)
		.then(function(profileData) {
			// If the profile was found, get the data of the user
			if (profileData !== null && profileData !== undefined) {
				// Check if the profile found is private
				handlePrivacy(profileData);
				return 0;
			} else {
				// If the profile wasn't found, try to find it by username
				return Profile.schema.findOne({
					'username': profileId
				}, selectQuery);
			}
		})
		.then(function(profileData) {
			if (profileData !== 0) {
				// If the profile was found, get the data of the user
				if (profileData !== null && profileData !== undefined) {
					// Check if the profile found is private
					handlePrivacy(profileData);
				} else {
					// If the profile wasn't found
					response.error = 'profile_not_valid';
					defer.resolve(response);
					return;
				}
			}
		})
		.catch(function(error) {
			response.error = 'query_error';
			defer.resolve(response);
		});
	}

	function handlePrivacy(profileData) {
		// If the profile requested is a private profile and the user who tries to access it
		// is not the user who owns it
		if (profileData.isPrivate && (!userData || profileData._id.toString() !== userData._id.toString())) {
			// Deny access
			response.error = 'profile_not_valid';
			defer.resolve(response);
		} else {
			// Return the profile data along with the data of the user who requested it
			response.profile = profileData;
			response.success = true;
			defer.resolve(response);
		}
	}

	return defer.promise;
};

module.exports = accessHelper;