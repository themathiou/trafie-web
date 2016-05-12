'use strict';

// The User Model
const mongoose = require('mongoose'),
    q = require('q'),
    crypto = require('crypto'),
    userHelper = require('../helpers/userHelper'),
    db = mongoose.connection;


//Define User SCHEMA
var userSchema = mongoose.Schema({
    email       : { type: String, required: true, unique: true, index: true },
    password    : { type: String, required: true },
    isVerified  : { type: Boolean, required: true, default: false},
    lastIp      : { type: String },
    lastLogin   : { type: Date },
    dateCreated : { type: Date },
    dateUpdated : { type: Date }
});

userSchema.pre('save', function(next){
    var now = new Date();
    this.dateUpdated = now;
    if ( !this.dateCreated ) {
        this.dateCreated = now;
    }
    next();
});

/**
* Find user by element
* @param json where( { email: someone@trafie.com } )
* @param String select
*/
userSchema.findOne = function( where, select ) {
    var d = q.defer();
    User.findOne(where, select, function ( err, user ) {
        if(err) d.reject(err);
        d.resolve(user);
    });
    return d.promise;
};

/**
 * Resets user's password
 * @param string userId
 * @param string password
 */
userSchema.resetPassword = function(userId, password) {
    var d = q.defer();
    password = userHelper.encryptPassword(password);
    User.findByIdAndUpdate( userId, { password: password }, '', function ( err, user ) {
        if(err) d.reject(err);
        d.resolve(user);
    });
    return d.promise;
};

/**
 * Checks if the email exists in the database
 * @param email
 */
userSchema.emailIsUnique = function(email) {
    var d = q.defer();
    User.findOne({'email': email}, '_id', function (err, user) {
        if(err) d.reject(err);
        d.resolve(!user);
    });
    return d.promise;
};

var User = mongoose.model('User', userSchema);

module.exports = User;