'use strict';

exports.post = function(req, res) {
    if (req.user) {
        res.status(200).json({'_id': req.user._id});
    } else {
        res.status(404).json(null);
    }
};