import { Request, Response } from "express";
import { requestIsAuthenticated } from "../types/authenticationTypes";
import { getTrainingValidationErrors } from "../helpers/trainingHelper";
import { TrainingModel } from "../models/trainingModel";
import { Training as TrainingType, Drill } from "../types/trainingTypes";
import { Document } from "mongoose";

export function trainingsGet(req: Request, res: Response) {
    // Get the user id from the session
    const userId = requestIsAuthenticated(req) ? req.user._id : null;
    // If there is no user id, or the user id is different than the one in the session
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    } else if(userId.toString() !== req.params.userId) {
        return res.status(403).json({ message: "Forbidden" });
    }

    if (req.params.trainingId) {
        TrainingModel.findById(req.params.trainingId)
        .then((training) => res.status(200).json(training))
        .catch(() => res.status(500).json({message: "Server error"}));
    } else {
        TrainingModel.find({ userId: userId })
        .then((trainings) => res.status(200).json(trainings))
        .catch(() => res.status(500).json({message: "Server error"}));
    }
}

export function trainingsPost(req: Request, res: Response) {
    // Get the user id from the session
    const userId = requestIsAuthenticated(req) ? req.user._id : null;
    // If there is no user id, or the user id is different than the one in the session
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    } else if(userId.toString() !== req.params.userId) {
        return res.status(403).json({ message: "Forbidden" });
    }
    const trainingData: TrainingType = {
        userId: userId,
        date: req.body.date,
        drills: req.body.drills,
        location: req.body.location || "",
        notes: req.body.notes || ""
    };
    const validationErrors = getTrainingValidationErrors(trainingData);
    if (validationErrors.length) {
        return res.status(422).json({message: "Invalid data", errors: validationErrors});
    }
    
    const training = new TrainingModel(trainingData);
    training.save()
        .then(() => {
            return res.status(201).send(training);
        })
        .catch(() => {
            return res.status(500).json({message: "Server error"});
        });
    
}

export function trainingsPut(req: Request, res: Response) {
    // Get the user id from the session
    const userId = requestIsAuthenticated(req) ? req.user._id : null;
    const trainingId = req.params.trainingId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    else if (!trainingId) {
        return res.status(400).json({ message: "Bad Request" });
    }
    else if(userId.toString() !== req.params.userId) {
        return res.status(403).json({ message: "Forbidden" });
    }

    TrainingModel.findOne({ _id: trainingId, userId: userId }, "")
    .then((training: Document & TrainingType) => {
        if (!training || typeof training._id === "undefined") {
            return res.status(404).json({ 
                message: "Resource not found",
                errors: [{
                    resource: "training",
                    code: "not_found"
                }]
            });
        }

        const drills = training.drills.map((drill: Drill) => ({
            name: drill.name,
            value: drill.value
        }));

        const trainingData: TrainingType = {
            userId: userId,
            date: req.body.date || training.date,
            drills: req.body.drills || drills,
            location: typeof req.body.location !== "undefined" ? req.body.location : training.location,
            notes: typeof req.body.notes !== "undefined" ? req.body.notes : training.notes
        };

        const validationErrors = getTrainingValidationErrors(trainingData);
        if (validationErrors.length) {
            return res.status(422).json({ message: "Invalid data", errors: validationErrors });
        }
        
        TrainingModel.updateOne({ "_id": training._id }, trainingData)
            .then(() => {
                return res.status(200).send(trainingData);
            })
            .catch(() => {
                return res.status(500).json({ message: "Server error" });
            });
    })
    .catch((error) => {
        return res.status(500).json({ message: "Server error" });
    });
}

export function trainingsDelete(req: Request, res: Response) {
    const userId = requestIsAuthenticated(req) ? req.user._id : null;
    const trainingId = req.params.trainingId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    else if (!trainingId) {
        return res.status(400).json({ message: "Bad Request" });
    }
    else if(userId.toString() !== req.params.userId) {
        return res.status(403).json({ message: "Forbidden" });
    }
    TrainingModel.findOne({ _id: trainingId, userId: userId }, "")
    .then((training: Document & TrainingType) => {
        if (!training || typeof training._id === "undefined") {
            return res.status(404).json({ 
                message: "Resource not found",
                errors: [{
                    resource: "training",
                    code: "not_found"
                }]
            });
        }
        training.remove()
            .then(() => {
                return res.status(200);
            })
            .catch(() => {
                return res.status(500).json({ message: "Server error" });
            });
    })
    .catch((error) => {
        return res.status(500).json({ message: "Server error" });
    });
}
