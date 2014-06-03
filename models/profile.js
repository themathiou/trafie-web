// The User Model
var mongoose = require('mongoose');
var db = mongoose.connection;
var q = require('q');

//Define User SCHEMA
var profileSchema = mongoose.Schema({
  first_name	: { type: String, 	required: true },
  last_name		: { type: String, 	required: true },
  username 		: { type: String, 	required: false, 	default: null },
  male			: { type: Boolean, 	required: false, 	default: null },
  birthday		: { type: Date, 	required: false,	default: null },
  discipline	: { type: String, 	required: false, 	default: '' },
  about 		: { type: String, 	required: false, 	default: '' },
  country 		: { type: String, 	required: false, 	default: '' },
  picture 		: { type: String, 	required: false, 	default: '' },
  date_format 	: { type: String, 	required: true, 	default: 'd-m-y' },
  language 		: { type: String, 	required: true, 	default: 'en' },
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
profileSchema.find = function( where, select, limit ) {
	var d = q.defer();
	if( typeof limit == "undefined" ) limit = 0;
	if( typeof skip == "undefined" ) skip = 0;
	if( typeof sort == "undefined" ) sort = {};

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
			var names = [];
			first_names = profile.first_name.split(' ');
			last_names = profile.last_name.split(' ');
			names = first_names.concat( last_names );
			var names_length = names.length;
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
				var names = [];
				first_names = profile.first_name.split(' ');
				last_names = profile.last_name.split(' ');
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

/**
 * Checks first and last name for validity
 * @param string name
 */
profileSchema.validateName = function( name ) {
	return /^[A-Za-z ]+$/.test( name );
};

/**
 * Checks username for validity
 * @param string name
 */
profileSchema.validateUsername = function( username ) {
	return /^[A-Za-z_.0-9]+$/.test( username );
};

/**
 * Checks the birthday for validity
 * @param json birthday
 * @return boolean
 */
profileSchema.validateBirthday = function( birthday ) {
	console.log( birthday );
	birthday = Date.parse( birthday );
	console.log( birthday );
	
	return false;
};

/**
 * Checks the birthday for validity
 * @param json birthday
 * @return boolean
 */
profileSchema.validateBirthday2 = function( birthday ) {
	birthday = this.parseDate( birthday );

	if( birthday.year < 1900 || birthday.year > 2010 || birthday.month > 12 ) {
		return false;
	}
	
	var leap_year = ( (birthday.year % 4 == 0) && (birthday % 100 != 0) ) || (birthday % 400 == 0);

	if( birthday.day > 31 ) {
		return false;
	}
	if( [4,6,9,11].indexOf( birthday.month ) >= 0  && birthday.day > 30 ) {
		return false;
	}
	if( ( birthday.month == 2 && !leap_year && birthday.day > 28 ) || ( birthday.month == 2 && leap_year && birthday.day > 29 ) ) {
		return false;
	}
	return true;
};

/**
 * Parses the given date, from format "Thu Apr 11 2014" to
 * to a JavaScript date object
 * @param string date
 */
profileSchema.parseDate = function( date ) {
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

	date = date.split(' ');
	var current_date = new Date();

	// If the date is invalid, return an empty string
	if( date.length != 4 || months.indexOf( date[1] ) < 0 || !parseInt(date[2]) || date[2] < 1 || date[2] > 31 || !parseInt(date[3]) || date[3] < 1900 || date[3] > current_date.getFullYear() ) {
		return '';
	} else {
		// Create the date object
		var parsed_date = new Date( date[3], months.indexOf( date[1] ), date[2] );
		return parsed_date < current_date ? parsed_date : current_date;
	}
};

/**
 * Checks if the given value is a positive integer number
 * @param number value
 * @return boolean
 */
function isPositiveInteger( value ) {
	return typeof value !== 'undefined' && !isNaN( parseInt(value) ) && isFinite( value ) && value > 0 && value % 1 === 0;
};

/**
 * Checks gender for validity
 * @param string gender
 * @return boolean
 */
profileSchema.validateGender = function( gender ) {
	return gender == 'male' || gender == 'female';
};

/**
 * Checks the country code for validity
 * @param string country
 * @return boolean
 */
profileSchema.validateCountry = function( country ) {
	var country_codes = ['AF','AX','AL','DZ','AS','AD','AO','AI','AQ','AG','AR','AM','AW','AU','AT','AZ','BS','BH','BD','BB','BY','BE','BZ','BJ','BM','BT','BO','BQ','BA','BW','BV','BR','IO','BN','BG','BF','BI','KH','CM','CA','CV','KY','CF','TD','CL','CN','CX','CC','CO','KM','CG','CD','CK','CR','CI','HR','CU','CW','CY','CZ','DK','DJ','DM','DO','EC','EG','SV','GQ','ER','EE','ET','FK','FO','FJ','FI','FR','GF','PF','TF','GA','GM','GE','DE','GH','GI','GR','GL','GD','GP','GU','GT','GG','GN','GW','GY','HT','HM','VA','HN','HK','HU','IS','IN','ID','IR','IQ','IE','IM','IL','IT','JM','JP','JE','JO','KZ','KE','KI','KP','KR','KW','KG','LA','LV','LB','LS','LR','LY','LI','LT','LU','MO','MK','MG','MW','MY','MV','ML','MT','MH','MQ','MR','MU','YT','MX','FM','MD','MC','MN','ME','MS','MA','MZ','MM','NA','NR','NP','NL','NC','NZ','NI','NE','NG','NU','NF','MP','NO','OM','PK','PW','PS','PA','PG','PY','PE','PH','PN','PL','PT','PR','QA','RE','RO','RU','RW','BL','SH','KN','LC','MF','PM','VC','WS','SM','ST','SA','SN','RS','SC','SL','SG','SX','SK','SI','SB','SO','ZA','GS','SS','ES','LK','SD','SR','SJ','SZ','SE','CH','SY','TW','TJ','TZ','TH','TL','TG','TK','TO','TT','TN','TR','TM','TC','TV','UG','UA','AE','GB','US','UM','UY','UZ','VU','VE','VN','VG','VI','WF','EH','YE','ZM','ZW'];
	return country_codes.indexOf( country ) >= 0;
};

/**
 * Checks the language for validity
 * @param string language
 * @return boolean
 */
profileSchema.validateLanguage = function( language ) {
	var language_codes = ['en', 'el', 'ru', 'pr'];
	return language_codes.indexOf( language ) >= 0;
};

/**
 * Checks the discipline for validity
 * @param string discipline
 * @return boolean
 */
profileSchema.validateDiscipline = function( discipline ) {
	var disciplines = ['100m','200m','400m','800m','1500m','3000m','60m_hurdles','100m_hurdles','110m_hurdles','400m_hurdles','3000m_steeple','4x100m_relay','4x400m_relay','marathon','high_jump','long_jump','triple_jump','pole_vault','shot_put','discus','hammer','javelin','pentathlon','heptathlon','decathlon'];

	return disciplines.indexOf( discipline ) >= 0;
};

/**
 * Checks the "about me" text for validity
 * @param string about
 * @return boolean
 */
profileSchema.validateAbout = function( about ) {
	return about.length <= 400;
};

/**
 * Checks the date format for validity
 * @param string date_format
 * @return boolean
 */
profileSchema.validateDateFormat = function( date_format ) {
	return date_format == 'd-m-y' || date_format == 'm-d-y';
};

var Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;