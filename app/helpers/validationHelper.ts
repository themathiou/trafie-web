import { notesRegex, commentsRegex, locationRegex } from '../config/constantConfig';

export function isPositiveInteger(value: number) {
    return !isNaN(Number(value)) && isFinite(value) && value >= 0 && value % 1 === 0;
}

export function isTimestampValid(timestamp: number): boolean {
    return isPositiveInteger(timestamp) && timestamp <= Math.floor(Date.now() / 1000);
};

export function isNotesValid(notes: string): boolean {
    return notesRegex.test(notes);
};

export function isCommentsValid(comments: string): boolean {
    return commentsRegex.test(comments);
};

export function isLocationValid(location: string): boolean {
    return locationRegex.test(location);
};

export function isValidBoolean(booleanValue: boolean): boolean {
    return booleanValue === true || booleanValue === false;
};