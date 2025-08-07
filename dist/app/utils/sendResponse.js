"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, responseData) => {
    const { statusCode, success, message, data, meta } = responseData;
    const responseBody = {
        success,
        message,
        data,
    };
    if (meta) {
        responseBody.meta = meta;
    }
    res.status(statusCode).json(responseBody);
};
exports.sendResponse = sendResponse;
