"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const notFound_1 = require("./app/middleware/notFound");
const api_1 = require("./app/api");
const config_1 = require("./app/config");
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const app = (0, express_1.default)();
const PORT = config_1.envVariable.PORT || 5000;
const clientURL = config_1.envVariable.CLIENT_URL || "http://localhost:3000";
/**
 * ✅ Middleware Setup (Ordered by priority)
 */
// 🍪 1️⃣ Cookie-parser
app.use((0, cookie_parser_1.default)());
// 🛡️ 2️⃣ Helmet - Security headers
app.use((0, helmet_1.default)());
// 🌍 3️⃣ CORS
app.use((0, cors_1.default)({
    origin: [clientURL],
    credentials: true,
}));
// 📋 4️⃣ Morgan - Request logging
const customFormat = ":method :url :status - :res[content-length] bytes - :response-time ms - :user-agent";
app.use((0, morgan_1.default)(customFormat));
// 📦 5️⃣ Body Parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
/**
 * 🔄 Routes
 */
app.get("/", (req, res) => {
    res.json({ status: "OK", message: "Akademi Backend is running!" });
});
// API entry
(0, api_1.initialRoute)(app);
// ❌ Not Found
app.use(notFound_1.notFound);
// ⚠️ Global Error Handler
app.use(globalErrorHandler_1.default);
// 🚀 Start the server
app.listen(PORT, () => {
    console.log(`🚀 Akademi Backend running on port ${PORT}`);
});
exports.default = app;
