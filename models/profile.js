// The User Model

var mongoose = require('mongoose');
var db = mongoose.connection;
var q = require('q');

//Define User SCHEMA
var profileSchema = mongoose.Schema({
  first_name	: { type: String, required: true },
  last_name		: { type: String, required: true },
  male			: { type: Boolean, required: false, default: null },
  birthday		: {
  					day: 	{ type: Number, required: false, default: null },
  					month: 	{ type: Number, required: false, default: null },
  					year: 	{ type: Number, required: false, default: null } 
   				  },
  discipline	: { type: String, required: false, default: '' },
  about 		: { type: String, required: false, default: '' },
  country 		: { type: String, required: false, default: '' },
  picture 		: { type: String, required: false, default: '' }
});

/**
* Find user by element
* @param json where({email:someone@trafie.com})
* @param String select
*/
profileSchema.findOne = function( where, select ) {
	var d = q.defer();
	Profile.findOne(where, select, function ( err, profile ) {
		d.resolve(profile);
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
		d.resolve(res);
	});

	return d.promise;
};

/**
 * Checks first and last name for validity
 */
profileSchema.validateName = function( name ) {
	return /^[A-Za-z ]+$/.test( name );
}

/**
 * Checks the birthday for validity
 */
profileSchema.validateBirthday = function( birthday ) {
	if( !isPositiveInteger( birthday.day ) || !isPositiveInteger( birthday.month ) || !isPositiveInteger( birthday.year ) ) {
		return false;
	}
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
}

function isPositiveInteger( value ) {
	return typeof value !== 'undefined' && !isNaN( parseInt(value) ) && isFinite( value ) && value > 0 && value % 1 === 0;
}

/**
 * Checks first and last name for validity
 */
profileSchema.validateGender = function( gender ) {
	return gender == 'male' || gender == 'female';
}

profileSchema.validateCountry = function( country ) {
	var country_codes = ['AF','AX','AL','DZ','AS','AD','AO','AI','AQ','AG','AR','AM','AW','AU','AT','AZ','BS','BH','BD','BB','BY','BE','BZ','BJ','BM','BT','BO','BQ','BA','BW','BV','BR','IO','BN','BG','BF','BI','KH','CM','CA','CV','KY','CF','TD','CL','CN','CX','CC','CO','KM','CG','CD','CK','CR','CI','HR','CU','CW','CY','CZ','DK','DJ','DM','DO','EC','EG','SV','GQ','ER','EE','ET','FK','FO','FJ','FI','FR','GF','PF','TF','GA','GM','GE','DE','GH','GI','GR','GL','GD','GP','GU','GT','GG','GN','GW','GY','HT','HM','VA','HN','HK','HU','IS','IN','ID','IR','IQ','IE','IM','IL','IT','JM','JP','JE','JO','KZ','KE','KI','KP','KR','KW','KG','LA','LV','LB','LS','LR','LY','LI','LT','LU','MO','MK','MG','MW','MY','MV','ML','MT','MH','MQ','MR','MU','YT','MX','FM','MD','MC','MN','ME','MS','MA','MZ','MM','NA','NR','NP','NL','NC','NZ','NI','NE','NG','NU','NF','MP','NO','OM','PK','PW','PS','PA','PG','PY','PE','PH','PN','PL','PT','PR','QA','RE','RO','RU','RW','BL','SH','KN','LC','MF','PM','VC','WS','SM','ST','SA','SN','RS','SC','SL','SG','SX','SK','SI','SB','SO','ZA','GS','SS','ES','LK','SD','SR','SJ','SZ','SE','CH','SY','TW','TJ','TZ','TH','TL','TG','TK','TO','TT','TN','TR','TM','TC','TV','UG','UA','AE','GB','US','UM','UY','UZ','VU','VE','VN','VG','VI','WF','EH','YE','ZM','ZW'];
	return country_codes.indexOf( country ) >= 0;
}

profileSchema.validateDiscipline = function( discipline ) {
	var disciplines = ['100m','200m','400m','800m','1500m','3000m','60m_hurdles','100m_hurdles','110m_hurdles','400m_hurdles','3000m_steeple','4x100m_relay','4x400m_relay','marathon','high_jump','long_jump','triple_jump','pole_vault','shot_put','discus','hammer','javelin','pentathlon','heptathlon','decathlon'];

	return disciplines.indexOf( discipline ) >= 0;
};

profileSchema.validateAbout = function( about ) {
	return about && about.length <= 400;
}

var Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;