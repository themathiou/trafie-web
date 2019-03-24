import { model, Schema, SchemaTypeOpts } from "mongoose";
import { Training } from "../types/trainingTypes";

const trainingSchemaDefinition: { [key in keyof Training]: SchemaTypeOpts<any> } = {
    userId      : { type: String,   required: true,     index: true },
    date        : { type: Number,   required: true },
    drills      : [ { name: String, value: String } ],
    location    : { type: String,   required: false,    default: "" },
    notes       : { type: String,   required: false,    default: "" },
    dateCreated : { type: Date },
    dateUpdated : { type: Date },
};

var trainingSchema = new Schema(trainingSchemaDefinition);

trainingSchema.pre("save", (next) => {
    const now = new Date();
    this.dateUpdated = now;
    if (!this.dateCreated) {
        this.dateCreated = now;
    }
    next();
});

export const TrainingModel = model("Training", trainingSchema);
