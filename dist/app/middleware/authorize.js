"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (isAdmin) => (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({ message: "Forbidden: No user found" });
    }
    if (isAdmin && !req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access only" });
    }
    next();
};
exports.authorize = authorize;
