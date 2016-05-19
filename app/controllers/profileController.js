'use strict';

// Loading models
var Profile = require('../models/profileModel'),
    User = require('../models/userModel');
// Loading helpers
var accessHelper = require('../helpers/accessHelper'),
    profileHelper = require('../helpers/profileHelper'),
    userHelper = require('../helpers/userHelper');
// Get the config file
const config = require('../config/constantConfig');
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
                    res.status(500).json({message: 'Server error'});
                } else {
                    // If the user doesn't have access to the data, or the data don't exist, do not send anything
                    res.status(404).json({message: 'Resource not found', errors: [{
                        resource: 'user',
                        code: 'not_found'
                    }]});
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
        res.status(500).json({message: 'Server error'});
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
        _id:            profileData._id,
        firstName:      profileData.firstName,
        lastName:       profileData.lastName,
        discipline:     profileData.discipline,
        isMale:         profileData.isMale,
        picture:        profileData.picture || config.defaultProfilePic,
        username:       profileData.username,
        country:        profileData.country,
        about:          profileData.about
    };
    if('_id' in userData && profileData._id.toString() === userData._id.toString()) {
        profile.isPrivate = profileData.isPrivate;
        profile.birthday = profileData.birthday;
        profile.usernameChangesCount = profileData.usernameChangesCount;
        profile.language = userData.language;
        profile.dateFormat = userData.dateFormat;
        profile.isVerified = req.user.isVerified;
        profile.units = profileData.units;
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
    if (!userId || !req.params.userId) {
        res.status(401).json({message: 'Unauthorized'});
        return false;
    }
    else if(userId.toString() !== req.params.userId) {
        res.status(403).json({message: 'Forbidden'});
        return false;
    }

    // Check if the profile really exists
    Profile.schema.findOne({
            '_id': userId,
        }, '_id usernameChangesCount username isPrivate')
        .then(function(profile) {
            // If the profile doesn't exist, return null
            if (typeof profile._id === 'undefined') {
                res.status(404).json({message: 'Resource not found', errors: [{
                    resource: 'user',
                    code: 'not_found'
                }]});
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
                        reject([422, {
                            resource: 'user',
                            field: 'firstName',
                            code: 'invalid'
                        }]);
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
                        reject([422, {
                            resource: 'user',
                            field: 'lastName',
                            code: 'invalid'
                        }]);
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
                        reject([422, {
                            resource: 'user',
                            field: 'birthday',
                            code: 'invalid'
                        }]);
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
                        reject([422, {
                            resource: 'user',
                            field: 'isMale',
                            code: 'invalid'
                        }]);
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
                        reject([422, {
                            resource: 'user',
                            field: 'country',
                            code: 'invalid'
                        }]);
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
                        reject([422, {
                            resource: 'user',
                            field: 'discipline',
                            code: 'invalid'
                        }]);
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
                        reject([422, {
                            resource: 'user',
                            field: 'about',
                            code: 'invalid'
                        }]);
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
                        reject([422, {
                            resource: 'user',
                            field: 'language',
                            code: 'invalid'
                        }]);
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
                        reject([422, {
                            resource: 'user',
                            field: 'dateFormat',
                            code: 'invalid'
                        }]);
                    }
                }));
            }

            // Validating privacy
            if (typeof req.body.isPrivate !== 'undefined') {
                promises.push(new Promise(function(resolve, reject) {
                    if(!req.user.isVerified && profile.isPrivate !== req.body.isPrivate) {
                        reject([403, {
                            resource: 'user',
                            field: 'isPrivate',
                            code: 'unverified_user'
                        }]);
                    }
                    else if (profileHelper.validatePrivacy(req.body.isPrivate)) {
                        profileData.isPrivate = req.body.isPrivate;
                        resolve(profileData.isPrivate);
                    }
                    else {
                        reject([422, {
                            resource: 'user',
                            field: 'isPrivate',
                            code: 'invalid'
                        }]);
                    }
                }));
            }

            // Validating privacy
            if (typeof req.body.units === 'object') {
                promises.push(new Promise(function(resolve, reject) {
                    if (profileHelper.validateUnits(req.body.units)) {
                        for(let i in req.body.units) {
                            if(!profileData.hasOwnProperty('units')) {
                                profileData.units = {};
                            }
                            if(req.body.units.hasOwnProperty(i)) {
                                profileData.units[i] = req.body.units[i];
                            }
                        }
                        resolve(profileData.units);
                    } else {
                        reject([422, {
                            resource: 'user',
                            field: 'units',
                            code: 'invalid'
                        }]);
                    }
                }));
            }

            // Validating username
            if (typeof req.body.username !== 'undefined' && (req.body.username || (!req.body.username && profile.username))) {
                promises.push(new Promise(function(resolve, reject) {
                    if(profile.usernameChangesCount === 2) {
                        reject([422, {
                            resource: 'user',
                            field: 'username',
                            code: 'already_processed'
                        }]);
                    }
                    else if (profileHelper.validateUsername(req.body.username)) {
                        var username = req.body.username.toLowerCase();
                        Profile.schema.findOne({
                                'username': username
                            }, '_id')
                            .then(function (foundProfile) {
                                if (foundProfile == null) {
                                    profileData.username = username;
                                    profileData.usernameChangesCount = profile.usernameChangesCount + 1;
                                    resolve(profileData.username);
                                }
                                else if(profile && profile._id.toString() === userId.toString()) {
                                    resolve();
                                }
                                else if(profile && profile._id !== userId) {
                                    reject([422, {
                                        resource: 'user',
                                        field: 'username',
                                        code: 'already_exists'
                                    }]);
                                }
                            })
                            .catch(function (error) {
                                reject([500, null]);
                            });
                    } else {
                        reject([422, {
                            resource: 'user',
                            field: 'username',
                            code: 'invalid'
                        }]);
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
                                reject([404, null]);
                            } else {
                                // Generating errors
                                if (user.password !== userHelper.encryptPassword(req.body.oldPassword)) {
                                    reject([422, {
                                        resource: 'user',
                                        field: 'oldPassword',
                                        code: 'invalid'
                                    }]);
                                }
                                else if (!userHelper.validatePassword(req.body.password)) {
                                    reject([422, {
                                        resource: 'user',
                                        field: 'password',
                                        code: 'invalid'
                                    }]);
                                }
                                else {
                                    // If there are no errors, the password gets reset
                                    User.schema.resetPassword(userId, req.body.password)
                                        .then(function () {
                                            resolve(req.body.password);
                                        })
                                        .catch(function (error) {
                                            reject([500, null]);
                                        });
                                }
                            }
                        })
                        .catch(function (error) {
                            reject([500, null]);
                        });
                }));
            }

            Promise.all(promises).then(function(value) {
                Profile.schema.update({
                        '_id': userId
                    }, profileData)
                    .then(function() {
                        res.status(200).json(profileData);
                    })
                    .catch(function(statusCode, error) {
                        res.status(statusCode).json({message: 'Server error'});
                    });
            }, function(error) {
                // If there are errors, do not update the profile
                if(error[0] === 500) {
                    res.status(error[0]).json({message: 'Server error'});
                }
                else if(error[0] === 404) {
                    res.status(error[0]).json({message: 'Resource not found', errors: [{
                        resource: 'user',
                        code: 'not_found'
                    }]});
                }
                else if(error[0] === 403) {
                    res.status(error[0]).json({message: 'Forbidden', errors: [error[1]]});
                }
                else {
                    res.status(error[0]).json({message: 'Invalid data', errors: [error[1]]});
                }
            });
        });
};