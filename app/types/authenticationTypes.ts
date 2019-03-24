import { Request } from "express";

interface AuthenticatedUser {
    _id: string;
    email: string;
}

interface UserInRequest {
    user: AuthenticatedUser;
}

export type AuthenticatedRequest = Request & UserInRequest;

export function requestIsAuthenticated(req: Request): req is AuthenticatedRequest {
    return req.hasOwnProperty("user");
}