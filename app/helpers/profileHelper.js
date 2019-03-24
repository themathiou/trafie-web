const config = require('../config/constantConfig');
const moment = require('moment');


var profileHelper = {};

/**
 * Checks first and last name for validity
 * @param string name
 */
profileHelper.validateName = function(name) {
    return config.nameRegex.test(name);
};

/**
 * Checks username for validity
 * @param string name
 */
profileHelper.validateUsername = function(username) {
    return config.usernameRegex.test(username) && config.forbiddenUsernames.indexOf(username) < 0;
};

/**
 * Checks the birthday for validity
 * @param json birthday
 * @return boolean
 */
profileHelper.validateBirthday = function(birthday) {
    if(typeof birthday === "string" && !birthday) return true;
    else if(typeof birthday !== "string") return false;
    else if(!config.birthdayValidation.regex.test(birthday)) return false;
    let birthdayObj = moment(birthday, config.birthdayValidation.format);

    return birthdayObj.isValid() && birthdayObj.year() < moment().subtract(10, 'years').year();
};

/**
 * Checks gender for validity
 * @param string gender
 * @return boolean
 */
profileHelper.validateGender = function(gender) {
    return typeof gender === "boolean";
};

/**
 * Checks the country code for validity
 * @param string country
 * @return boolean
 */
profileHelper.validateCountry = function(country) {
    return !country || config.countries.indexOf(country) >= 0;
};

/**
 * Checks the language for validity
 * @param string language
 * @return boolean
 */
profileHelper.validateLanguage = function(language) {
    return config.languages.indexOf(language) >= 0;
};

/**
 * Checks the discipline for validity
 * @param string discipline
 * @return boolean
 */
profileHelper.validateDiscipline = function(discipline, allowEmptyString) {
    if(typeof allowEmptyString !== 'undefined' && allowEmptyString && !discipline) return true;
    return config.disciplines.indexOf(discipline) >= 0;
};

/**
 * Checks the "about me" text for validity
 * @param string about
 * @return boolean
 */
profileHelper.validateAbout = function(about) {
    return config.aboutRegex.test(about);
};

/**
 * Checks the date format for validity
 * @param string dateFormat
 * @return boolean
 */
profileHelper.validateDateFormat = function(dateFormat) {
    return config.dateFormatRegex.test(dateFormat);
};

/**
 * Checks the privacy for validity
 * @param boolean privacy
 * @return boolean
 */
profileHelper.validatePrivacy = function(privacy) {
    return typeof privacy === 'boolean';
};

profileHelper.validateUnits = function(units) {
    if(typeof units !== 'object') return false;
    let isValid = true;
    for(let i in units) {
        if(i !== "distance" || !config.unitsRegex.test(units[i])) {
            isValid = false;
        }
    }
    return isValid;
};

module.exports = profileHelper;
