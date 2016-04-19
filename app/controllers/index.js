'use strict';

exports.getView = function(req, res) {
    //var angularRoutes = ['/', '/settings'];
    console.log(req.user);
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
    var angularRoutes = ['/login', '/register', '/reset-password', '/reset-password-request'];
    if (req.user && angularRoutes.indexOf(req.originalUrl) >= 0) {
        res.redirect(301, '/');
        return false;
    }

    res.render('layout-outer');
};
