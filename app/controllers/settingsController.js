'use strict';

const fs = require('fs'),
	knox = require('knox'),
	path = require('path'),
	root_dir = path.dirname(require.main.filename);

// Loading models
const User = require('../models/user.js'),
	Profile = require('../models/profile.js');

// Loading helpers
const profileHelper = require('../helpers/profileHelper.js');

// Get the config file
const config = require('../config/config.js');

exports.get = function(req, res) {
	// Get the user id from the session
	var userId = req.user && req.user._id.toString();
	
	// If there is no user id in the session, return null
	if (!userId) {
		res.status(401).json(null);
		return false;
	}

	var firstName, lastName,
		update = '',
		error_messages = '';

	// Else, fetch the first name and the last name of the user from the database
	Profile.schema.findOne({
		'_id': userId
	}, 'firstName lastName discipline about male country birthday picture language dateFormat username private')
	.then(function(profile) {
		// If the user was not found, return null
		if (typeof profile.firstName === 'undefined') {
			res.json(null);
			return false;
		}

		// Format the data that will go to the front end
		var gender = '';
		if (profile.male === true) {
			gender = 'male';
		} else if (profile.male === false) {
			gender = 'female';
		} else {
			gender = 'no_gender_selected';
		}
		var picture = profile.picture || config.defaultProfilePic;

		var data = {
			'user': {
				'_id': userId,
				'firstName': profile.firstName,
				'lastName': profile.lastName,
				'discipline': profile.discipline,
				'about': profile.about,
				'gender': gender,
				'country': profile.country,
				'birthday': profile.birthday,
				'picture': picture,
				'language': profile.language,
				'dateFormat': profile.dateFormat,
				'username': profile.username,
				'private': profile.private
			}
		};

		res.json(data);
	})
	.catch(function(error) {
		res.status(500).json(null);
	});
};


exports.post = function(req, res) {
	// Get the user id from the session
	var userId = req.user && req.user._id.toString();

	// If there is no user id in the session, redirect to register screen
	if (!userId) {
		res.status(401).json(null);
		return false;
	}

	// Check if the profile really exists
	Profile.schema.findOne({
			'_id': userId
		}, '_id')
		.then(function(profile) {
			// If the profile doesn't exist, return null
			if (typeof profile._id === 'undefined') {
				res.status(404).json(null);
				return false;
			}

			var error_messages = {},
				update = '',
				profile_data = {},
				user_data = {},
				response = {
					value: '',
					message: '',
					error: ''
				};

			// Validating first name
			if (typeof req.body.firstName !== 'undefined') {
				if (profileHelper.validateName(req.body.firstName)) {
					profile_data.firstName = req.body.firstName;
					response.value = req.body.firstName;
				} else {
					response.error = 'invalid_first_name';
				}
			}

			// Validating last name
			if (typeof req.body.lastName !== 'undefined') {
				if (profileHelper.validateName(req.body.lastName)) {
					profile_data.lastName = req.body.lastName;
					response.value = req.body.lastName;
				} else {
					response.error = 'invalid_last_name';
				}
			}

			// Validating birthday
			if (typeof req.body.birthday !== 'undefined') {
				var birthday = profileHelper.validateBirthday(req.body.birthday);
				if (birthday) {
					profile_data.birthday = birthday;
					response.value = profile_data.birthday;
				} else {
					response.error = 'invalid_birthday';
				}
			}

			// Validating gender
			if (typeof req.body.gender !== 'undefined') {
				if (profileHelper.validateGender(req.body.gender)) {
					profile_data.male = req.body.gender == 'male';
					response.value = req.body.gender;
				} else {
					response.error = 'invalid_gender';
				}
			}

			// Validating country
			if (typeof req.body.country !== 'undefined') {
				if (profileHelper.validateCountry(req.body.country)) {
					profile_data.country = req.body.country;
					response.value = req.body.country;
				} else {
					response.error = 'invalid_country';
				}
			}

			// Validating discipline
			if (typeof req.body.discipline !== 'undefined') {
				if (profileHelper.validateDiscipline(req.body.discipline)) {
					profile_data.discipline = req.body.discipline;
					response.value = req.body.discipline;
				} else {
					response.error = 'invalid_discipline';
				}
			}

			// Validating the about me text
			if (typeof req.body.about !== 'undefined') {
				if (profileHelper.validateAbout(req.body.about)) {
					profile_data.about = req.body.about;
					response.value = req.body.about;
				} else {
					response.error = 'too_long_text';
				}
			}

			// Validating language
			if (typeof req.body.language !== 'undefined') {
				if (profileHelper.validateLanguage(req.body.language)) {
					profile_data.language = req.body.language;
					response.value = req.body.language;
				} else {
					response.error = 'invalid_language';
				}
			}

			// Validating date format
			if (typeof req.body.dateFormat !== 'undefined') {
				if (profileHelper.validateDateFormat(req.body.dateFormat)) {
					profile_data.dateFormat = req.body.dateFormat;
					response.value = req.body.dateFormat;
				} else {
					response.error = 'wrong_date_format';
				}
			}

			// Validating privacy
			if (typeof req.body.private !== 'undefined') {
				if (typeof req.body.private === 'boolean') {
					response.success = true;
					profile_data.private = req.body.private;
					response.value = req.body.private;
				} else {
					response.error = 'invalid_privacy';
				}
			}

			// Validating username
			if (typeof req.body.username !== 'undefined') {
				if (!profileHelper.validateUsername(req.body.username)) {
					response.error = 'invalid_username';
					res.status(400).json(response);
				} else {
					var username = req.body.username.toLowerCase();
					Profile.schema.findOne({
							'username': username
						}, '_id')
						.then(function(profile) {
							if (profile == null) {
								profile_data.username = username;
								response.value = username;
								Profile.update({
										'_id': userId
									}, {
										$set: profile_data
									}, {
										upsert: true
									}, function(error) {
										if(!error) {
											response.message = 'data_updated_successfully';
											res.status(200).json(response);
										}
										return;
									})
									.catch(function(error) {
										response.error = 'something_went_wrong';
										res.status(500).json(response);
										return;
									});
							} else {
								if (profile._id !== userId) {
									response.error = 'username_taken';
								}
								response.value = username;
								res.status(422).json(response);
							}
						});
				}
			}

			// Checking if the uploaded file is a valid image file
			else if (typeof req.files !== 'undefined' && typeof req.files.profile_pic !== 'undefined') {
				// Read the image file
				fs.readFile(req.files.profile_pic.path, function(err, data) {
					// Get the file extension
					var pic = req.files.profile_pic;
					var extension = pic.name.substring(pic.name.lastIndexOf('.')+1);

					var accepted_file_types = ['image/jpeg', 'image/png'];
					// File size in MB
					var accepted_file_size = 5;

					var accepted_size = false;
					var accepted_type = false;

					// If the file size is acceptable
					if (pic.size > accepted_file_size * 1048576) {
						response.error = 'uploaded_image_too_large';
					} else {
						accepted_size = true;
					}

					// If the file type is acceptable
					if (accepted_file_types.indexOf(pic.type) < 0) {
						response.error = 'uploaded_image_wrong_type';
					} else {
						accepted_type = true;
					}

					if (accepted_type && accepted_size) {
						var s3 = knox.createClient({
						    key: 'AKIAIQBX4EEBSV6QVPRA', //process.env.AWS_ACCESS_KEY_ID,
						    secret: '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', //process.env.AWS_SECRET_ACCESS_KEY,
						    bucket: 'trafie' //process.env.S3_BUCKET_NAME
						});

					    var s3Headers = {
					      'Content-Type': pic.type,
					      'x-amz-acl': 'public-read'
					    };

					    s3.putFile(pic.path, userId + '.' + extension, s3Headers, function(err, s3response){
							if (err) throw err;
							// Update the database
							profile_data.picture = s3response.req.url;
							Profile.update({
								'_id': userId
							}, {
								$set: profile_data
							}, {
								upsert: true
							}, function(error) {
								if(!error) {
									response.message = 'data_updated_successfully';
									response.value = s3response.req.url;
									console.log(response);
									res.status(200).json(response);
								} else {
									response.error = 'something_went_wrong';
									res.status(500).json(response);
								}
							});
						});
					} else {
						res.status(400).json(response);
					}

				});
			}

			// Validating the change password request
			else if (typeof req.body.old_password !== 'undefined' && typeof req.body.password !== 'undefined' && req.body.repeat_password) {
				// Find the old password of the user
				User.schema.findOne({
						'_id': userId
					}, 'password')
					.then(function(user) {
						if (typeof user.password === 'undefined') {
							response.error = 'wrong_old_password';
							res.status(400).json(response);
						} else {
							// Generating errors
							if (req.body.password !== req.body.repeat_password) {
								response.error = 'passwords_do_not_match';
							}
							if (user.password !== userHelper.encryptPassword(req.body.old_password)) {
								response.error = 'wrong_old_password';
							}
							if (!userHelper.validatePassword(req.body.password)) {
								response.error = 'password_should_be_at_least_6_characters_long';
							}
							if (!response.error) {
								// If there are no errors, the password gets reset
								User.schema.resetPassword(userId, req.body.password)
									.then(function() {
										response.message = 'data_updated_successfully';
										res.status(200).json(response);
									})
									.catch(function(error) {
										response.error = 'something_went_wrong';
										res.status(500).json(response);
									});
							} else {
								res.json(response);
							}
						}
					});
			} else {
				// Else, fetch the first name and the last name of the user from the database
				if (!response.error) {
					Profile.schema.update({
							'_id': userId
						}, profile_data)
						.then(function(profile) {
							response.message = 'data_updated_successfully';
							res.json(response);
						})
						.catch(function(error) {
							response.error = 'something_went_wrong';
							res.status(500).json(response);
						});
					// If there are errors, do not update the profile
				} else {
					res.status(400).json(response);
				}
			}
		});
};


/**
 * Returns the html of the settings page
 * @param  {object} req
 * @param  {object} res
 */
exports.get_view = function(req, res) {
	// If there is no user id in the session, redirect to register screen
	if (typeof req.session.userId === 'undefined') {
		res.send('');
		return false;
	}

	var userId = req.session.userId;

	// Check if the profile really exists
	Profile.schema.findOne({
			'_id': userId
		}, 'language')
		.then(function(profile) {

			var tr = translations[profile.language];
			var countries = ['AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BQ', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UM', 'UY', 'UZ', 'VU', 'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW'];
			var languages = {
				'en': 'English',
				'el': 'Ελληνικά',
				'ru': 'Русский'
			};

			var view_data = {
				'disciplines': config.disciplines,
				'languages': languages,
				'countries': countries,
				'tr': translations[profile.language],
				'section': 'settings'
			};

			res.render('settings', view_data);
		})
		.catch(function(error) {
			res.send('');
		});
};
