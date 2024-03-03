process.env.NODE_ENV = process.env.NODE_ENV || "development";

const env = process.env.NODE_ENV;
const port = process.env.PORT || 3001;

let defaultConfig = {
  dbUrl: process.env.DATABASE_URL_DEV,
  jwtSecret: process.env.JWT_SECRET_DEV,
  port: port,
  logging: true,
};

if (env === "production") {
  defaultConfig = {
    dbUrl: process.env.DATABASE_URL_PROD,
    jwtSecret: process.env.JWT_SECRET_PROD,
    port: port,
    logging: false,
  };
}

export default defaultConfig;
