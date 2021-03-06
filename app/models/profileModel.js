'use strict';

// The User Model
const mongoose = require('mongoose'),
        db = mongoose.connection,
        q = require('q');

//Define User SCHEMA
var profileSchema = mongoose.Schema({
    firstName   : { type: String,   required: true },
    lastName    : { type: String,   required: true },
    username    : { type: String,   required: false,    default: '' },
    isMale      : { type: Boolean,  required: false,    default: true },
    birthday    : { type: String,   required: false,    default: '' },
    discipline  : { type: String,   required: false,    default: '' },
    about       : { type: String,   required: false,    default: '' },
    country     : { type: String,   required: false,    default: '' },
    picture     : { type: String,   required: false,    default: '' },
    dateFormat  : { type: String,   required: false,    default: 'D-M-YYYY' },
    language    : { type: String,   required: false,    default: 'en' },
    isPrivate   : { type: Boolean,  required: false,    default: false },
    role        : { type: String,   required: false,    default: 'athlete'},
    usernameChangesCount: { type: Number, required: false, default: 0 },
    units: {
        distance: { type: String,   required: false,    default: 'meters'}
    },
    dateCreated : { type: Date },
    dateUpdated : { type: Date },
    keywords    : {
                    names: [ { type: String, required: false, default: '' } ]
                }
});

profileSchema.pre('save', function(next){
    var now = new Date();
    this.dateUpdated = now;
    if ( !this.dateCreated ) {
        this.dateCreated = now;
    }
    next();
});

/**
* Find profile by element
* @param json where({email:someone@trafie.com})
* @param String select
*/
profileSchema.findOne = function( where, select ) {
    var d = q.defer();
    Profile.findOne( where, select, function ( err, profile ) {
        d.resolve( profile );
    });
    return d.promise;
};

/**
* Find profile by element
* @param json where({email:someone@trafie.com})
* @param String select
*/
profileSchema.find = function( where, select, limit, skip, sort ) {
    var d = q.defer();
    if( typeof limit === "undefined" ) { limit = 0; }
    if( typeof skip === "undefined" ) { skip = 0; }
    if( typeof sort === "undefined" ) { sort = {}; }

    Profile.find( where, select,
        // Other parameters
        {
            'limit': limit,
            'skip': skip,
            'sort': sort
            /* Sort example
            {
                // -1 = descending
                date: sort
            } */
        }, function ( err, profile ) {
        d.resolve( profile );
    });
    return d.promise;
};

/**
* Save user profile
* @param object profile
*/
profileSchema.save = function( profile ) {
    var d = q.defer();

    profile.save(function ( err, res ) {
        Profile.findOne( { '_id': res.id }, 'firstName lastName', function ( err, profile ) {
            var names = [],
                firstNames = profile.firstName.split(' '),
                lastNames = profile.lastName.split(' '),
                names = firstNames.concat( lastNames ),
                namesLength = names.length;
            for ( var i=0 ; i<namesLength ; i++ ) {
                names[i] = names[i].toLowerCase();
            }
            Profile.update( { '_id': res.id }, { $set: { 'keywords' : { 'names': names } } }, function( error ) {
                d.resolve( error );
            });
        });
    });

    return d.promise;
};

/**
* Save user profile
* @param object profile
*/
profileSchema.update = function( where, data ) {
    var d = q.defer();

    Profile.update( where, { $set: data }, { upsert: true }, function( error ) {
        if( 'firstName' in data || 'lastName' in data ) {
            Profile.findOne( where, 'firstName lastName', function ( err, profile ) {
                var names = [],
                    firstNames = profile.firstName.split(' '),
                    lastNames = profile.lastName.split(' '),
                    names = firstNames.concat( lastNames );
                var names_length = names.length;
                for ( var i=0 ; i<names_length ; i++ ) {
                    names[i] = names[i].toLowerCase();
                }
                Profile.update( where, { $set: { 'keywords' : { 'names': names } } }, function( error ) {
                    d.resolve( error );
                });
            });
        } else {
            d.resolve( error );
        }
    });

    return d.promise;
};

var Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;