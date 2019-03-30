import { ApiErrors } from "../types/apiTypes";
import { Training, Drill } from "../types/trainingTypes";
import { isTimestampValid, isNotesValid, isLocationValid } from "./validationHelper";
import { trainingKeyRegex, trainingValueRegex } from '../config/constantConfig';

export function getTrainingValidationErrors(training: Training): ApiErrors {
    const errors: ApiErrors = [];

    if(!training.date) {
        errors.push({
            resource: "training",
            field: "date",
            code: "missing"
        });
    } else if(!isTimestampValid(training.date)) {
        errors.push({
            resource: "training",
            field: "date",
            code: "invalid"
        });
    }

    if (!Array.isArray(training.drills) || !isValidDrills(training.drills)) {
        errors.push({
            resource: "training",
            field: "drills",
            code: "invalid"
        });
    }
 
    if (training.location && !isLocationValid(training.location)) {
        errors.push({
            resource: "training",
            field: "location",
            code: "invalid"
        });
    }

    if (training.notes && !isNotesValid(training.notes)) {
        errors.push({
            resource: "training",
            field: "notes",
            code: "invalid"
        });
    }

    return errors;
}

function isValidDrills(drills: Drill[]): boolean {
    return drills.every((drill: Drill) => isValidDrill(drill));
}

function isValidDrill(drill: Drill): boolean {
    const drillKeys = Object.keys(drill);
    return drillKeys.length === 2
        && drillKeys.indexOf("name") >= 0
        && typeof drill.name === "string"
        && trainingKeyRegex.test(drill.name)
        && drillKeys.indexOf("value") >= 0
        && typeof drill.value === "string"
        && trainingValueRegex.test(drill.value);
}
