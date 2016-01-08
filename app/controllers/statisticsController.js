'use strict';

var Profile = require('../models/profile.js'),
	Activity = require('../models/activity.js');


/**
 * Renders the statistics page
 * @param object  res           (the express response object)
 * @param string  userId       (the userId)
 * @param json    profile_data  (data of the profile of the user)
 */
exports.get_view = function(req, res) {
	var userId = req.session.userId;

	// If there is a user id in the request (NOT IMPLEMENTED YET)
	if (typeof req.params.userId !== 'undefined') {
		console.log(req.params.userId);
	}

	if (!userId) {
		res.redirect('/login');
		// change to /login only for testing purposes
		// res.redirect('/register');
	} else {
		Profile.schema.findOne({
			'_id': userId
		}, 'firstName lastName discipline country male birthday picture language dateFormat').then(function(profile_data) {
			// If the user was found
			if (typeof profile_data.firstName !== 'undefined') {
				// The data that will go to the front end
				var view_data = {
					'user': {
						'_id': userId,
						'firstName': profile_data.firstName,
						'discipline': profile_data.discipline
					}
				};

				res.render('statistics', view_data);
			} else {
				// If the user wasn't found
				res.redirect('/login');
				return false;
			}
		})
		.catch(function(error) {
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
	res.sendFile('../views/five_oh_oh.html', {"root": __dirname});
}
