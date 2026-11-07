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
      "mongodb://localhost:27017/backend-test",
  },

  admin: {
    email: process.env.ADMIN_EMAIL || "admin@gmail.com",
    passwordHash:
      process.env.ADMIN_PASSWORD_HASH ||
      "$2a$10$2JWO3zQpgyBCWDBt6tcGN.pt0TUE15N9siDw.5j9ScJGfIs49J.5.",
    accessTokenSecret:
      process.env.ADMIN_ACCESS_TOKEN_SECRET || "default_admin_access_secret",
    refreshTokenSecret:
      process.env.ADMIN_REFRESH_TOKEN_SECRET || "default_admin_refresh_secret",
  },

  user: {
    accessTokenSecret:
      process.env.USER_ACCESS_TOKEN_SECRET || "default_user_access_secret",
    refreshTokenSecret:
      process.env.USER_REFRESH_TOKEN_SECRET || "default_user_refresh_secret",
  },
};

export default config;
