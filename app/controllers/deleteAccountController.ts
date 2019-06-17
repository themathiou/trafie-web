import { Request, Response } from "express";
import { requestIsAuthenticated } from "../types/authenticationTypes";
// TODO: Update imports when the files are in typescript
const Token = require("../models/tokenModel");
const User = require("../models/userModel");
const accountHelper = require("../helpers/accountHelper");
const userHelper = require("../helpers/userHelper");

export function deleteAccountPost(req: Request, res: Response) {
    const userId = requestIsAuthenticated(req) ? req.user._id : null;
    // If there is no user id in the session, redirect to register screen
    if (!userId || !req.body.password) {
        res.status(401).json({ message: "Unauthorized" });
        return false;
    }

    User.schema.findOne({_id: userId, password: userHelper.encryptPassword(req.body.password)}, "email")
    // TODO: Add type for user when model is in typescript
    .then((user) => {
        if (user && user.email) {
            accountHelper.deleteUser(userId);
            if (req.headers.hasOwnProperty("authorization")) {
                const token = req.headers.authorization.split(" ").pop();
                // TODO: Add types for error and tokenObj when Token is converted to typescript
                Token.get(Token.hashToken(token), (err, tokenObj) => {
                    if (tokenObj && tokenObj.refreshToken) {
                        Token.remove(Token.hashToken(token), (err, token) => {});
                        Token.remove(tokenObj.refreshToken, (err, token) => {});
                    }
                });
            }
            req.logout();
            res.json(null);
        } else {
            res.status(401).json({ message: "Unauthorized" });
            return false;
        }
    })
    .catch(() => {
        res.status(500).json({ message: "Server error" });
    });
};