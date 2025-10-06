"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const setupSwagger = (app) => {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Learning Platform API",
                version: "1.0.0",
                description: "API documentation for Learning Platform",
            },
            servers: [
                { url: "https://learn-finity-backend-production.up.railway.app", description: "Production server" },
                { url: "http://localhost:5000", description: "Local development server" },
                // Add more servers if needed
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },
            security: [
                { bearerAuth: [] } // applies globally to all routes
            ],
        },
        apis: ["./src/app/routes/**/*.route.ts"], // dynamically load all route docs
    };
    const specs = (0, swagger_jsdoc_1.default)(options);
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
};
exports.setupSwagger = setupSwagger;
