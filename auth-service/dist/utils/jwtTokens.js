"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.createRefreshToken = exports.createAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const createAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.envVariable.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: config_1.envVariable.JWT_ACCESS_TOKEN_EXPIRES_IN,
    });
};
exports.createAccessToken = createAccessToken;
const createRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.envVariable.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: config_1.envVariable.JWT_REFRESH_TOKEN_EXPIRES_IN,
    });
};
exports.createRefreshToken = createRefreshToken;
const verifyAccessToken = (token) => {
    return jsonwebtoken_1.default.verify(token, config_1.envVariable.JWT_ACCESS_TOKEN_SECRET);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, config_1.envVariable.JWT_REFRESH_TOKEN_SECRET);
};
exports.verifyRefreshToken = verifyRefreshToken;
//# sourceMappingURL=jwtTokens.js.map