import { DisciplineDataType, Discipline } from '../types/disciplineTypes';
import { Competition } from '../types/competitionTypes';
import { isPositiveInteger, isTimestampValid, isLocationValid, isNotesValid, isCommentsValid } from './validationHelper';
import { performanceValidation, competitionNameRegex } from '../config/constantConfig';
import * as moment from "moment";
import { ApiError } from '../types/apiTypes';

export function getDisciplineDataType(discipline: Discipline): DisciplineDataType | undefined{
    switch (discipline) {
        case Discipline.SixtyMeters:
        case Discipline.OneHundredMeters:
        case Discipline.TwoHundredMeters:
        case Discipline.FourHundredMeters:
        case Discipline.EightHundredMeters:
        case Discipline.OneAndAHalfKilometers:
        case Discipline.ThreeKilometers:
        case Discipline.FiveKilometers:
        case Discipline.TenKilometers:
        case Discipline.SixtyMetersHurdles:
        case Discipline.OneHundredMetersHurdles:
        case Discipline.OneHundredAndTenMetersHurdles:
        case Discipline.FourHundredMetersHurdles:
        case Discipline.ThreeKilometersSteeplechase:
        case Discipline.OneHundredMetersRelay:
        case Discipline.FourHundredMetersRelay:
        case Discipline.HalfMarathon:
        case Discipline.Marathon:
        case Discipline.TwentyKilometersRaceWalk:
        case Discipline.FiftyKilometersRaceWalk:
        case Discipline.CrosCountryRunning:
            return DisciplineDataType.Time;
        case Discipline.HighJump:
        case Discipline.LongJump:
        case Discipline.TripleJump:
        case Discipline.PoleVault:
        case Discipline.ShotPut:
        case Discipline.Discus:
        case Discipline.Hammer:
        case Discipline.Javelin:
            return DisciplineDataType.Distance;
        case Discipline.Pentathlon:
        case Discipline.Heptathlon:
        case Discipline.Decathlon:
            return DisciplineDataType.Points;
        default:
            return undefined;
    }
};

/**
 * Parses the given date, from format "YYYY-MM-DD HH:mm:ss" to
 * a JavaScript date object
 * @param string date
 */
export function parseDate(date: any): Date {
    if (date instanceof Date) {
        date = moment(date);
    } else if(parseInt(date)) {
        date = moment.unix(parseInt(date));
    } else {
        return null;
    }

    return date.isValid() && moment().unix() > date.unix() && date.unix() >= 0 ? date.toDate() : null;
};

export function isRankValid (rank: number): boolean {
    return isPositiveInteger(rank);
};

export function isPerformanceTimeValid(performance: number): boolean {
    return isPositiveInteger(performance) && performance < performanceValidation.timeMaxValue;
};

export function isPerformanceDistanceValid(performance: number): boolean {
    return isPositiveInteger(performance) && performance < performanceValidation.distanceMaxValue;
};

export function isPerformancePointsValid(performance: number): boolean {
    return isPositiveInteger(performance) && performance < performanceValidation.pointsMaxValue;
};

export function isCompetitionNameValid(competition: string): boolean {
    return competitionNameRegex.test(competition);
};

export function isValidBoolean(booleanValue: boolean): boolean {
    return booleanValue === true || booleanValue === false;
};

export function isCompetitionValid(competition: Competition): ApiError[] | undefined {
    const errors = [];
    let disciplineType = "";
    if(!competition.discipline) {
        errors.push({
            resource: "competition",
            field: "discipline",
            code: "missing"
        });
    } else {
        disciplineType = getDisciplineDataType(competition.discipline);
        if(!disciplineType) {
            errors.push({
                resource: "competition",
                field: "discipline",
                code: "invalid"
            });
        }
    }

    if(!competition.hasOwnProperty("performance")) {
        errors.push({
            resource: "competition",
            field: "performance",
            code: "missing"
        });
    }
    let isPerformanceValid = false;
    switch (disciplineType) {
        case DisciplineDataType.Time:
            isPerformanceValid = isPerformanceTimeValid(competition.performance);
            break;
        case DisciplineDataType.Distance:
            isPerformanceValid = isPerformanceDistanceValid(competition.performance);
            break;
        case DisciplineDataType.Points:
            isPerformanceValid = isPerformancePointsValid(competition.performance);
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
    if(!competition.date) {
        errors.push({
            resource: "competition",
            field: "date",
            code: "missing"
        });
    } else {
        if(!isTimestampValid(competition.date)) {
            errors.push({
                resource: "competition",
                field: "date",
                code: "invalid"
            });
        }
    }

    // Validating competition
    if(!competition.competition) {
        errors.push({
            resource: "competition",
            field: "competition",
            code: "missing"
        });
    } else if (!isCompetitionNameValid(competition.competition)) {
        errors.push({
            resource: "competition",
            field: "competition",
            code: "invalid"
        });
    }

    // Validating location
    if (competition.location && !isLocationValid(competition.location)) {
        errors.push({
            resource: "competition",
            field: "location",
            code: "invalid"
        });
    }

    // Validating rank
    if (competition.rank && !isRankValid(competition.rank)) {
        errors.push({
            resource: "competition",
            field: "rank",
            code: "invalid"
        });
    }

    // Validating notes
    if (competition.notes && !isNotesValid(competition.notes)) {
        errors.push({
            resource: "competition",
            field: "notes",
            code: "invalid"
        });
    }

    // Validating comments
    if (competition.comments && !isCommentsValid(competition.comments)) {
        errors.push({
            resource: "competition",
            field: "comments",
            code: "invalid"
        });
    }

    // Validating privacy (required field)
    if (!competition.hasOwnProperty("isPrivate") || (competition.hasOwnProperty("isPrivate") && !isValidBoolean(competition.isPrivate))) {
        errors.push({
            resource: "competition",
            field: "isPrivate",
            code: "invalid"
        });
    }

    // Validating the outdoor flag (required field)
    if (!competition.hasOwnProperty("isOutdoor") || (competition.hasOwnProperty("isOutdoor") && !isValidBoolean(competition.isOutdoor))) {
        errors.push({
            resource: "competition",
            field: "isOutdoor",
            code: "invalid"
        });
    }
    return errors.length ? errors: null;
};
