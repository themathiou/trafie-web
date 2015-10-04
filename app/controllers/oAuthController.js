// Load required packages
var oauth2orize = require('oauth2orize'),
	passport = require('passport'),
	User = require('../models/user'),
    userHelper = require('../helpers/userHelper.js'),
	Client = require('../models/client'),
	Token = require('../models/token'),
	crypto = require('crypto');

// Create OAuth 2.0 server
var server = oauth2orize.createServer();

// Register serialialization function
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
        if (err) return callback(err)
        if (!user) return callback(null, false)
        if(userHelper.encryptPassword(password) === user.password) {
            var token = uid(256);
            var refreshToken = uid(256);
 
            var expirationDate = new Date(new Date().getTime() + (10 * 3600 * 1000));
            var tokenObject = {value: token, expirationDate: expirationDate, clientId: client.id, userId: user._id, scope: 0};

            var tokenObj = new Token(tokenObject);
            tokenObj.save(function (err) {
                if (err) return callback(err);
                var refreshTokenObj = new Token({value: refreshToken, clientId: client.id, userId: user._id, scope: 0});
                refreshTokenObj.save(function (err) {
                    if (err) return callback(err);
                    callback(null, token, refreshToken, {expires_in: expirationDate, user_id: user._id});
                });
            })
        } else {
        	callback(null, false);
        }
    });
}));

//Refresh Token
server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, callback) {
    var refreshTokenHash = crypto.createHash('sha1').update(refreshToken).digest('hex')

    Token.findOne({value: refreshTokenHash}, function (err, token) {
        if (err) return callback(err)
        if (!token) return callback(null, false)
        if (client.clientId !== token.clientId) return callback(null, false)
        
        var newAccessToken = utils.uid(256)
        var accessTokenHash = crypto.createHash('sha1').update(newAccessToken).digest('hex')
        
        var expirationDate = new Date(new Date().getTime() + (10 * 3600 * 1000))
    
        Token.update({userId: token.userId}, {$set: {value: accessTokenHash, scope: scope, expirationDate: expirationDate}}, function (err) {
            if (err) return callback(err)
            callback(null, newAccessToken, refreshToken, {expires_in: expirationDate});
        })
    })
}));

function uid (len) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// token endpoint
exports.authorize = [
    passport.authenticate(['client-basic', 'client-password'], { session: false }),
    server.token(),
    server.errorHandler()
];