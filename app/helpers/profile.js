'use strict';

var profileHelper = {};

/**
 * Checks first and last name for validity
 * @param string name
 */
profileHelper.validateName = function(name) {
	return /^[A-Za-z ]+$/.test(name);
};

/**
 * Checks username for validity
 * @param string name
 */
profileHelper.validateUsername = function(username) {
	var routes = ['users','views','settings_data','register','login','validation_email_sent','validate','resend_validation_email','reset_password_request','reset_password','four_oh_four','logout','feedback','settings','statistics'];
	return /^[A-Za-z_.0-9]+$/.test(username) && username.length <= 20 && routes.indexOf(username) < 0;
};

/**
 * Checks the birthday for validity
 * @param json birthday
 * @return boolean
 */
profileHelper.validateBirthday = function(birthday) {
	if (typeof birthday.day === 'undefined' || !parseInt(birthday.day) || typeof birthday.month === 'undefined' || !parseInt(birthday.month + 1) || typeof birthday.year === 'undefined' || !parseInt(birthday.year)) {
		return false;
	}

	// The month in JavaScript date goes from 0 to 11. Fixed.
	birthday.month++;

	// Validate month and year
	if (birthday.year < 1900 || birthday.year > 2010 || birthday.month > 12) {
		return false;
	}

	// Check if it's a leap year
	var leap_year = ((birthday.year % 4 == 0) && (birthday % 100 != 0)) || (birthday % 400 == 0);

	// Validate day
	if (birthday.day > 31 || ([4, 6, 9, 11].indexOf(birthday.month) >= 0 && birthday.day > 30)) {
		return false;
	}

	// Validate day, check Feburary during leap years
	if ((birthday.month == 2 && !leap_year && birthday.day > 28) || (birthday.month == 2 && leap_year && birthday.day > 29)) {
		return false;
	}

	return birthday;
};

/**
 * Parses the given date, from format "Thu Apr 11 2014" to
 * to a JavaScript date object
 * @param string date
 */
profileHelper.parseDate = function(date) {
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	date = date.split(' ');
	var current_date = new Date();

	// If the date is invalid, return an empty string
	if (date.length != 4 || months.indexOf(date[1]) < 0 || !parseInt(date[2]) || date[2] < 1 || date[2] > 31 || !parseInt(date[3]) || date[3] < 1900 || date[3] > current_date.getFullYear()) {
		return '';
	} else {
		// Create the date object
		var parsed_date = new Date(date[3], months.indexOf(date[1]), date[2]);
		return parsed_date < current_date ? parsed_date : current_date;
	}
};

/**
 * Checks if the given value is a positive integer number
 * @param number value
 * @return boolean
 */
function isPositiveInteger(value) {
	return typeof value !== 'undefined' && !isNaN(parseInt(value)) && isFinite(value) && value > 0 && value % 1 === 0;
};

/**
 * Checks gender for validity
 * @param string gender
 * @return boolean
 */
profileHelper.validateGender = function(gender) {
	return gender == 'male' || gender == 'female';
};

/**
 * Checks the country code for validity
 * @param string country
 * @return boolean
 */
profileHelper.validateCountry = function(country) {
	var country_codes = ['AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BQ', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UM', 'UY', 'UZ', 'VU', 'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW'];
	return country_codes.indexOf(country) >= 0;
};

/**
 * Checks the language for validity
 * @param string language
 * @return boolean
 */
profileHelper.validateLanguage = function(language) {
	var language_codes = ['en', 'el', 'ru', 'pr'];
	return language_codes.indexOf(language) >= 0;
};

/**
 * Checks the discipline for validity
 * @param string discipline
 * @return boolean
 */
profileHelper.validateDiscipline = function(discipline) {
	var disciplines = ['100m', '200m', '400m', '800m', '1500m', '3000m', '60m_hurdles', '100m_hurdles', '110m_hurdles', '400m_hurdles', '3000m_steeple', '4x100m_relay', '4x400m_relay', 'marathon', 'high_jump', 'long_jump', 'triple_jump', 'pole_vault', 'shot_put', 'discus', 'hammer', 'javelin', 'pentathlon', 'heptathlon', 'decathlon'];

	return disciplines.indexOf(discipline) >= 0;
};

/**
 * Checks the "about me" text for validity
 * @param string about
 * @return boolean
 */
profileHelper.validateAbout = function(about) {
	return about.length <= 400;
};

/**
 * Checks the date format for validity
 * @param string date_format
 * @return boolean
 */
profileHelper.validateDateFormat = function(date_format) {
	return date_format == 'd-m-y' || date_format == 'm-d-y';
};

module.exports = profileHelper;
