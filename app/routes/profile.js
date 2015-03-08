'use strict';

// Loading models
const Profile = require('../models/profile.js'),
	Activity = require('../models/activity.js');

// Loading helpers
const mainHelper = require('../helpers/mainHelper.js'),
	activityHelper = require('../helpers/activityHelper.js');

// Initialize translations
const translations = require('../languages/translations.js');

// Get the config file
const config = require('../config/config.js');

/**
 * Profile - GET
 */
exports.get = function(req, res) {
	var requestedUserId = false,
		userId = typeof req.session.user_id === 'undefined' ? null : req.session.user_id;

	if (typeof req.params.user_id !== 'undefined') {
		requestedUserId = req.params.user_id;
		mainHelper.validateAccess(userId, requestedUserId, function(response) {
			// If the user has a valid session and they are not visiting a private profile
			if (response.success) {
				// Send the profile data to the client
				sendProfileData(res, response.profile, response.user);
			} else {
				// Otherwise, if it's a server error, send the error
				if (response.error === 'query_error') {
					sendStatus(res, 500);
				} else {
					// If the user doesn't have access to the data, or the data don't exist, do not send anything
					sendStatus(res, 404);
				}
			}
		});
	} else {
		userSearch(req, res);
	}

};

function userSearch(req, res) {
	const NUMBER_OF_SEARCH_RESULTS = 10;
	var language = 'en';
	var user_id = typeof req.session.user_id !== 'undefined' ? req.session.user_id : '';

	if (user_id) {
		// Find the profile
		Profile.schema.findOne({
			'_id': user_id
		}, 'language date_format')
		.then(function(profileData) {
			language = profileData.language;
			performSearch();
		});
	} else {
		performSearch();
	}

	function performSearch() {
		let query = generateSearchQuery(user_id, req.query, language);
		Profile.schema.find(query, 'first_name last_name discipline country username _id', NUMBER_OF_SEARCH_RESULTS)
		.then(function(results) {
			let formattedResults = formatResults(results, language);
			res.json(formattedResults);
		})
		.fail(function(error) {
			sendErrorPage(error, res);
		});
	}
}

function generateSearchQuery(userId, searchQuery, language) {
	let ands = [];

	if (typeof searchQuery.keywords === 'string') {
		var requestedKeywordsString = searchQuery.keywords.trim();
		var requestedKeywords = requestedKeywordsString.split(' ');
		var requestedKeywordsLength = requestedKeywords.length;
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

	if (typeof searchQuery.first_name === 'string') {
		ands.push({
			'first_name': searchQuery.first_name
		});
	}

	if (typeof searchQuery.last_name === 'string') {
		ands.push({
			'last_name': searchQuery.last_name
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

function formatResults(results, language) {
	var results_length = results.length;
	var formattedResults = [];
	results.forEach(function(result, index) {
		formattedResults.push({
			_id: result._id,
			first_name: result.first_name,
			last_name: result.last_name,
			discipline: result.discipline,
			country: result.country,
			username: result.username,
			formatted_country: result.country ? translations[language][result.country] : '',
			formatted_discipline: result.discipline ? translations[language][result.discipline] : ''
		});
	});

	return formattedResults;
}

/**
 * Profile - GET
 */
exports.get_me = function(req, res) {
	if (typeof req.session.user_id !== 'undefined') {
		let profileId = req.session.user_id,
			userId = req.session.user_id;
		mainHelper.validateAccess(userId, profileId, function(response) {
			// If the user has a valid session and they are not visiting a private profile
			if (response.success) {
				// Send the profile data to the client
				sendProfileData(res, response.profile, response.user);
			} else {
				// Otherwise, if it's a server error, send the error
				if (response.error === 'query_error') {
					sendStatus(res, 500);
				} else {
					// If the user doesn't have access to the data, or the data don't exist, do not send anything
					sendStatus(res, 404);
				}
			}
		});
	} else {
		// If the user doesn't have access to the data, or the data don't exist, do not send anything
		sendStatus(res, 404);
	}
};

/**
 * Sends the profile data as a JSON object
 * @param  object res          (the response object)
 * @param  object profileData (the data of the profile before they get formatted according the the user's preferences)
 * @param  object user_data    (the object that contains the data of the user who is viewing the profile)
 * @return object              (the profile data as a json object)
 */
function sendProfileData(res, profileData, user_data) {
	var tr = translations[user_data.language];

	var profile = {
		_id: 					profileData._id,
		first_name: 			profileData.first_name,
		last_name: 				profileData.last_name,
		discipline: 			profileData.discipline,
		formatted_discipline: 	tr[profileData.discipline] || '',
		country: 				tr[profileData.country] || '',
		gender: 				profileData.male ? tr['male'] : tr['female'],
		picture: 				profileData.picture || config.defaultProfilePic,
		username: 				profileData.username
	};

	res.json(profile);
}

/**
 * Sends an error in case a query fails
 * @param string error
 * @param object res
 */
function sendStatus(res, status) {
	res.statusCode = status;
	res.json(null);
}

exports.get_view = function(req, res) {
	var viewLanguage;

	if (typeof req.session.user_id === 'undefined') {
		viewLanguage = 'en';
		renderProfile();
	} else {
		var userId = req.session.user_id;

		// Get the user and his profile
		Profile.schema.findOne({
				'_id': userId
			}, 'language date_format').then(function(profileData) {
				if (profileData.language) {
					viewLanguage = profileData.language;
					renderProfile();
				} else {
					viewLanguage = 'en';
					renderProfile();
				}
			})
			.fail(function(error) {
				sendErrorPage(error, res);
			});
	}

	function renderProfile() {
		let disciplines = [
			'60m',
			'100m',
			'200m',
			'400m',
			'800m',
			'1500m',
			'3000m',
			'5000m',
			'10000m',
			'60m_hurdles',
			'100m_hurdles',
			'110m_hurdles',
			'400m_hurdles',
			'3000m_steeplechase',
			'4x100m_relay',
			'4x400m_relay',
			'half_marathon',
			'marathon',
			'20km_race_walk',
			'50km_race_walk',
			'cross_country_running',
			'high_jump',
			'long_jump',
			'triple_jump',
			'pole_vault',
			'shot_put',
			'discus',
			'hammer',
			'javelin',
			'pentathlon',
			'heptathlon',
			'decathlon'
		];

		// The data that will go to the front end
		let view_data = {
			'disciplines': disciplines,
			'tr': translations[viewLanguage]
		};

		res.render('profile', view_data);
	}
};

/**
 * Sends an error page in case a query fails
 * @param string error
 * @param object res
 */
function sendErrorPage(error, res) {
	res.statusCode = 500;
	res.sendfile('./views/five_oh_oh.html');
}
