'use strict';

const Profile = require('../models/profile.js'),
	User = require('../models/user.js');
const Email = require('../libs/email');

/**
 * Feedback - POST
 */
exports.post = function(req, res) {
	if (typeof req.body.feedback_text !== 'undefined') {

		let user_data_text = '';
		let users_name = '';
		if (typeof req.session.user_id !== 'undefined') {
			User.schema.findOne({
					'_id': req.session.user_id
				}, 'email').then(function(user) {
					user_data_text = '<b>Email</b>: ' + user.email + '<br>';
					return Profile.schema.findOne({
						'_id': req.session.user_id
					}, '_id first_name last_name discipline country language birthday');
				})
				.then(function(profile) {
					user_data_text += '<b>Name</b>: ' + profile.first_name + ' ' + profile.last_name + '<br>' +
						'<b>Country</b>: ' + profile.country + '<br>' +
						'<b>Language</b>: ' + profile.language + '<br>' +
						'<b>Birtday</b>: ' + profile.birthday.day + '/' + profile.birthday.month + '/' + profile.birthday.year + '<br>' +
						'<b>Main discipline</b>: ' + profile.discipline + '<br>' +
						'<b>User id</b>: ' + profile._id + '<br>';

					users_name = profile.first_name + ' ' + profile.last_name;
					send_email();
				});
		} else {
			send_email();
		}

		function send_email() {
			let email_subject = 'Trafie feedback! Time to improve!';

			let closings = ['Screw them! You are the best anyway! :-)',
				'Say "thank you" and keep doing a good work! ;-)',
				'Stay calm and code on! ;-)',
				'But you already knew that, didn\'t you? :-)',
				'Let that feedback be the epilogue to the masterpiece! ;-)'
			];

			let openings = ['That is what that someone said:',
				'Here be dragons!',
				'Here\'s some random bullshit:',
				'Try to benefit from that shit:',
				'Take their words into account:',
				'Try not to laugh:',
				'I already read it. The movie was better:'
			];

			if (!users_name) {
				let quoters = ['Unknown', 'A wise individual', 'A soon-to-be world champion', 'A tech-savvy athlete', 'A kind soul'];
				users_name = quoters[~~(Math.random() * quoters.length)];
			}

			let email_text = '<h2>Hello devs!</h2>' +
				'<p>Good news! Someone submitted constructive feedback! ' + openings[~~(Math.random() * openings.length)] + '</p><br>' +
				'<p>"' + req.body.feedback_text + '"</p><br>' +
				'<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>- ' + users_name + '</i></p><br><br>' +
				'<b>User\'s user agent</b>: ' + req.headers['user-agent'] + '<br>' +
				'<b>Feedback submitted on</b>: ' + new Date() + '<br>' +
				user_data_text +
				'<br><br>' +
				closings[~~(Math.random() * closings.length)];


			let recipients = ['geobal87@yahoo.gr', 'tmathioudakis@gmail.com', 'trafie.app@gmail.com'];
			Email.send_email(recipients, email_text, email_subject);

			res.status(200).json({
				'success': true
			});
		}
	} else {
		res.status(500).json({
			'success': false
		});
	}
};
