export interface ApiError {
    resource: string;
    field: string;
    code: string;
}

export type ApiErrors = ApiError[];