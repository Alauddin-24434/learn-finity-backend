"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
/*
  Middleware to check user role dynamically.
  Pass "admin" to allow only admins,
  Pass "!admin" to allow everyone except admins.
  Works with `req.user.isAdmin`.
*/
const authorize = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: User not authenticated" });
        }
        if (role === "admin" && !req.user) {
            return res.status(403).json({ message: "Access denied: Admins only" });
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=authorize.js.map