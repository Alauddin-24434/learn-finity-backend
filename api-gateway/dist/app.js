"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const getwayerrorhandler_1 = require("./middlewares/getwayerrorhandler");
const routes_1 = require("./routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1", routes_1.rootRouter);
app.use(getwayerrorhandler_1.gatewayErrorHandler);
app.listen(process.env.PORT, () => {
    console.log(`Get way server is running on port ${process.env.PORT}`);
});
//# sourceMappingURL=app.js.map