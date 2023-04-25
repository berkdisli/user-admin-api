const jwt = require("jsonwebtoken");
const dev = require("../config");
const createError = require("http-errors");

const isLoggedIn = (req, res, next) => {
    try {
        const authHeader = req.headers.cookie;
        if (!authHeader) throw createError(401, "Please login");

        const token = authHeader.split("=")[1];
        const decoded = jwt.verify(token, String(dev.app.jwtAuthorizationKey)
        );
        if (!decoded) throw createError(403, "Invalid Token");
        req.id = decoded._id;
        next();
    } catch (err) {
        next(err);
    }
};
const isLoggedOut = (req, res, next) => {
    try {
        const authHeader = req.headers.cookie;
        if (authHeader) throw createError(401, "Please logout");
        next();
    } catch (error) {
        next(error);
    }
};
module.exports = { isLoggedIn, isLoggedOut };