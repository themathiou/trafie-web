'use strict';
var Token = require('../models/tokenModel');

exports.get = function(req, res) {
    if(req.headers.hasOwnProperty('authorization')) {
        var token = req.headers.authorization.split(' ').pop();
        Token.findOne({value: Token.schema.hashToken(token)}, function (err, token) {
            if(!err && token) {
                var expiredTokensQuery = {userId: token.userId, clientId: token.clientId, expirationDate: {$lte: new Date()}};
                var currentTokenQuery = {value: token.value};
                Token.remove({$or: [expiredTokensQuery, currentTokenQuery]}, function(err, deleted) {
                    if(!err && deleted) {
                        Token.count({userId: token.userId, clientId: token.clientId, refresh: false}, function (err, result) {
                            if (!err && !result) {
                                Token.remove({userId: token.userId, clientId: token.clientId, refresh: true}, function(err, deleted) {});
                            }
                        });
                    }
                });
            }
        });
    }
    req.logout();
    res.json(null);
};