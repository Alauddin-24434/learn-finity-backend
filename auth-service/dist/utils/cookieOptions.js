"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieOptions = void 0;
const config_1 = require("../config");
exports.cookieOptions = {
    httpOnly: true,
    secure: config_1.envVariable.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};
//# sourceMappingURL=cookieOptions.js.map