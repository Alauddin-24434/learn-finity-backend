"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRoutes = void 0;
// api-gateway/routes/authRoutes.ts
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const courseServiceProxy = (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: "http://localhost:5002",
    changeOrigin: true,
});
// Here we forward the request to Auth Service
const router = express_1.default.Router();
router.post("/courses", courseServiceProxy);
router.get("/", courseServiceProxy);
exports.courseRoutes = router;
//# sourceMappingURL=course.route.js.map