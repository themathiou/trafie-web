'use strict';

exports.getView = function(req, res) {
    //var angularRoutes = ['/', '/settings'];
    if (typeof req.user === 'undefined' && req.originalUrl === '/') {
        res.redirect(301, '/register');
        return false;
    }
    let data = {
        userId: req.user ? req.user._id : '',
        env: process.env.NODE_ENV
    };

    res.render('layout', data);
};

exports.getOuterView = function(req, res) {
    let routesWithoutSession = ['/login', '/register', '/reset-password', '/reset-password-request'];
    if (req.user && routesWithoutSession.indexOf(req.originalUrl) >= 0) {
        res.redirect(301, '/');
        return false;
    }

    let data = {
        env: process.env.NODE_ENV
    };

    res.render('layout-outer', data);
};
