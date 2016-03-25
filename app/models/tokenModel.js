// Load required packages
var crypto = require('crypto'),
    redisClient = require('../config/redisClientConfig');

const REFRESH_TOKEN_DURATION = 60 * 60 * 24 * 365,
    ACCESS_TOKEN_DURATION = 60 * 60 * 24;


function Token(token) {
    this.token = token;
}

Token.validate = function(token) {
    return typeof token === 'object'
        && token.hasOwnProperty('value')
        && token.hasOwnProperty('userId')
        && token.hasOwnProperty('clientId')
        && token.hasOwnProperty('scope')
        && token.hasOwnProperty('refresh')
        && typeof token.value === 'string'
        && typeof token.userId === 'string'
        && typeof token.clientId === 'string'
        && typeof token.scope === 'string'
        && typeof token.refresh === 'boolean'
        && token.value.length === 256;
};

Token.prototype.save = function(callback) {
    if(!Token.validate(this.token)) {
        return callback(true, null);
    }

    this.token.value = Token.hashToken(this.token.value);
    if(this.token.refreshToken) {
        this.token.refreshToken = Token.hashToken(this.token.refreshToken);
    }

    redisClient.hmset('token:' + this.token.value, this.token, (err, reply) => {
        if(err) {
            callback(true, null);
        } else {
            redisClient.expire('token:' + this.token.value, (this.token.refresh ? REFRESH_TOKEN_DURATION : ACCESS_TOKEN_DURATION), (err, reply) => {
                if(err) {
                    return callback(true, null);
                } else {
                    return callback(false, this.token);
                }
            });
        }
    });
};

Token.get = function(tokenValue, callback) {
    redisClient.hgetall('token:' + tokenValue, callback);
};

Token.remove = function(tokenValue, callback) {
    redisClient.del('token:' + tokenValue, function(err, reply) {
        callback(err);
    });
};

Token.hashToken = function(code) {
    return crypto.createHash('sha512').update((process.env.TOKEN_SALT || 'tokenSalt') + code).digest('hex');
};

// Export the model
module.exports = Token;