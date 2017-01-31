'use strict';

const getView = function(req, res) {
    if (typeof req.user === 'undefined' && req.originalUrl === '/') {
        getOuterView(req, res);
        return false;
    }
    
    let data = {
        userId: req.user ? req.user._id : '',
        env: process.env.NODE_ENV,
        envInstance: process.env.NODE_ENV_INSTANCE || ""
    };

    res.render('layout', data);
};

const getOuterView = function(req, res) {
    let routesWithoutSession = ['/', '/login', '/register', '/reset-password', '/reset-password-request'];
    if (req.user && routesWithoutSession.indexOf(req.originalUrl) >= 0) {
        res.redirect(301, '/');
        return false;
    }

    let data = {
        env: process.env.NODE_ENV,
        envInstance: process.env.NODE_ENV_INSTANCE || ""
    };

    res.render('layout-outer', data);
};

exports.getView = getView;
exports.getOuterView = getOuterView;