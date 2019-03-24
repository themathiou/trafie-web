import { DisciplineDataType, Discipline } from '../types/disciplineTypes';
import { isPositiveInteger } from './validationHelper';
import { performanceValidation, competitionNameRegex } from '../config/constantConfig';
import * as moment from "moment";

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
