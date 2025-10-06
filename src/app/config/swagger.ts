import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

export const setupSwagger = (app: Application) => {
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

  const specs = swaggerJsdoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
