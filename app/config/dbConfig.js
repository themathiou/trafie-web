'use strict';

var redisHost = '',
    redisPort = '',
    redisPassword = '';

if(typeof process.env.REDIS_URL === 'string') {
    var urlParts = process.env.REDIS_URL.split('@');
    redisPassword = urlParts[0].split(':').pop();
    urlParts = urlParts[1].split(':');
    redisHost = urlParts[0];
    redisPort = urlParts[1];
}

const db = {
    production : {
        redis: {
            host: redisHost,
            port: redisPort,
            password: redisPassword
        },
        mongo: {
            url: process.env.MONGOHQ_URL
        }
    },
    development: {
        redis: {
            host: '127.0.0.1',
            port: 6379,
            password: ''
        },
        mongo: {
            url: 'mongodb://localhost/trafie'
        }
    }
};

module.exports = db;