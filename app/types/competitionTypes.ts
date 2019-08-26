import { Discipline } from './disciplineTypes';

export interface Competition {
    userId: string;
    discipline: Discipline;
    performance: number,
    date: number,
    rank: number,
    location: string,
    competition: string,
    notes: string,
    comments: string,
    isPrivate: boolean,
    isOutdoor: boolean,
    picture: string,
    isUpcoming: boolean,
    dateCreated?: string,
    dateUpdated?: string,
}
