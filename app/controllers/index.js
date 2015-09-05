'use strict';

var Profile = require('../models/profile.js'),
	Activity = require('../models/activity.js');
// Initialize translations
const translations = require('../languages/translations.js');

exports.getView = function(req, res) {
	if (typeof req.user === 'undefined' && !req.params.profileId) {
		res.redirect('/login');
		// change to /login only for testing purposes
		// res.redirect('/register');
		return false;
	}

	var userId = req.user ? req.user._id : req.params.profileId;
	Profile.schema.findOne({
		_id: userId
	}, '_id firstName language')
	.then(function(response) {
		if (response._id) {
			var data = {
				user: {
					_id: response._id,
					firstName: response.firstName
				},
				tr: translations[response.language]
			}

			res.render('layout', data);
		} else {
			res.sendFile('../app/views/four_oh_four.html',  {"root": __dirname});
		}
	});
};
