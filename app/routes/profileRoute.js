'use strict';

// Loading models
var Profile = require('../models/profile.js'),
	Activity = require('../models/activity.js');
// Loading helpers
var accessHelper = require('../helpers/accessHelper.js');
// Get the config file
const config = require('../config/config.js');
const SEARCH_RESULTS_LENGTH = 10;

/**
 * Profile - GET
 */
exports.get = function(req, res) {
	var requestedUserId = false;

	if (typeof req.params.userId !== 'undefined') {
		requestedUserId = req.params.userId;
		accessHelper.validateAccess(req.user, requestedUserId)
		.then(function(response) {
			// If the user has a valid session and they are not visiting a private profile
			if (response.success) {
				// Send the profile data to the client
				sendProfileData(res, response.profile, response.user);
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
	} else {
		userSearch(req, res);
	}
};

function userSearch(req, res) {
	let query = generateSearchQuery(userId, req.query);
	Profile.schema.find(query, 'firstName lastName discipline country username _id', SEARCH_RESULTS_LENGTH)
	.then(function(results) {
		res.json(results);
	})
	.catch(function(error) {
		res.status(500).json(null);
	});
}

function generateSearchQuery(userId, searchQuery) {
	let ands = [];

	if (typeof searchQuery.keywords === 'string') {
		let requestedKeywordsString = searchQuery.keywords.trim(),
			requestedKeywords = requestedKeywordsString.split(' '),
			requestedKeywordsLength = requestedKeywords.length;
		if (!requestedKeywordsString) {
			res.json([]);
		}

		requestedKeywords.forEach(function(requestedKeyword, i) {
			requestedKeyword = requestedKeyword.toLowerCase();
			if (i == requestedKeywordsLength - 1) {
				ands.push({
					'keywords.names': {
						$regex: new RegExp("^" + requestedKeyword + ".*")
					}
				});
			} else {
				ands.push({
					'keywords.names': requestedKeyword
				});
			}
		});
	}

	if (typeof searchQuery.firstName === 'string') {
		ands.push({
			'firstName': searchQuery.firstName
		});
	}

	if (typeof searchQuery.lastName === 'string') {
		ands.push({
			'lastName': searchQuery.lastName
		});
	}

	if (typeof searchQuery.discipline === 'string') {
		ands.push({
			'discipline': searchQuery.discipline
		});
	}

	if (typeof searchQuery.country === 'string') {
		ands.push({
			'country': searchQuery.country
		});
	}

	if (userId) {
		// Do not fetch private profiles, unless it's the current user's profile
		ands.push({
			$or: [{
				'_id': userId
			}, {
				'private': false
			}]
		});
	} else {
		// Do not fetch private profiles
		ands.push({
			'private': false
		});
	}

	var query = {};
	if (ands.length) {
		query.$and = ands;
	}

	return query;
}

/**
 * Sends the profile data as a JSON object
 * @param  object res          (the response object)
 * @param  object profileData  (the data of the profile before they get formatted according the the user's preferences)
 * @param  object userData     (the object that contains the data of the user who is viewing the profile)
 * @return object              (the profile data as a json object)
 */
function sendProfileData(res, profileData, userData) {
	var profile = {
		_id: 					profileData._id,
		firstName: 				profileData.firstName,
		lastName: 				profileData.lastName,
		discipline: 			profileData.discipline,
		gender: 				profileData.male,
		picture: 				profileData.picture || config.defaultProfilePic,
		username: 				profileData.username,
		about:                  profileData.about
	};

	res.json(profile);
}