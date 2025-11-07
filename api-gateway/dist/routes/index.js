"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("./auth.routes");
const course_route_1 = require("./course.route");
const rootRouter = express_1.default.Router();
exports.rootRouter = rootRouter;
// Define entry points for each service
rootRouter.use('/auth', auth_routes_1.authRoutes);
rootRouter.use('/courses', course_route_1.courseRoutes);
//# sourceMappingURL=index.js.map