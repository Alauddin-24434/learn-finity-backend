"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = require("./routes/auth.routes");
const authEroroHandeller_1 = __importDefault(require("./middlewares/authEroroHandeller"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(auth_routes_1.authRoutes);
app.use(authEroroHandeller_1.default);
exports.default = app;
//# sourceMappingURL=index.js.map