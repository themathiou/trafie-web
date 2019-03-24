const q = require("q");
import { model, Schema, SchemaTypeOpts } from "mongoose";
import { isTimestampValid, isLocationValid, isNotesValid, isCommentsValid } from "../helpers/validationHelper";
import {
    isPerformanceDistanceValid,
    getDisciplineDataType,
    isPerformanceTimeValid,
    isPerformancePointsValid,
    isCompetitionNameValid,
    isRankValid,
    isValidBoolean,
} from "../helpers/competitionHelper";
import { DisciplineDataType } from "../types/disciplineTypes";
import { Competition } from '../types/competitionTypes';

// TODO: Remove "type" from db
const competitionSchemaDefinition: { [key in keyof Competition]: SchemaTypeOpts<any> } = {
    userId      : { type: String,   required: true,     index: true },
    discipline  : { type: String,   required: true },
    performance : { type: Number,   required: true },
    date        : { type: Number,   required: true },
    rank        : { type: Number,   required: false,    default: null },
    location    : { type: String,   required: false,    default: "" },
    competition : { type: String,   required: false,    default: "" },
    notes       : { type: String,   required: false,    default: "" },
    comments    : { type: String,   required: false,    default: "" },
    isPrivate   : { type: Boolean,  required: false,    default: false },
    isDeleted   : { type: Boolean,  required: false,    default: false },
    isOutdoor   : { type: Boolean,  required: false,    default: true },
    picture     : { type: String,   required: false,    default: "" },
    dateCreated : { type: Date },
    dateUpdated : { type: Date }
};

const competitionSchema = new Schema(competitionSchemaDefinition);

competitionSchema.pre("save", (next) => {
    const now = new Date();
    this.dateUpdated = now;
    if (!this.dateCreated) {
        this.dateCreated = now;
    }
    next();
});

// WARNING: DO NOT RENAME TO VALIDATE, IT MAKES MONGOOSE HANG
competitionSchema.methods.checkValid = function() {
    var errors = [],
        disciplineType = "";

    if(!this.discipline) {
        errors.push({
            resource: "competition",
            field: "discipline",
            code: "missing"
        });
    } else {
        disciplineType = getDisciplineDataType(this.discipline);
        if(!disciplineType) {
            errors.push({
                resource: "competition",
                field: "discipline",
                code: "invalid"
            });
        }
    }

    if(!("performance" in this)) {
        errors.push({
            resource: "competition",
            field: "performance",
            code: "missing"
        });
    }
    let isPerformanceValid = false;
    switch (disciplineType) {
        case DisciplineDataType.Time:
            isPerformanceValid = isPerformanceTimeValid(this.performance);
            break;
        case DisciplineDataType.Distance:
            isPerformanceValid = isPerformanceDistanceValid(this.performance);
            break;
        case DisciplineDataType.Points:
            isPerformanceValid = isPerformancePointsValid(this.performance);
            break;
    }
    if(!isPerformanceValid) {
        errors.push({
            resource: "competition",
            field: "performance",
            code: "invalid"
        });
    }

    // Validating date (required field)
    if(!this.date) {
        errors.push({
            resource: "competition",
            field: "date",
            code: "missing"
        });
    } else {
        if(!isTimestampValid(this.date)) {
            errors.push({
                resource: "competition",
                field: "date",
                code: "invalid"
            });
        }
    }

    // Validating competition
    if(!this.competition) {
        errors.push({
            resource: "competition",
            field: "competition",
            code: "missing"
        });
    } else if (!isCompetitionNameValid(this.competition)) {
        errors.push({
            resource: "competition",
            field: "competition",
            code: "invalid"
        });
    }

    // Validating location
    if (this.location && !isLocationValid(this.location)) {
        errors.push({
            resource: "competition",
            field: "location",
            code: "invalid"
        });
    }

    // Validating rank
    if (this.rank && !isRankValid(this.rank)) {
        errors.push({
            resource: "competition",
            field: "rank",
            code: "invalid"
        });
    }

    // Validating notes
    if (this.notes && !isNotesValid(this.notes)) {
        errors.push({
            resource: "competition",
            field: "notes",
            code: "invalid"
        });
    }

    // Validating comments
    if (this.comments && !isCommentsValid(this.comments)) {
        errors.push({
            resource: "competition",
            field: "comments",
            code: "invalid"
        });
    }

    // Validating privacy (required field)
    if (!("isPrivate" in this) || ("isPrivate" in this && !isValidBoolean(this.isPrivate))) {
        errors.push({
            resource: "competition",
            field: "isPrivate",
            code: "invalid"
        });
    }

    // Validating the outdoor flag (required field)
    if (!("isOutdoor" in this) || ("isOutdoor" in this && !isValidBoolean(this.isOutdoor))) {
        errors.push({
            resource: "competition",
            field: "isOutdoor",
            code: "invalid"
        });
    }
    return errors.length ? errors: null;
};

const Competition = model("Competition", competitionSchema);
module.exports = Competition;
