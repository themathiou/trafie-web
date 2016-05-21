'use strict';
var Token = require('../models/tokenModel');

exports.get = function(req, res) {
    if(req.headers.hasOwnProperty('authorization')) {
        var token = req.headers.authorization.split(' ').pop();
        Token.get(Token.hashToken(token), function(err, tokenObj) {
            if(tokenObj && tokenObj.refreshToken) {
                Token.remove(Token.hashToken(token), function (err, token) {});
                Token.remove(tokenObj.refreshToken, function (err, token) {});
            }
        });
    }
    req.session.destroy();
    res.json(null);
};