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
 * Profile - GET
 */
exports.get = function(req, res) {
	var requested_user_id = false,
		user_id = typeof req.session.user_id === 'undefined' ? null : req.session.user_id;

	if (typeof req.params.user_id !== 'undefined') {
		requested_user_id = req.params.user_id;
		mainHelper.validateAccess(user_id, requested_user_id, function(response) {
			// If the user has a valid session and they are not visiting a private profile
			if (response.success) {
				// Send the profile data to the client
				send_profile_data(res, response.profile, response.user);
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
			.then(function(profile_data) {
				language = profile_data.language;
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
				send_error_page(error, res);
			});
	}
}

function generateSearchQuery(user_id, search_query, language) {
	let ands = [];

	if (typeof search_query.keywords === 'string') {
		var requested_keywords_string = search_query.keywords.trim();
		var requested_keywords = requested_keywords_string.split(' ');
		var requested_keywords_length = requested_keywords.length;

		if (!requested_keywords_string) {
			res.json([]);
		}


		for (let i = 0; i < requested_keywords_length; i++) {
			requested_keywords[i] = requested_keywords[i].toLowerCase();
			if (i == requested_keywords_length - 1) {
				ands.push({
					'keywords.names': {
						$regex: new RegExp("^" + requested_keywords[i] + ".*")
					}
				});
			} else {
				ands.push({
					'keywords.names': requested_keywords[i]
				});
			}
		}
	}

	if (typeof search_query.first_name === 'string') {
		ands.push({
			'first_name': search_query.first_name
		});
	}

	if (typeof search_query.last_name === 'string') {
		ands.push({
			'last_name': search_query.last_name
		});
	}

	if (typeof search_query.discipline === 'string') {
		ands.push({
			'discipline': search_query.discipline
		});
	}

	if (typeof search_query.country === 'string') {
		ands.push({
			'country': search_query.country
		});
	}

	if (user_id) {
		// Do not fetch private profiles, unless it's the current user's profile
		ands.push({
			$or: [{
				'_id': user_id
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
	var formatted_results = [];
	for (let i = 0; i < results_length; i++) {
		formatted_results[i] = {};
		formatted_results[i]._id = results[i]._id;
		formatted_results[i].first_name = results[i].first_name;
		formatted_results[i].last_name = results[i].last_name;
		formatted_results[i].discipline = results[i].discipline;
		formatted_results[i].country = results[i].country;
		formatted_results[i].username = results[i].username;
		formatted_results[i].formatted_country = results[i].country ? translations[language][results[i].country] : '';
		formatted_results[i].formatted_discipline = results[i].discipline ? translations[language][results[i].discipline] : '';
	}

	return formatted_results;
}

/**
 * Profile - GET
 */
exports.get_me = function(req, res) {
	if (typeof req.session.user_id !== 'undefined') {
		let profile_id = req.session.user_id,
			user_id = req.session.user_id;
		mainHelper.validateAccess(user_id, profile_id, function(response) {
			// If the user has a valid session and they are not visiting a private profile
			if (response.success) {
				// Send the profile data to the client
				send_profile_data(res, response.profile, response.user);
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
	} else {
		// If the user doesn't have access to the data, or the data don't exist, do not send anything
		send_status(res, 404);
	}

};

/**
 * Sends the profile data as a JSON object
 * @param  object res          (the response object)
 * @param  object profile_data (the data of the profile before they get formatted according the the user's preferences)
 * @param  object user_data    (the object that contains the data of the user who is viewing the profile)
 * @return object              (the profile data as a json object)
 */
function send_profile_data(res, profile_data, user_data) {
	var tr = translations[user_data.language];
	var gender = profile_data.male ? tr['male'] : tr['female'];
	var formatted_discipline = profile_data.discipline ? tr[profile_data.discipline] : '';
	var country = profile_data.country ? tr[profile_data.country] : '';

	var profile = {
		'_id': profile_data._id,
		'first_name': profile_data.first_name,
		'last_name': profile_data.last_name,
		'discipline': profile_data.discipline,
		'formatted_discipline': formatted_discipline,
		'country': country,
		'gender': gender,
		'picture': profile_data.picture,
		'username': profile_data.username
	}

	res.json(profile);
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

exports.get_view = function(req, res) {
	var view_language;

	if (typeof req.session.user_id === 'undefined') {
		view_language = 'en';
		render_profile();
	} else {
		var user_id = req.session.user_id;

		// Get the user and his profile
		Profile.schema.findOne({
				'_id': user_id
			}, 'language date_format').then(function(profile_data) {
				if (profile_data.language) {
					view_language = profile_data.language;
					render_profile();
				} else {
					view_language = 'en';
					render_profile();
				}
			})
			.fail(function(error) {
				send_error_page(error, res);
			});
	}

	function render_profile() {
		let disciplines = [
			'100m',
			'200m',
			'400m',
			'800m',
			'1500m',
			'3000m',
			'60m_hurdles',
			'100m_hurdles',
			'110m_hurdles',
			'400m_hurdles',
			'3000m_steeple',
			'4x100m_relay',
			'4x400m_relay',
			'marathon',
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
			'tr': translations[view_language]
		};

		res.render('profile', view_data);
	}
};

/**
 * Sends an error page in case a query fails
 * @param string error
 * @param object res
 */
function send_error_page(error, res) {
	res.statusCode = 500;
	res.sendfile('./views/five_oh_oh.html');
}
