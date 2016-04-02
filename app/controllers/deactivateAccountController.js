'use strict';
let Token = require('../models/tokenModel'),
    User = require('../models/userModel'),
    Profile = require('../models/profileModel'),
    Activity = require('../models/activityModel'),
    UserHash = require('../models/userHashesModel'),
    userHelper = require('../helpers/userHelper');

exports.post = function(req, res) {
    // Get the user id from the session
    var userId = req.user && req.user._id.toString() || null;

    // If there is no user id in the session, redirect to register screen
    if (!userId || !req.body.password) {
        res.status(401).json({message: 'Unauthorized'});
        return false;
    }

    User.schema.findOne({_id: req.user._id, password: userHelper.encryptPassword(req.body.password)}, 'email')
    .then(function(user) {
        if(user && user.email) {
            User.remove({_id: req.user._id}, function(err, deleted){});
            Profile.remove({_id: req.user._id}, function(err, deleted){});
            Activity.remove({userId: req.user._id.toString()}, function(err, deleted){});
            UserHash.remove({userId: req.user._id.toString()}, function(err, deleted){});
            if(req.headers.hasOwnProperty('authorization')) {
                var token = req.headers.authorization.split(' ').pop();
                Token.get(Token.hashToken(token), function(err, tokenObj) {
                    if(tokenObj && tokenObj.refreshToken) {
                        Token.remove(Token.hashToken(token), function (err, token) {});
                        Token.remove(tokenObj.refreshToken, function (err, token) {});
                    }
                });
            }
            req.logout();
            res.json(null);
        } else {
            res.status(401).json({message: 'Unauthorized'});
            return false;
        }
    })
    .catch(function(error) {
        res.status(500).json({message: 'Server error'});
    });
};