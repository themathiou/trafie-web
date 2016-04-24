'use strict';

exports.getView = function(req, res) {
    console.log('gv', req.originalUrl);
    //var angularRoutes = ['/', '/settings'];
	if (typeof req.user === 'undefined' && req.originalUrl === '/') {
		res.redirect(301, '/register');
		return false;
	}
    var data = {
        userId: req.user ? req.user._id : ''
    };

    res.render('layout', data);
};

exports.getOuterView = function(req, res) {
    console.log('gov', req.originalUrl);
    var routesWithoutSession = ['/login', '/register', '/reset-password', '/reset-password-request'];
    if (req.user && routesWithoutSession.indexOf(req.originalUrl) >= 0) {
        res.redirect(301, '/');
        return false;
    }

    res.render('layout-outer');
};
