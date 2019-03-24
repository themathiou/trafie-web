const imageUploaderHelper = require("./imageUploadHelper");
const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const Competition = require('../models/competitionModel');
const UserHash = require('../models/userHashesModel');
const s3Helper = require("./s3Helper");

const q = require('q');
const accountHelper = {};

/**
 * Makes the user valid
 * @param string userId
 */
accountHelper.validateUser = function(userId) {
    const d = q.defer();
    User.findByIdAndUpdate(userId, {
        isVerified: true
    }, '', function(err, user) {
        if (err) d.reject;
        else d.resolve(!!user);
    });
    return d.promise;
};

accountHelper.deleteUser = (userId) => {
    imageUploaderHelper.s3DeleteFilesInPath(s3Helper.getUserS3Folder(userId));
    User.remove({_id: userId}, function(err, deleted){});
    Profile.remove({_id: userId}, function(err, deleted){});
    Competition.remove({userId: userId.toString()}, function(err, deleted){});
    UserHash.remove({userId: userId.toString()}, function(err, deleted){});
};

module.exports = accountHelper;