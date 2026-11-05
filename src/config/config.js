const config = {
  app: {
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || 5000,
    corsOrigins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
      : ["http://localhost:3000", "http://localhost:3001"],
  },

  db: {
    mongoUrl:
      process.env.MONGO_URL ||
      "mongodb://localhost:27017/e-commerce-website-fullstack",
  },
};

export default config;
