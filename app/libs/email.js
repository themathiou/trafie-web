'use strict';

const nodemailer = require('nodemailer');

// Create a SMTP transport object
var transport = nodemailer.createTransport("SMTP", {
	//service: 'Gmail', // use well known service.
	// If you are using @gmail.com address, then you don't
	// even have to define the service name
	auth: {
		user: "trafie.app@gmail.com",
		pass: "tr@f!etr@f!e"
	}
});

// Message object
var message = {
	from: 'trafie <trafie.app@gmail.com>',
	/*headers: {
		'X-Laziness-level': 1000
	}*/
};

var email = {
	send_verification_email: function(email, first_name, last_name, hash, host) {
		var message = {};
		message.to = email;
		message.subject = 'Welcome to trafie ✔';
		message.html = '<h2>Hello ' + first_name + ' ' + last_name + '</h2>' +
			'<p>You have successfully registered to trafie.</p><br><p>The <b><i>trafie</i></b> team</p><br>' +
			'Follow the link to verify your email:<br>' +
			'<a href="' + host + '/validate/' + hash + '">This is the link</a>';

		transport.sendMail(message, function(error) {
			if (error) {
				console.log('Error occured while sending email: ' + error);
				return;
			}
		});
	},

	send_reset_password_email: function(email, first_name, last_name, hash, host) {
		var message = {};
		message.to = email;
		message.subject = 'Password reset request';
		message.html = '<h2>Hello ' + first_name + ' ' + last_name + '</h2>' +
			'<p>You have requested to reset the password of your account on trafie.</p><br>' +
			'Follow the link in order to enter a new password:<br>' +
			'<a href="' + host + '/reset_password/' + hash + '">This is the link</a>';

		transport.sendMail(message, function(error) {
			if (error) {
				console.log('Error occured while sending email: ' + error);
				return;
			}
		});
	},

	send_email: function(email_address, email_text, email_subject) {
		var message = {};
		message.to = email_address;
		message.html = email_text;
		message.subject = email_subject || '';

		transport.sendMail(message, function(error) {
			if (error) {
				console.log('Error occured while sending email: ' + error);
				return;
			}
		});
	}
};

module.exports = email;
