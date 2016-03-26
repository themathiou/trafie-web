'use strict';

exports.post = function(req, res) {
    if (req.user) {
        res.status(200).json({'_id': req.user._id});
    } else {
        res.status(404).json({message: 'Resource not found', errors: [{
            resource: 'user',
            code: 'not_found'
        }]});
    }
};