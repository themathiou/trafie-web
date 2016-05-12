'use strict';
// Loading models
const User = require('../models/userModel');

var crypto = require('crypto'),
    q = require('q');
const config = require('../config/constantConfig');

var userHelper = require('../helpers/userHelper');


/**
 * Encrypt password using sha512_hash
 * @param String password
 */
userHelper.encryptPassword = function(password) {
    var sha512Hash = crypto.createHash('sha512');
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
    var d = q.defer();
    User.findByIdAndUpdate(userId, {
        isVerified: true
    }, '', function(err, user) {
        if(err) d.reject;
        else d.resolve(!!user);
    });
    return d.promise;
};


module.exports = userHelper;
