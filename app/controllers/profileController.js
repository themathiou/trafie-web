'use strict';

// Loading models
var Profile = require('../models/profile.js');
// Loading helpers
var accessHelper = require('../helpers/accessHelper.js'),
	profileHelper = require('../helpers/profileHelper.js');
// Get the config file
const config = require('../config/config.js');
const SEARCH_RESULTS_LENGTH = 10;

/**
 * Profile - GET
 */
exports.get = function(req, res) {
	if (typeof req.params.userId !== 'undefined') {
		accessHelper.validateAccess(req.user, req.params.userId)
		.then(function(response) {
			// If the user has a valid session and they are not visiting a private profile
			if (response.success) {
				// Send the profile data to the client
				sendProfileData(req, res, response.profile, response.user);
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
	let query = generateSearchQuery(req);
	Profile.schema.find(query, 'firstName lastName discipline country username _id', SEARCH_RESULTS_LENGTH)
	.then(function(results) {
		res.json(results);
	})
	.catch(function(error) {
		res.status(500).json(null);
	});
}

function generateSearchQuery(req) {
	let ands = [];
	var searchQuery = req.query;

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
			firstName: searchQuery.firstName
		});
	}

	if (typeof searchQuery.lastName === 'string') {
		ands.push({
			lastName: searchQuery.lastName
		});
	}

	if (typeof searchQuery.discipline === 'string') {
		ands.push({
			discipline: searchQuery.discipline
		});
	}

	if (typeof searchQuery.country === 'string') {
		ands.push({
			country: searchQuery.country
		});
	}

	// Do not fetch private profiles
	ands.push({
		isPrivate: false
	});

	if(req.user) {
		ands.push({
			_id: {$ne: req.user._id}
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
 * @param  object req          (the request object)
 * @param  object res          (the response object)
 * @param  object profileData  (the data of the profile before they get formatted according the the user's preferences)
 * @param  object userData     (the object that contains the data of the user who is viewing the profile)
 * @return object              (the profile data as a json object)
 */
function sendProfileData(req, res, profileData, userData) {
    var profile = {
        _id: 			profileData._id,
        firstName: 		profileData.firstName,
        lastName: 		profileData.lastName,
        discipline: 	profileData.discipline,
        isMale:    		profileData.isMale,
        picture: 		profileData.picture || config.defaultProfilePic,
        username: 	    profileData.username,
        country:        profileData.country,
        about:          profileData.about
    };
    if('_id' in userData && profileData._id.toString() === userData._id.toString()) {
        profile.isPrivate = profileData.isPrivate;
        profile.birthday = profileData.birthday;
        profile.language = userData.language;
        profile.dateFormat = userData.dateFormat;
        profile.email = req.user.email;
    }

	res.json(profile);
}

/**
 * PROFILE - POST
 */
exports.post = function(req, res) {
	// Get the user id from the session
	var userId = req.user && req.user._id.toString();

	// If there is no user id in the session, redirect to register screen
	if (!userId || !req.params.userId || userId !== req.params.userId) {
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

			var profileData = {},
                promises = [];

            // Validating first name
            if (typeof req.body.firstName !== 'undefined') {
                promises.push(new Promise(function(resolve, reject) {
                    if (profileHelper.validateName(req.body.firstName)) {
                        profileData.firstName = req.body.firstName;
                        resolve(profileData.firstName);
                    } else {
                        reject('SETTINGS.INVALID_FIRST_NAME');
                    }
                }));
            }

            // Validating last name
            if (typeof req.body.lastName !== 'undefined') {
                promises.push(new Promise(function(resolve, reject) {
                    if (profileHelper.validateName(req.body.lastName)) {
                        profileData.lastName = req.body.lastName;
                        resolve(profileData.lastName);
                    } else {
                        reject('SETTINGS.INVALID_LAST_NAME');
                    }
                }));
            }

            // Validating birthday
            if (typeof req.body.birthday !== 'undefined') {
                promises.push(new Promise(function(resolve, reject) {
                    if (profileHelper.validateBirthday(req.body.birthday)) {
                        profileData.birthday = req.body.birthday;
                        resolve(profileData.birthday);
                    } else {
                        reject('SETTINGS.INVALID_BIRTHDAY');
                    }
                }));
            }

            // Validating gender
            if (typeof req.body.isMale !== 'undefined') {
                promises.push(new Promise(function(resolve, reject) {
                    if (profileHelper.validateGender(req.body.isMale)) {
                        profileData.isMale = req.body.isMale;
                        resolve(profileData.isMale);
                    } else {
                        reject('SETTINGS.INVALID_GENDER');
                    }
                }));
            }

            // Validating country
            if (typeof req.body.country !== 'undefined') {
                promises.push(new Promise(function(resolve, reject) {
                    if (profileHelper.validateCountry(req.body.country)) {
                        profileData.country = req.body.country;
                        resolve(profileData.country);
                    } else {
                        reject('SETTINGS.INVALID_COUNTRY');
                    }
                }));
            }

            // Validating discipline
            if (typeof req.body.discipline !== 'undefined') {
                promises.push(new Promise(function(resolve, reject) {
                    if (profileHelper.validateDiscipline(req.body.discipline, true)) {
                        profileData.discipline = req.body.discipline;
                        resolve(profileData.discipline);
                    } else {
                        reject('SETTINGS.INVALID_DISCIPLINE');
                    }
                }));
            }

            // Validating the about me text
            if (typeof req.body.about !== 'undefined') {
                promises.push(new Promise(function(resolve, reject) {
                    if (profileHelper.validateAbout(req.body.about)) {
                        profileData.about = req.body.about;
                        resolve(profileData.about);
                    } else {
                        reject('COMMON.TOO_LONG_TEXT');
                    }
                }));
            }

            // Validating language
            if (typeof req.body.language !== 'undefined') {
                promises.push(new Promise(function(resolve, reject) {
                    if (profileHelper.validateLanguage(req.body.language)) {
                        profileData.language = req.body.language;
                        resolve(profileData.language);
                    } else {
                        reject('SETTINGS.INVALID_LANGUAGE');
                    }
                }));
            }

            // Validating date format
            if (typeof req.body.dateFormat !== 'undefined') {
                promises.push(new Promise(function(resolve, reject) {
                    if (profileHelper.validateDateFormat(req.body.dateFormat)) {
                        profileData.dateFormat = req.body.dateFormat;
                        resolve(profileData.dateFormat);
                    } else {
                        reject('COMMON.WRONG_DATE_FORMAT');
                    }
                }));
            }

            // Validating privacy
            if (typeof req.body.isPrivate !== 'undefined') {
                promises.push(new Promise(function(resolve, reject) {
                    if (profileHelper.validatePrivacy(req.body.isPrivate)) {
                        profileData.isPrivate = req.body.isPrivate;
                        resolve(profileData.isPrivate);
                    } else {
                        reject('SETTINGS.INVALID_PRIVACY');
                    }
                }));
            }

            // Validating username
            if (typeof req.body.username !== 'undefined') {
                promises.push(new Promise(function(resolve, reject) {
                    if (profileHelper.validateUsername(req.body.username)) {
                        var username = req.body.username.toLowerCase();
                        Profile.schema.findOne({
                                'username': username
                            }, '_id')
                            .then(function (profile) {
                                if (profile == null || (profile && profile._id === userId)) {
                                    profileData.username = username;
                                    resolve(profileData.username);
                                } else {
                                    reject('SETTINGS.USERNAME_TAKEN');
                                }
                            })
                            .catch(function (error) {
                                reject('SETTINGS.ERROR_OCCURRED');
                            });
                    } else {
                        reject('SETTINGS.INVALID_USERNAME');
                    }
                }));
            }

			// Checking if the uploaded file is a valid image file
			/*else if (typeof req.files !== 'undefined' && typeof req.files.profile_pic !== 'undefined') {
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
							profileData.picture = s3response.req.url;
							Profile.update({
								'_id': userId
							}, {
								$set: profileData
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
			}*/

			// Validating the change password request
			if (typeof req.body.oldPassword !== 'undefined' && typeof req.body.password !== 'undefined') {
                promises.push(new Promise(function (resolve, reject) {
                    // Find the old password of the user
                    User.schema.findOne({
                            '_id': userId
                        }, 'password')
                        .then(function (user) {
                            if (typeof user.password === 'undefined') {
                                reject('SETTINGS.WRONG_OLD_PASSWORD');
                            } else {
                                // Generating errors
                                if (user.password !== userHelper.encryptPassword(req.body.oldPassword)) {
                                    reject('SETTINGS.WRONG_OLD_PASSWORD');
                                }
                                else if (!userHelper.validatePassword(req.body.password)) {
                                    reject('SETTINGS.PASSWORD_SHOULD_BE_AT_LEAST_6_CHARACTERS_LONG');
                                }
                                else {
                                    // If there are no errors, the password gets reset
                                    User.schema.resetPassword(userId, req.body.password)
                                        .then(function () {
                                            resolve();
                                        })
                                        .catch(function (error) {
                                            reject('SETTINGS.ERROR_OCCURRED');
                                        });
                                }
                            }
                        });
                }));
            }

            Promise.all(promises).then(function(value) {
                Profile.schema.update({
                        '_id': userId
                    }, profileData)
                    .then(function(profile) {
                        res.status(200).json(profile);
                    })
                    .catch(function(error) {
                        res.status(500).json({messages: ['SETTINGS.ERROR_OCCURRED']});
                    });
            }, function(reason) {
                // If there are errors, do not update the profile
                res.status(400).json({messages: reason});
            });
		});
};