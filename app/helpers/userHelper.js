'use strict';
// Loading models
const s3Helper = require("./s3Helper");
const imageUploaderHelper = require("./imageUploadHelper");

const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const Activity = require('../models/activityModel');
const UserHash = require('../models/userHashesModel');

const crypto = require('crypto');
const q = require('q');
const config = require('../config/constantConfig');

const userHelper = {};


/**
 * Encrypt password using sha512_hash
 * @param String password
 */
userHelper.encryptPassword = function(password) {
    const sha512Hash = crypto.createHash('sha512');
    sha512Hash.update((process.env.USER_PASSWORD_SALT || 'userPasswordSalt') + password);
    // Return the encrypted password
    return sha512Hash.digest('hex');
};

/**
 * Checks email for validity
 * @param string email
 * @return boolean
 */
userHelper.validateEmail = function(email) {
    return config.validations.email.test(email);
};

/**
 * Checks password for validity
 * @param string password
 * @return boolean
 */
userHelper.validatePassword = function(password) {
    // The password should have at least 6 characters
    return config.validations.password.test(password);
};

/**
 * Makes the user valid
 * @param string userId
 */
userHelper.validateUser = function(userId) {
    const d = q.defer();
    User.findByIdAndUpdate(userId, {
        isVerified: true
    }, '', function(err, user) {
        if(err) d.reject;
        else d.resolve(!!user);
    });
    return d.promise;
};

userHelper.deleteUser = (userId) => {
    imageUploaderHelper.s3DeleteFilesInPath(s3Helper.getUserS3Folder(userId));
    User.remove({_id: userId}, function(err, deleted){});
    Profile.remove({_id: userId}, function(err, deleted){});
    Activity.remove({userId: userId.toString()}, function(err, deleted){});
    UserHash.remove({userId: userId.toString()}, function(err, deleted){});
};

module.exports = userHelper;
