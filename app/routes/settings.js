'use strict';

var fs = require('fs'),
	path = require('path'),
	root_dir = path.dirname(require.main.filename);

// Loading models
var User = require('../models/user.js'),
	Profile = require('../models/profile.js');

// Loading helpers
var profileHelper = require('../helpers/profile.js'),
	userHelper = require('../helpers/user.js');

// Initialize translations
var translations = require('../languages/translations.js');


exports.get = function(req, res) {
	// If there is no user id in the session, return null
	if (typeof req.session.user_id === 'undefined') {
		res.status(401).json(null);
		return false;
	}

	var first_name, last_name,
		user_id = req.session.user_id,
		update = '',
		error_messages = '';

	// Else, fetch the first name and the last name of the user from the database
	Profile.schema.findOne({
			'_id': user_id
		}, 'first_name last_name discipline about male country birthday picture language date_format username private')
		.then(function(profile) {
			// If the user was not found, return null
			if (typeof profile.first_name === 'undefined') {
				res.json(null);
				return false;
			}

			var tr = translations[profile.language];

			// Format the data that will go to the front end
			var gender = '';
			if (profile.male === true) {
				gender = 'male';
			} else if (profile.male === false) {
				gender = 'female';
			} else {
				gender = 'no_gender_selected';
			}

			var picture = profile.picture ? profile.picture : (profile.male ? '/images/profile_pics/default_male.png' : '/images/profile_pics/default_female.png');

			var data = {
				'user': {
					'_id': user_id,
					'first_name': profile.first_name,
					'last_name': profile.last_name,
					'discipline': profile.discipline,
					'discipline_formatted': tr[profile.discipline],
					'about': profile.about,
					'gender': gender,
					'gender_formatted': tr[gender],
					'country': profile.country,
					'country_formatted': tr[profile.country],
					'birthday': profile.birthday,
					'picture': picture,
					'language': profile.language,
					'language_formatted': tr['this_language'],
					'date_format': profile.date_format,
					'username': profile.username,
					'private': profile.private
				}
			};

			res.json(data);
		})
		.fail(function(error) {
			res.status(500).json(null);
		});
};


exports.post = function(req, res) {
	// If there is no user id in the session, redirect to register screen
	if (typeof req.session.user_id === 'undefined') {
		res.status(401).json(null);
		return false;
	}

	var user_id = req.session.user_id;

	// Check if the profile really exists
	Profile.schema.findOne({
			'_id': user_id
		}, 'first_name language')
		.then(function(profile) {
			// If the profile doesn't exist, return null
			if (typeof profile.first_name === 'undefined') {
				res.status(404).json(null);
				return false;
			}

			var error_messages = {},
				update = '',
				profile_data = {},
				user_data = {},
				tr = translations[profile.language],
				response = {
					'value': '',
					'translated_value': '',
					'message': ''
				};

			// Validating first name
			if (typeof req.body.first_name !== 'undefined') {
				if (profileHelper.validateName(req.body.first_name)) {
					profile_data.first_name = req.body.first_name;
					response.value = req.body.first_name;
				} else {
					response.message = tr['invalid_first_name'];
					response.error = 'Invalid first name';
				}
			}

			// Validating last name
			if (typeof req.body.last_name !== 'undefined') {
				if (profileHelper.validateName(req.body.last_name)) {
					profile_data.last_name = req.body.last_name;
					response.value = req.body.last_name;
				} else {
					response.message = tr['invalid_last_name'];
					response.error = 'Invalid last name';
				}
			}

			// Validating birthday
			if (typeof req.body.birthday !== 'undefined') {
				var birthday = profileHelper.validateBirthday(req.body.birthday);
				if (birthday) {
					profile_data.birthday = birthday;
					response.value = profile_data.birthday;
				} else {
					response.message = tr['invalid_birthday'];
					response.error = 'Invalid birthday value';
				}
			}

			// Validating gender
			if (typeof req.body.gender !== 'undefined') {
				if (profileHelper.validateGender(req.body.gender)) {
					profile_data.male = req.body.gender == 'male';
					response.value = req.body.gender;
					response.translated_value = tr[req.body.gender];
				} else {
					response.message = tr['invalid_gender'];
					response.error = 'Invalid gender value';
				}
			}

			// Validating country
			if (typeof req.body.country !== 'undefined') {
				if (profileHelper.validateCountry(req.body.country)) {
					profile_data.country = req.body.country;
					response.value = req.body.country;
					response.translated_value = tr[req.body.country];
				} else {
					response.message = tr['invalid_country'];
					response.error = 'Invalid country';
				}
			}

			// Validating discipline
			if (typeof req.body.discipline !== 'undefined') {
				if (profileHelper.validateDiscipline(req.body.discipline)) {
					profile_data.discipline = req.body.discipline;
					response.value = req.body.discipline;
					response.translated_value = tr[req.body.discipline];
				} else {
					response.message = tr['invalid_discipline'];
					response.error = 'Invalid discipline';
				}
			}

			// Validating the about me text
			if (typeof req.body.about !== 'undefined') {
				if (profileHelper.validateAbout(req.body.about)) {
					profile_data.about = req.body.about;
					response.value = req.body.about;
					response.translated_value = tr[req.body.about];
				} else {
					response.message = tr['too_long_text'];
					response.error = 'Invalid about me value';
				}
			}

			// Validating language
			if (typeof req.body.language !== 'undefined') {
				if (profileHelper.validateLanguage(req.body.language)) {
					profile_data.language = req.body.language;
					response.value = req.body.language;
					response.translated_value = translations['languages'][req.body.language];
				} else {
					response.message = tr['invalid_language'];
					response.error = 'Invalid language';
				}
			}

			// Validating date format
			if (typeof req.body.date_format !== 'undefined') {
				if (profileHelper.validateDateFormat(req.body.date_format)) {
					profile_data.date_format = req.body.date_format;
					response.value = req.body.date_format;
					response.translated_value = tr[req.body.date_format];
				} else {
					response.message = tr['wrong_date_format'];
					response.error = 'Invalid date format';
				}
			}

			// Validating privacy
			if (typeof req.body.private !== 'undefined') {
				if (typeof req.body.private === 'boolean') {
					response.success = true;
					profile_data.private = req.body.private;
					response.value = req.body.private;
				} else {
					response.message = tr['invalid_privacy'];
					response.error = 'Invalid privacy value';
				}
			}

			// Validating username
			if (typeof req.body.username !== 'undefined') {
				if (!profileHelper.validateUsername(req.body.username)) {
					response.message = tr['invalid_username'];
					response.error = 'Invalid username';
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
										'_id': user_id
									}, {
										$set: profile_data
									}, {
										upsert: true
									}, function(error) {
										if(!error) {
											response.message = tr['data_updated_successfully'];
											res.status(200).json(response);
										}
										return;
									})
									.fail(function(error) {
										response.error = error;
										response.message = tr['something_went_wrong'];
										res.status(500).json(response);
										return;
									});
							} else {
								if (profile._id !== user_id) {
									response.message = tr['username_taken'];
									response.error = 'Username is used by another user';
								}
								response.value = username;
								console.log(response);
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
					var extension = req.files.profile_pic.name.split('.')[1];

					var accepted_file_types = ['image/jpeg', 'image/png'];
					// File size in MB
					var accepted_file_size = 5;

					var accepted_size = false;
					var accepted_type = false;

					// If the file size is acceptable
					if (req.files.profile_pic.size > accepted_file_size * 1048576) {
						response.message = tr['uploaded_image_too_large'];
						response.error = 'Uploaded image is too large';
					} else {
						accepted_size = true;
					}

					// If the file type is acceptable
					if (accepted_file_types.indexOf(req.files.profile_pic.type) < 0) {
						response.message = tr['uploaded_image_wrong_type'];
						response.error = 'Uploaded image is of wrong type';
					} else {
						accepted_type = true;
					}



					if (accepted_type && accepted_size) {
						profile_data.picture = '/images/profile_pics/' + user_id + '.' + extension;

						// Save the file in the images folder
						fs.writeFile(root_dir + '/public' + profile_data.picture, data, function(err) {
							// Update the database
							Profile.update({
								'_id': user_id
							}, {
								$set: profile_data
							}, {
								upsert: true
							}, function(error) {
								if(!error) {
									response.message = tr['data_updated_successfully'];
									res.status(200).json(response);
								} else {
									response.error = error;
									response.message = tr['something_went_wrong'];
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
						'_id': user_id
					}, 'password')
					.then(function(user) {
						if (typeof user.password === 'undefined') {
							response.error = 'User\'s old password could not be found';
							response.message = tr['something_went_wrong'];
							res.status(400).json(response);
						} else {
							// Generating errors
							if (req.body.password !== req.body.repeat_password) {
								response.error = 'Passwords do not match';
								response.message = tr['passwords_do_not_match'];
							}
							if (user.password !== userHelper.encryptPassword(req.body.old_password)) {
								response.error = 'Wrong old password';
								response.message = tr['wrong_password'];
							}
							if (!userHelper.validatePassword(req.body.password)) {
								response.error = 'A password shorter than the minimum allowed characters was provided';
								response.message = tr['password_should_be_at_least_6_characters_long'];
							}
							if (!response.error) {
								// If there are no errors, the password gets reset
								User.schema.resetPassword(user_id, req.body.password)
									.then(function() {
										response.message = tr['data_updated_successfully'];
										res.status(200).json(response);
									})
									.fail(function(error) {
										response.error = error;
										response.message = tr['something_went_wrong'];
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
							'_id': user_id
						}, profile_data)
						.then(function(profile) {
							response.message = tr['data_updated_successfully'];
							res.json(response);
						})
						.fail(function(error) {
							response.error = error;
							response.message = tr['something_went_wrong'];
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
	if (typeof req.session.user_id === 'undefined') {
		res.send('');
		return false;
	}

	var user_id = req.session.user_id;

	// Check if the profile really exists
	Profile.schema.findOne({
			'_id': user_id
		}, 'language')
		.then(function(profile) {

			var tr = translations[profile.language];
			var disciplines = ['100m', '200m', '400m', '800m', '1500m', '3000m', '60m_hurdles', '100m_hurdles', '110m_hurdles', '400m_hurdles', '3000m_steeple', '4x100m_relay', '4x400m_relay', 'marathon', 'high_jump', 'long_jump', 'triple_jump', 'pole_vault', 'shot_put', 'discus', 'hammer', 'javelin', 'pentathlon', 'heptathlon', 'decathlon'];
			var countries = ['AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BQ', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UM', 'UY', 'UZ', 'VU', 'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW'];
			var languages = {
				'en': 'English',
				'el': 'Ελληνικά',
				'ru': 'Русский'
			};


			var view_data = {
				'disciplines': disciplines,
				'languages': languages,
				'countries': countries,
				'tr': translations[profile.language],
				'section': 'settings'
			};

			res.render('settings', view_data);
		})
		.fail(function(error) {
			res.send('');
		});
};
