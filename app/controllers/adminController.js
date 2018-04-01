
// Loading models
const Profile = require('../models/profileModel'),
    Activity = require('../models/activityModel'),
    User = require('../models/userModel');

const userHelper = require('../helpers/userHelper');

exports.getUsers = (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({});
    }
    let profiles;
    let activities;
    Profile.schema.find({}, '')
        .then((results) => {
            profiles = results;
            return Activity.schema.find({}, '');
        })
        .then((results) => {
            activities = results;
            return User.schema.find({}, '');
        })
        .then((results) => {
            const users = results.map(dbUser => {
                const user = {};
                Object.keys(User.schema.paths).forEach(key => {
                    if (key !== '__v' && key !== 'password') {
                        user[key] = dbUser[key];
                    }
                });
                const profile = profiles.find(profile => profile._id.toString() === user._id.toString());
                Object.keys(Profile.schema.paths).forEach(key => {
                    if (key !== '__v') {
                        user[key] = profile[key];
                    }
                });
                const userActivities = activities
                    .filter(activity => activity.userId.toString() === user._id.toString())
                    .map(activity => {
                        const formattedActivity = {};
                        Object.keys(Activity.schema.paths).forEach(key => {
                            if (key !== '__v') {
                                formattedActivity[key] = activity[key];
                            }
                        });
                        return formattedActivity;
                    });
                user.activities = userActivities;
                return user;
            });
            return res.status(200).json(users);
        })
        .catch(function(error) {
            console.log(error);
            res.status(500).json({message: 'Server error'});
        });
};

exports.deleteUser = function(req, res) {
    if (!req.user || !req.user.isAdmin || !req.params.userId || req.user._id.toString() === req.params.userId.toString()) {
        return res.status(403).json({});
    }
    userHelper.deleteUser(req.params.userId);
    return exports.getUsers(req, res);
};