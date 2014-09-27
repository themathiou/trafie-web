'use strict';

// The User Model
const mongoose = require('mongoose'),
			db = mongoose.connection,
			q = require('q');

//Define User SCHEMA
var profileSchema = mongoose.Schema({
  first_name	: { type: String, 	required: true },
  last_name		: { type: String, 	required: true },
  username 		: { type: String, 	required: false, 	default: null },
  male			: { type: Boolean, 	required: false, 	default: null },
  birthday		: {
  					day: 	{ type: Number, required: false, default: null },
  					month: 	{ type: Number, required: false, default: null },
  					year: 	{ type: Number, required: false, default: null } 
   				  },
  discipline	: { type: String, 	required: false, 	default: '' },
  about 		: { type: String, 	required: false, 	default: '' },
  country 		: { type: String, 	required: false, 	default: '' },
  picture 		: { type: String, 	required: false, 	default: '' },
  date_format 	: { type: String, 	required: true, 	default: 'd-m-y' },
  language 		: { type: String, 	required: true, 	default: 'en' },
  private 		: { type: Boolean, 	required: true, 	default: false },
  keywords 		: {
  					names: [ { type: String, required: false, default: '' } ]
  				  }
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
		Profile.findOne( { '_id': res.id }, 'first_name last_name', function ( err, profile ) {
			var names = [],
				first_names = profile.first_name.split(' '),
				last_names = profile.last_name.split(' '),
				names = first_names.concat( last_names ),
				names_length = names.length;
			for ( var i=0 ; i<names_length ; i++ ) {
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
		if( 'first_name' in data || 'last_name' in data ) {
			Profile.findOne( where, 'first_name last_name', function ( err, profile ) {
				var names = [],
					first_names = profile.first_name.split(' '),
					last_names = profile.last_name.split(' '),
					names = first_names.concat( last_names );
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