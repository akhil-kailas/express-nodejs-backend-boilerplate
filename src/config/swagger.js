import swaggerJsdoc from "swagger-jsdoc";
import config from "./config.js";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Backend API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      { url: `http://localhost:${config.app.port}`, description: "Local" },
      { url: "https://staging.example.com", description: "Staging" },
      { url: "https://api.example.com", description: "Production" },
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
  },

  apis: ["./src/index.js", "./src/routes/*.js"],
};

export default swaggerJsdoc(options);
