import { DisciplineDataType, Discipline } from '../types/disciplineTypes';
import { Competition } from '../types/competitionTypes';
import {
    isPositiveInteger,
    isTimestampValid,
    isUpcomingTimestampValid,
    isLocationValid,
    isNotesValid,
    isCommentsValid,
} from './validationHelper';
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

export function isCompetitionValid(
    competitionEvent: Omit<Competition, "userId" | "dateCreated" | "dateUpdated">,
    previousCompetitionData?: Competition,
): ApiError[] | undefined {
    const errors = [];
    const {
        discipline,
        performance,
        date,
        rank,
        location,
        notes,
        comments,
        competition,
        isPrivate,
        isOutdoor,
        isUpcoming,
    } = competitionEvent;

    // Validating isUpcoming
    if (
        !isValidBoolean(isUpcoming)
        || (previousCompetitionData && !previousCompetitionData.isUpcoming && isUpcoming)
    ) {
        errors.push({
            resource: "competition",
            field: "upcoming",
            code: "invalid"
        });
        return errors;
    }

    let disciplineType = "";
    if (!discipline) {
        errors.push({
            resource: "competition",
            field: "discipline",
            code: "missing",
        });
    } else {
        disciplineType = getDisciplineDataType(discipline);
        if(!disciplineType) {
            errors.push({
                resource: "competition",
                field: "discipline",
                code: "invalid",
            });
        }
    }


    if (isUpcoming && performance != 0) {
        errors.push({
            resource: "competition",
            field: "performance",
            code: "invalid",
        });
    } else if (!isUpcoming) {
        if (performance === null) {
            errors.push({
                resource: "competition",
                field: "performance",
                code: "missing",
            });
        }
        let isPerformanceValid = false;
        switch (disciplineType) {
            case DisciplineDataType.Time:
                isPerformanceValid = isPerformanceTimeValid(performance);
                break;
            case DisciplineDataType.Distance:
                isPerformanceValid = isPerformanceDistanceValid(performance);
                break;
            case DisciplineDataType.Points:
                isPerformanceValid = isPerformancePointsValid(performance);
                break;
        }
        if (!isPerformanceValid) {
            errors.push({
                resource: "competition",
                field: "performance",
                code: "invalid"
            });
        }
    }

    // Validating date (required field)
    if (!date) {
        errors.push({
            resource: "competition",
            field: "date",
            code: "missing"
        });
    } else {
        if ((!isUpcoming && !isTimestampValid(date)) || (isUpcoming && !isUpcomingTimestampValid(date))) {
            errors.push({
                resource: "competition",
                field: "date",
                code: "invalid"
            });
        }
    }

    // Validating competition
    if (!competition) {
        errors.push({
            resource: "competition",
            field: "competition",
            code: "missing"
        });
    } else if (!isCompetitionNameValid(competition)) {
        errors.push({
            resource: "competition",
            field: "competition",
            code: "invalid"
        });
    }

    // Validating location
    if (location && !isLocationValid(location)) {
        errors.push({
            resource: "competition",
            field: "location",
            code: "invalid"
        });
    }

    // Validating rank
    if ((isUpcoming && rank !== null) || (!isUpcoming && rank && !isRankValid(rank))) {
        errors.push({
            resource: "competition",
            field: "rank",
            code: "invalid"
        });
    }

    // Validating notes
    if (notes && !isNotesValid(notes)) {
        errors.push({
            resource: "competition",
            field: "notes",
            code: "invalid"
        });
    }

    // Validating comments
    if (comments && !isCommentsValid(comments)) {
        errors.push({
            resource: "competition",
            field: "comments",
            code: "invalid"
        });
    }

    // Validating privacy (required field)
    if (!isValidBoolean(isPrivate)) {
        errors.push({
            resource: "competition",
            field: "isPrivate",
            code: "invalid"
        });
    }

    // Validating the outdoor flag (required field)
    if (!isValidBoolean(isOutdoor)) {
        errors.push({
            resource: "competition",
            field: "isOutdoor",
            code: "invalid"
        });
    }

    return errors.length ? errors: null;
};
