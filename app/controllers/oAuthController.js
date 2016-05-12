// Load required packages
var oauth2orize = require('oauth2orize'),
    passport = require('passport'),
    User = require('../models/userModel'),
    userHelper = require('../helpers/userHelper'),
    Client = require('../models/clientModel'),
    Token = require('../models/tokenModel'),
    crypto = require('crypto');

// Create OAuth 2.0 server
var server = oauth2orize.createServer();

// Register serialization function
server.serializeClient(function(client, callback) {
  return callback(null, client._id);
});

// Register deserialization function
server.deserializeClient(function(id, callback) {
  Client.findOne({ _id: id }, function (err, client) {
    if (err) { return callback(err); }
    return callback(null, client);
  });
});

server.exchange(oauth2orize.exchange.password(function (client, email, password, scope, callback) {
    User.findOne({email: email}, function (err, user) {
        if (err) return callback(err);
        if (!user) return callback(null, false);
        if(userHelper.encryptPassword(password) === user.password) {
            var token = uid(256);
            var refreshToken = uid(256);

            var tokenObject = {value: token, clientId: client.id, userId: user._id.toString(), scope: '', refresh: false, refreshToken: refreshToken};

            var tokenObj = new Token(tokenObject);
            tokenObj.save(function (err) {
                if (err) return callback(err);

                var refreshTokenObj = new Token({value: refreshToken, clientId: client.id, userId: user._id.toString(), scope: '', refresh: true});
                refreshTokenObj.save(function (err) {
                    if (err) return callback(err);
                    callback(null, token, refreshToken, {user_id: user._id});
                });
            });
        } else {
            callback(null, false);
        }
    });
}));

//Refresh Token
server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, callback) {
    Token.get(Token.hashToken(refreshToken), function (err, token) {
        if (err) return callback(err);
        if (!token) return callback(null, false);
        if (client.id !== token.clientId) return callback(null, false);
        
        var newAccessToken = uid(256);

        var tokenObj = new Token({value: newAccessToken, clientId: client.id, userId: token.userId, scope: '', refresh: false});
        tokenObj.save(function (err) {
            if (err) return callback(err);
            callback(null, newAccessToken, refreshToken, {});
        });
    });
}));

function uid (len) {
    var buf = []
        , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        , charlen = chars.length;

    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// token endpoint
exports.authorize = [
    passport.authenticate(['client-basic', 'client-password'], {session: false}),
    server.token(),
    server.errorHandler()
];