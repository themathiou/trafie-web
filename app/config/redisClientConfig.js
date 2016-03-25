var redis = require('redis'),
    db = require('../config/dbConfig.js');

var redisClient = null;
if(db[process.env.NODE_ENV].redis.password) {
    redisClient = redis.createClient(db[process.env.NODE_ENV].redis.port, db[process.env.NODE_ENV].redis.host, {auth_pass: true});
    redisClient.auth(db[process.env.NODE_ENV].redis.password);
} else {
    redisClient = redis.createClient(db[process.env.NODE_ENV].redis.port, db[process.env.NODE_ENV].redis.host);
}

module.exports = redisClient;