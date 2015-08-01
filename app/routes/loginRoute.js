'use strict';

// Loading models
var User = require('../models/user.js');

// Loading helpers
var userHelper = require('../helpers/userHelper.js');

exports.get = function(req, res) {
	if (typeof req.session.userId !== 'undefined') {
		res.redirect('/');
	}

	res.render('login', {
		'errors': {}
	});
};