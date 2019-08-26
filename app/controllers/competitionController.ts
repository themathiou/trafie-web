import * as moment from "moment";
import { Request, Response } from "express";
import { Document } from "mongoose";
import { isCompetitionValid, isValidBoolean } from '../helpers/competitionHelper';
import { CompetitionModel } from "../models/competitionModel";
import { Competition } from '../types/competitionTypes';
const accessHelper = require("../helpers/accessHelper");
const imageUploadHelper = require("../helpers/imageUploadHelper");
const s3Helper = require("../helpers/s3Helper");

const competitonPictureOptions = {
    acceptedTypes: ["image/jpeg", "image/png"],
    acceptedSize: 6 * 1024 * 1024,
    maxAcceptedWidth: 4320,
    maxAcceptedHeight: 4320,
    minAcceptedWidth: 400,
    minAcceptedHeight: 400,
    isSquare: false,
    sizes: [
        { size: "full", pixels: 0 },
        { size: "md", pixels: 800 },
        { size: "sm", pixels: 400 }
    ]
};
const competitionFields = ["_id", "userId", "discipline", "performance", "date", "rank", "location", "competition", "comments", "isPrivate", "type", "isUpcoming", "isOutdoor", "picture"];
const ownCompetitionFields = competitionFields.concat("notes");

/**
 * Activities - GET
 */
exports.get = (req: Request, res: Response) => {
    var profileId = req.params.userId,
        userId = req.user && req.user._id || null;

    if (typeof req.params.userId === "undefined") {
        return res.status(404).json({
            message: "Resource not found",
            errors: [{
                resource: "user",
                code: "not_found"
            }]
        });
    }
    accessHelper.validateAccess(req.user, profileId)
    .then((response) => {
        // If the user has a valid session and they are not visiting a private profile
        if (response.success) {
            let where: any = {};
            let select = competitionFields.join(" ");
            // If the activity id was specified, try to find the activity
            if (typeof req.params.activityId !== "undefined") {
                if (userId && profileId && userId.toString() === profileId.toString()) {
                    select = ownCompetitionFields.join(" ");
                    where = {
                        $and: [{
                            _id: req.params.activityId
                        }, {
                            userId: profileId
                        }]
                    };
                } else {
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
                CompetitionModel.findOne(where, select).then((activity) => {
                    if(activity) {
                        res.status(200).json(activity);
                    } else {
                        res.status(404).json({
                            message: "Resource not found",
                            errors: [{
                                resource: "activity",
                                code: "not_found"
                            }]
                        });
                    }
                })
                .catch((error) => {
                    res.status(500).json({ message: "Server error" });
                });
            } else {
                // If there was a discipline in the parameters of the GET request,
                // fetch the activities only of this discipline
                if (typeof req.query.discipline !== "undefined" && req.query.discipline) {
                    where.discipline = req.query.discipline;
                }

                if (req.query.isUpcoming === "false" || req.query.isUpcoming === "true") {
                    where.isUpcoming = req.query.isUpcoming;
                }

                if (typeof req.query.from !== "undefined") {
                    let from = parseInt(req.query.from);
                    if(from >= 0 && from <= moment().unix()) {
                        where.date = {
                            "$gte": from
                        };
                    }
                }
                if (typeof req.query.to !== "undefined") {
                    let to = parseInt(req.query.to);
                    if(to >= 0 && to <= moment().unix()) {
                        if(where.hasOwnProperty("date")) {
                            where.date.$lte = to;
                        } else {
                            where.date = {
                                "$lte": to
                            };
                        }
                    }
                }

                if (typeof req.query.updatedFrom !== "undefined") {
                    let from = parseInt(req.query.updatedFrom);
                    if(from >= 0 && from <= moment().unix()) {
                        where.dateUpdated = {
                            "$gte": moment.unix(from).toDate()
                        };
                    }
                }
                if (typeof req.query.updatedTo !== "undefined") {
                    let to = parseInt(req.query.updatedTo);
                    if(to >= 0 && to <= moment().unix()) {
                        if(where.hasOwnProperty("dateUpdated")) {
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
                    select += " notes";
                }
                
                CompetitionModel.find(where, select, { sort: { date: -1 } })
                .then((competitions) => {
                    res.json(competitions);
                })
                .catch((error) => {
                    res.status(500).json({ message: "Server error" });
                });
            }
        } else {
            // Otherwise, if it"s a server error, send the error
            if (response.error === "query_error") {
                res.status(500).json({ message: "Server error" });
            } else {
                // If the user doesn"t have access to the data, or the data don"t exist, do not send anything
                res.status(404).json({
                    message: "Resource not found",
                    errors: [{
                        resource: "competition",
                        code: "not_found"
                    }],
                });
            }
        }
    });
};

/**
 * Activities - POST
 */
exports.post = (req, res) => {
    // Get the user id from the session
    var userId = req.user && req.user._id || null;
    // If there is no user id, or the user id is different than the one in the session
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
    }
    else if(userId.toString() !== req.params.userId) {
        res.status(403).json({ message: "Forbidden" });
    }
    else {
        CompetitionModel.count({ userId: userId }, (err, activitiesCount) => {
            if(activitiesCount >= 500) {
                res.status(403).json({
                    message: "Forbidden",
                    errors: [{
                        resource: "competition",
                        code: "user_competition_limit"
                    }],
                });
                return;
            }
            else if(!req.user.isVerified && activitiesCount >= 5) {
                res.status(403).json({
                    message: "Forbidden",
                    errors: [{
                        resource: "competition",
                        code: "non_verified_user_competition_limit"
                    }],
                });
                return;
            }

            // Create the record that will be inserted in the db
            var competitionData = {
                userId: userId,
                discipline: req.body.discipline || null,
                performance: typeof req.body.performance !== "undefined" ? req.body.performance : null,
                date: req.body.date || null,
                rank: req.body.rank || null,
                location: req.body.location || "",
                competition: req.body.competition || "",
                notes: req.body.notes || "",
                comments: req.body.comments || "",
                picture: "",
                isPrivate: typeof req.body.isPrivate !== "undefined" ? req.body.isPrivate : false,
                isOutdoor: typeof req.body.isOutdoor !== "undefined" ? req.body.isOutdoor : false,
                isUpcoming: typeof req.body.isUpcoming !== "undefined" ? req.body.isUpcoming : false
            };
            const errors = isCompetitionValid(competitionData);

            if(!errors) {
                const competition = new CompetitionModel(competitionData);
                competition.save()
                .then((activityRes) => {
                    uploadImageAndSave(req, res, competition, userId, "POST");
                }, (err) => {
                    res.status(500).json({ message: "Server error" });
                });
            } else {
                res.status(422).json({ message: "Invalid data", errors: errors });
            }
        });
    }
};

/**
 * Competition - PUT
 */
exports.put = (req, res) => {
    // Get the user id from the session
    var userId = req.user && req.user._id.toString() || null;
    // Get the competition id from the url
    var competitionId = typeof req.params.competitionId !== "undefined" ? req.params.competitionId : null;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
    }
    else if (!competitionId) {
        res.status(400).json({ message: "Bad Request" });
    }
    else if(userId.toString() !== req.params.userId) {
        res.status(403).json({ message: "Forbidden" });
    }
    else {
        CompetitionModel.findOne({ _id: competitionId, userId: userId }, "")
        .then((competition: Document & Competition) => {
            if (!competition || typeof competition._id === "undefined") res.status(404).json({message: "Resource not found", errors: [{
                resource: "activity",
                code: "not_found",
            }]});
            
            const competitionData = {
                discipline: typeof req.body.discipline !== "undefined" ? req.body.discipline : competition.discipline,
                performance: typeof req.body.performance !== "undefined" ? req.body.performance : competition.performance,
                date: typeof req.body.date !== "undefined" ? req.body.date : competition.date,
                rank: typeof req.body.rank !== "undefined" ? req.body.rank : competition.rank,
                location: typeof req.body.location !== "undefined" ? req.body.location : competition.location,
                competition: typeof req.body.competition !== "undefined" ? req.body.competition : competition.competition,
                notes: typeof req.body.notes !== "undefined" ? req.body.notes : competition.notes,
                comments: typeof req.body.comments !== "undefined" ? req.body.comments : competition.comments,
                picture: typeof req.body.picture !== "undefined" ? req.body.picture : competition.picture,
                isPrivate: typeof req.body.isPrivate !== "undefined" ? req.body.isPrivate : competition.isPrivate,
                isOutdoor: typeof req.body.isOutdoor !== "undefined" ? req.body.isOutdoor : competition.isOutdoor,
                isUpcoming: typeof req.body.isUpcoming !== "undefined" ? req.body.isUpcoming : competition.isUpcoming,
            }
            const errors = isCompetitionValid(competitionData, competition);
            // If there are no errors
            if (!errors) {
                const oldPicture = competition.picture;
                Object.keys(competitionData).forEach((key) => {
                    competition[key] = competitionData[key];
                });
                if (oldPicture && oldPicture !== competitionData.picture) {
                    imageUploadHelper.s3DeleteFilesInPath(s3Helper.getCompetitionS3Folder(userId, competitionId))
                        .then(() => {
                            uploadImageAndSave(req, res, competition, userId, "PUT");
                        })
                        .catch(() => {
                            res.status(500).json({ message: "Server error" });
                        });
                } else {
                    uploadImageAndSave(req, res, competition, userId, "PUT");
                }
            } else {
                // If there are errors, send the error messages to the client
                res.status(422).json({ message: "Invalid data", errors: errors });
            }
        })
        .catch((error) => {
            res.status(500).json({ message: "Server error" });
        });
    }
};

/**
 * Competitions - DELETE
 */
exports.delete = (req, res) => {
    // Get the user id from the session
    var userId = req.user && req.user._id.toString();
    // Get the activity id from the url
    var competitionId = req.params.competitionId;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
    }
    else if (!competitionId) {
        res.status(400).json({ message: "Bad Request" });
    }
    else if(userId.toString() !== req.params.userId) {
        res.status(403).json({ message: "Forbidden" });
    }
    else {
        CompetitionModel.findOne({ _id: competitionId, userId: userId }, "")
        .then((competition: Document & Competition) => {
            if(!competition) {
                res.status(404).json({
                    message: "Resource not found",
                    errors: [{
                        resource: "competition",
                        code: "not_found"
                    }]
                });
            } else {
                const removeCompetition = () => competition.remove()
                    .then(() => {
                        return res.status(200).json({});
                    })
                    .catch(() => {
                        return res.status(500).json({ message: "Server error" });
                    });
                if (competition.picture) {
                    return imageUploadHelper.s3DeleteFilesInPath(s3Helper.getCompetitionS3Folder(userId, competitionId))
                        .then(removeCompetition)
                        .catch(() => {
                            res.status(500).json({ message: "Server error" });
                        });
                } else {
                    return removeCompetition();
                }
                
            }
        })
        .catch((error) => {
            res.status(500).json({ message: "Server error" });
        });
    }
};

function uploadImageAndSave(req, res, competition, userId, method) {
    if (typeof req.body.picture !== "undefined" || (typeof req.files !== "undefined" && typeof req.files.picture !== "undefined")) {
        const bodyFile = typeof req.files !== "undefined" && typeof req.files.picture !== "undefined" ? req.files.picture : undefined;
        const s3Folder = s3Helper.getCompetitionS3Folder(userId, competition._id);

        imageUploadHelper.uploadImage(s3Folder, bodyFile, req.body.picture, competition._id, competitonPictureOptions)
        .then((imageUrl) => {
            if (typeof imageUrl === "string") {
                competition.picture = imageUrl;
            }
            competition.save()
                .then(() => {
                    const competitionRes = {};
                    ownCompetitionFields.forEach(field => {
                        competitionRes[field] = competition[field];
                    });
                    res.status(201).json(competitionRes);
                }, (err) => {
                    res.status(500).json({ message: "Server error" });
                });
        }).catch((reason) => {
            if (reason === 422) {
                // Invalid image
                res.status(422).json({
                    message: "Invalid data",
                    errors: [{
                        resource: "user",
                        field: "picture",
                        code: "invalid"
                    }]
                });
            } else {
                // Image upload failed
                res.status(500).json({ message: "Server error" });
            }
        });
    } else {
        if (method === "PUT") {
            competition.save()
                .then(() => {
                    res.status(201).json(competition);
                }, (err) => {
                    res.status(500).json({ message: "Server error" });
                });
        } else {
            res.status(201).json(competition);
        }
    }
}