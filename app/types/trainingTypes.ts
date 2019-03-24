export interface Training {
    userId: string;
    date: number;
    drills: Drill[];
    location?: string;
    notes?: string;
    dateCreated?: string;
    dateUpdated?: string;
}

export interface Drill {
    name: string,
    value: string,
}