'use strict';
var user = require('../models/userModel')

exports.post = function(req, res) {
    if (req.user) {
        console.log(req.ip)
        var ip = req.ip.substr(req.ip.lastIndexOf(':') + 1);
        var now = new Date();
        user.findOneAndUpdate(req.user._id, {lastLogin: now, lastIp: ip}, function(err, doc) {});
        res.status(200).json({'_id': req.user._id});
    } else {
        res.status(404).json({message: 'Resource not found', errors: [{
            resource: 'user',
            code: 'not_found'
        }]});
    }
};