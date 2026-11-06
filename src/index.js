import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config/config.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import routes from "./routes/index.js";

dotenv.config({ quiet: true });

const app = express();

app.use(cors({ origin: config.app.corsOrigins, credentials: true }));
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/docs.json", (req, res) => res.json(swaggerSpec));

const connectDB = async () => {
  try {
    const database = mongoose.connection;

    database.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });

    database.once("connected", () => {
      console.log("Database Connected");
    });

    await mongoose.connect(config.db.mongoUrl);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

/**
 * @openapi
 * /status:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-11-05T10:30:00.000Z
 */
app.get("/status", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1", routes);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.app.port, () => {
      console.log(`Server is running on port ${config.app.port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
