'use strict';
let Token = require('../models/tokenModel'),
    User = require('../models/userModel'),
    userHelper = require('../helpers/userHelper');

exports.post = function(req, res) {
    // Get the user id from the session
    const userId = req.user && req.user._id.toString() || null;

    // If there is no user id in the session, redirect to register screen
    if (!userId || !req.body.password) {
        res.status(401).json({message: 'Unauthorized'});
        return false;
    }

    User.schema.findOne({_id: req.user._id, password: userHelper.encryptPassword(req.body.password)}, 'email')
    .then(function(user) {
        if(user && user.email) {
            userHelper.deleteUser(req.user._id);
            if(req.headers.hasOwnProperty('authorization')) {
                const token = req.headers.authorization.split(' ').pop();
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