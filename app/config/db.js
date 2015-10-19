'use strict';

const db = {
    production : {
        redis: {
            host: "ec2-54-217-234-142.eu-west-1.compute.amazonaws.com",
            port: 17199,
            password: 'pfnv4tdfed5nm6fhashpp4mbt0s'
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