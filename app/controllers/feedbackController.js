'use strict';

const Feedback = require('../models/feedbackModel'),
    auth = require('../controllers/authController'),
    oAuth = require('../controllers/oAuthController'),
    passport = require('passport');

/**
 * Feedback - POST
 */
exports.post = function(req, res) {
    if(!req.user) {
        passport.authenticate('bearer', function(err, user) {
            if(err) res.status(500).json(null);
            req.user = user;
            saveFeedback(req, res);
        })(req, res);
    } else {
        saveFeedback(req, res);
    }
};

function saveFeedback(req, res) {
    var userId = req.user && req.user._id || null;
    if(!userId) res.status(403).json(null);

    if (typeof req.body.feedback === 'string' && req.body.feedback.length >= 10 && typeof req.body.feedbackType === 'string') {
        let platform = req.body.hasOwnProperty('platform') ? req.body.platform : 'web',
            userAgent = req.headers.hasOwnProperty('user-agent') ? req.headers['user-agent'] : '',
            osVersion = req.body.hasOwnProperty('osVersion') ? req.body.osVersion : '',
            appVersion = req.body.hasOwnProperty('appVersion') ? req.body.appVersion : '';

        let feedbackData = {
            userId: userId,
            feedback: req.body.feedback,
            feedbackType: req.body.feedbackType,
            platform: platform,
            osVersion: osVersion,
            appVersion: appVersion,
            userAgent: userAgent
        };

        let feedback = new Feedback(feedbackData);
        feedback.save()
            .then(function() {
                res.json(null);
            }, function(err) {
                res.status(500).json(null);
            });

    } else {
        res.status(422).json(null);
    }
}