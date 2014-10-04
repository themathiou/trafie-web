'use strict';

var translations = [];
translations['en'] = require('../languages/en.js');
translations['el'] = require('../languages/el.js');
translations['ru'] = require('../languages/ru.js');
translations['pr'] = require('../languages/pr.js');
translations['languages'] = {
	'en': 'English',
	'el': 'Ελληνικά',
	'ru': 'Русский',
	'pr': 'Profanity'
};

module.exports = translations;