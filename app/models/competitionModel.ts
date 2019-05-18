const q = require("q");
import { model, Schema, SchemaTypeOpts } from "mongoose";
import {
    isPerformanceDistanceValid,
    getDisciplineDataType,
    isPerformanceTimeValid,
    isPerformancePointsValid,
    isCompetitionNameValid,
    isRankValid,
    isValidBoolean,
} from "../helpers/competitionHelper";
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

const Competition = model("Competition", competitionSchema);
module.exports = Competition;
