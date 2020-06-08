const env = {
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://mongo/sunrinside",
  NODE_ENV: process.env.NODE_ENV || "development",
  SITE_URL: process.env.SITE_URL || "http://localhost:3000",
  IGNORE_EMAIL_HOST: process.env.IGNORE_EMAIL_HOST || false,
};

export default env;
