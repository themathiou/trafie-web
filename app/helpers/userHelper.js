'use strict';
const crypto = require('crypto');
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
    return config.emailRegex.test(email);
};

/**
 * Checks password for validity
 * @param string password
 * @return boolean
 */
userHelper.validatePassword = function(password) {
    // The password should have at least 6 characters
    return config.passwordRegex.test(password);
};

module.exports = userHelper;
