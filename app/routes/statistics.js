'use strict';

var Profile = require('../models/profile.js'),
	Activity = require('../models/activity.js');

// Initialize translations
var translations = require('../languages/translations.js');


/**
 * Renders the statistics page
 * @param object  res           (the express response object)
 * @param string  user_id       (the user_id)
 * @param json    profile_data  (data of the profile of the user)
 */
exports.get_view = function(req, res) {
	var user_id = req.session.user_id;

	// If there is a user id in the request (NOT IMPLEMENTED YET)
	if (typeof req.params.user_id !== 'undefined') {
		console.log(req.params.user_id);
	}

	if (!user_id) {
		res.redirect('/register');
	} else {
		Profile.schema.findOne({
				'_id': user_id
			}, 'first_name last_name discipline country male birthday picture language date_format').then(function(profile_data) {
				// If the user was found
				if (typeof profile_data.first_name !== 'undefined') {
					// The data that will go to the front end
					var view_data = {
						'user': {
							'_id': user_id,
							'first_name': profile_data.first_name,
							'discipline': profile_data.discipline
						},
						'tr': translations[profile_data.language]
					};

					res.render('statistics', view_data);
				} else {
					// If the user wasn't found
					res.redirect('/login');
					return false;
				}
			})
			.fail(function(error) {
				send_error_page(error, res);
				return;
			});
	}
}

/**
 * Sends an error page in case a query fails
 * @param string error
 * @param object res
 */
function send_error_page(error, res) {
	res.statusCode = 500;
	res.sendfile('./views/five_oh_oh.html');
}
