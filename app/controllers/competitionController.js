const moment = require('moment');

// Loading models
const Competition = require('../models/competitionModel');

// Loading helpers
const accessHelper = require('../helpers/accessHelper');
const imageUploadHelper = require('../helpers/imageUploadHelper');

const s3Helper = require('../helpers/s3Helper');

const competitonPictureOptions = {
    acceptedTypes: ['image/jpeg', 'image/png'],
    acceptedSize: 6 * 1024 * 1024,
    maxAcceptedWidth: 4320,
    maxAcceptedHeight: 4320,
    minAcceptedWidth: 400,
    minAcceptedHeight: 400,
    isSquare: false,
    sizes: [
        {size: 'full', pixels: 0},
        {size: 'md', pixels: 800},
        {size: 'sm', pixels: 400}
    ]
};
const competitionFields = ['_id', 'userId', 'discipline', 'performance', 'date', 'rank', 'location', 'competition', 'comments', 'isPrivate', 'type', 'isOutdoor', 'isDeleted', 'picture'];
const ownCompetitionFields = competitionFields.concat('notes');

/**
 * Activities - GET
 */
exports.get = function(req, res) {
    var profileId = req.params.userId,
        userId = req.user && req.user._id || null;

    if (typeof req.params.userId === 'undefined') {
        return res.status(404).json({message: 'Resource not found', errors: [{
            resource: 'user',
            code: 'not_found'
        }]});
    }
    accessHelper.validateAccess(req.user, profileId)
    .then(function(response) {
        // If the user has a valid session and they are not visiting a private profile
        if (response.success) {
            let where = {};
            let select = competitionFields.join(' ');
            // If the activity id was specified, try to find the activity
            if (typeof req.params.activityId !== 'undefined') {
                if(userId && profileId && userId.toString() === profileId.toString()) {
                    select = ownCompetitionFields.join(' ');
                    where = {
                        $and: [{
                            _id: req.params.activityId
                        }, {
                            userId: profileId
                        }]
                    };
                } 
                else {
                    where = {
                        $and: [{
                            _id: req.params.activityId
                        }, {
                            isPrivate: false
                        }, {
                            userId: profileId
                        }]
                    };
                }

                // Find the activity and return it
                Competition.findOne(where, select).then(function(activity) {
                    if(activity) {
                        res.status(200).json(activity);
                    } else {
                        res.status(404).json({message: 'Resource not found', errors: [{
                            resource: 'activity',
                            code: 'not_found'
                        }]});
                    }
                })
                .catch(function(error) {
                    res.status(500).json({message: 'Server error'});
                });
            } else {
                // If there was a discipline in the parameters of the GET request,
                // fetch the activities only of this discipline
                if (typeof req.query.discipline !== 'undefined' && req.query.discipline) {
                    where.discipline = req.query.discipline;
                }

                if(typeof req.query.isDeleted !== 'undefined' && ['true', 'false'].indexOf(req.query.isDeleted) >= 0) {
                    where.isDeleted = req.query.isDeleted === 'true';
                }

                if (typeof req.query.from !== 'undefined') {
                    let from = parseInt(req.query.from);
                    if(from >= 0 && from <= moment().unix()) {
                        where.date = {
                            "$gte": from
                        };
                    }
                }
                if (typeof req.query.to !== 'undefined') {
                    let to = parseInt(req.query.to);
                    if(to >= 0 && to <= moment().unix()) {
                        if(where.hasOwnProperty('date')) {
                            where.date.$lte = to;
                        } else {
                            where.date = {
                                "$lte": to
                            };
                        }
                    }
                }

                if (typeof req.query.updatedFrom !== 'undefined') {
                    let from = parseInt(req.query.updatedFrom);
                    if(from >= 0 && from <= moment().unix()) {
                        where.dateUpdated = {
                            "$gte": moment.unix(from).toDate()
                        };
                    }
                }
                if (typeof req.query.updatedTo !== 'undefined') {
                    let to = parseInt(req.query.updatedTo);
                    if(to >= 0 && to <= moment().unix()) {
                        if(where.hasOwnProperty('dateUpdated')) {
                            where.dateUpdated.$lte = moment.unix(to).toDate();
                        } else {
                            where.dateUpdated = {
                                "$lte": moment.unix(to).toDate()
                            };
                        }
                    }
                }

                where.userId = response.profile._id;

                if (!response.user._id || response.user._id.toString() !== response.profile._id.toString()) {
                    where.isPrivate = false;
                } else {
                    select += ' notes';
                }
                
                Competition.find(where, select, { sort: { date: -1 } })
                .then(function(competitions) {
                    res.json(competitions);
                })
                .catch(function(error) {
                    res.status(500).json({message: 'Server error'});
                });
            }
        } else {
            // Otherwise, if it's a server error, send the error
            if (response.error === 'query_error') {
                res.status(500).json({message: 'Server error'});
            } else {
                // If the user doesn't have access to the data, or the data don't exist, do not send anything
                res.status(404).json({message: 'Resource not found', errors: [{
                    resource: 'competition',
                    code: 'not_found'
                }]});
            }
        }
    });
};

/**
 * Activities - POST
 */
exports.post = function(req, res) {
    // Get the user id from the session
    var userId = req.user && req.user._id || null;
    // If there is no user id, or the user id is different than the one in the session
    if (!userId) {
        res.status(401).json({message: 'Unauthorized'});
    }
    else if(userId.toString() !== req.params.userId) {
        res.status(403).json({message: 'Forbidden'});
    }
    else {
        Competition.count({userId: userId, isDeleted: false}, function(err, activitiesCount) {
            if(activitiesCount >= 500) {
                res.status(403).json({message: 'Forbidden', errors: [{
                    resource: 'competition',
                    code: 'user_competition_limit'
                }]});
                return;
            }
            else if(!req.user.isVerified && activitiesCount >= 5) {
                res.status(403).json({message: 'Forbidden', errors: [{
                    resource: 'competition',
                    code: 'non_verified_user_competition_limit'
                }]});
                return;
            }

            // Create the record that will be inserted in the db
            var competitionData = {
                userId: userId,
                discipline: req.body.discipline || null,
                performance: typeof req.body.performance !== 'undefined' ? req.body.performance : null,
                date: req.body.date || null,
                rank: req.body.rank || null,
                location: req.body.location || '',
                competition: req.body.competition || '',
                notes: req.body.notes || '',
                comments: req.body.comments || '',
                picture: '',
                isPrivate: typeof req.body.isPrivate !== 'undefined' ? req.body.isPrivate : false,
                isOutdoor: typeof req.body.isOutdoor !== 'undefined' ? req.body.isOutdoor : false
            };
            var competition = new Competition(competitionData),
                errors = competition.checkValid();

            if(!errors) {
                competition.save()
                .then(function(activityRes) {
                    uploadImageAndSave(req, res, competition, userId, "POST");
                }, function(err) {
                    res.status(500).json({message: 'Server error'});
                });
            } else {
                res.status(422).json({message: 'Invalid data', errors: errors});
            }
        });
    }
};

/**
 * Competition - PUT
 */
exports.put = function(req, res) {
    // Get the user id from the session
    var userId = req.user && req.user._id.toString() || null;
    // Get the competition id from the url
    var competitionId = typeof req.params.competitionId !== 'undefined' ? req.params.competitionId : null;

    if (!userId) {
        res.status(401).json({message: 'Unauthorized'});
    }
    else if (!competitionId) {
        res.status(400).json({message: 'Bad Request'});
    }
    else if(userId.toString() !== req.params.userId) {
        res.status(403).json({message: 'Forbidden'});
    }
    else {
        Competition.findOne({_id: competitionId, userId: userId, isDeleted: false}, '')
        .then(function(competition) {
            if (!competition || typeof competition._id === 'undefined') res.status(404).json({message: 'Resource not found', errors: [{
                resource: 'activity',
                code: 'not_found'
            }]});

            // Create the record that will be inserted in the db
            competition.discipline = typeof req.body.discipline !== 'undefined' ? req.body.discipline : competition.discipline;
            competition.performance = typeof req.body.performance !== 'undefined' ? req.body.performance : competition.performance;
            competition.date = typeof req.body.date !== 'undefined' ? req.body.date : competition.date;
            competition.rank = typeof req.body.rank !== 'undefined' ? req.body.rank : competition.rank;
            competition.location = typeof req.body.location !== 'undefined' ? req.body.location : competition.location;
            competition.competition = typeof req.body.competition !== 'undefined' ? req.body.competition : competition.competition;
            competition.notes = typeof req.body.notes !== 'undefined' ? req.body.notes : competition.notes;
            competition.comments = typeof req.body.comments !== 'undefined' ? req.body.comments : competition.comments;
            competition.picture = typeof req.body.picture !== 'undefined' ? req.body.picture : competition.picture;
            competition.isPrivate = typeof req.body.isPrivate !== 'undefined' ? req.body.isPrivate : competition.isPrivate;
            competition.isOutdoor = typeof req.body.isOutdoor !== 'undefined' ? req.body.isOutdoor : competition.isOutdoor;

            var errors = competition.checkValid();

            // If there are no errors
            if (!errors) {
                uploadImageAndSave(req, res, competition, userId, "PUT");
            } else {
                // If there are errors, send the error messages to the client
                res.status(422).json({message: 'Invalid data', errors: errors});
            }
        })
        .catch(function(error) {
            res.status(500).json({message: 'Server error'});
        });
    }
};

/**
 * Competitions - DELETE
 */
exports.delete = function(req, res) {
    // Get the user id from the session
    var userId = req.user && req.user._id.toString();
    // Get the activity id from the url
    var competitionId = req.params.competitionId;

    if (!userId) {
        res.status(401).json({message: 'Unauthorized'});
    }
    else if (!competitionId) {
        res.status(400).json({message: 'Bad Request'});
    }
    else if(userId.toString() !== req.params.userId) {
        res.status(403).json({message: 'Forbidden'});
    }
    else {
        Competition.findOne({_id: competitionId, userId: userId}, '')
        .then(function(competition) {
            if(!competition) {
                res.status(404).json({message: 'Resource not found', errors: [{
                    resource: 'competition',
                    code: 'not_found'
                }]});
            } else {
                competition.isDeleted = true;
                competition.save(function(err, competitionRes) {
                    if(err) {
                        res.status(500).json({message: 'Server error'});
                    } else {
                        res.status(200).json(competitionRes);
                    }
                });
            }
        })
        .catch(function(error) {
            res.status(500).json({message: 'Server error'});
        });
    }
};

function uploadImageAndSave(req, res, competition, userId, method) {
    if (typeof req.body.picture !== 'undefined' || (typeof req.files !== 'undefined' && typeof req.files.picture !== 'undefined')) {
        let bodyFile = typeof req.files !== 'undefined' && typeof req.files.picture !== 'undefined' ? req.files.picture : undefined,
            s3Folder = s3Helper.getCompetitionS3Folder(userId, competition._id);

        imageUploadHelper.uploadImage(s3Folder, bodyFile, req.body.picture, competition._id, competitonPictureOptions)
        .then(function(imageUrl) {
            if (typeof imageUrl === "string") {
                competition.picture = imageUrl;
            }
            competition.save()
            .then(function() {
                var competitionRes = {};
                ownCompetitionFields.forEach(field => {
                    competitionRes[field] = competition[field];
                });
                res.status(201).json(competitionRes);
            }, function(err) {
                res.status(500).json({message: 'Server error'});
            });
        }).catch(function(reason) {
            if(reason === 422) {
                // Invalid image
                res.status(422).json({message: 'Invalid data', errors: [{
                    resource: 'user',
                    field: 'picture',
                    code: 'invalid'
                }]});
            } else {
                // Image upload failed
                res.status(500).json({message: 'Server error'});
            }
        });
    } else {
        if(method === "PUT") {
            competition.save()
                .then(function() {
                    res.status(201).json(competition);
                }, function(err) {
                    res.status(500).json({message: 'Server error'});
                });
        } else {
            res.status(201).json(competition);
        }
    }
}