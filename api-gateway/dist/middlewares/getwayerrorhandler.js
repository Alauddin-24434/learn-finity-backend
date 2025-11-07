"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gatewayErrorHandler = void 0;
const gatewayErrorHandler = (err, req, res, next) => {
    const status = err?.status || 500;
    const code = err?.code || "GATEWAY_ERROR";
    const message = err?.message || "Something went wrong at API Gateway";
    return res.status(status).json({
        error: { code, message, status, },
    });
};
exports.gatewayErrorHandler = gatewayErrorHandler;
//# sourceMappingURL=getwayerrorhandler.js.map