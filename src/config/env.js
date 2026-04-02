import dotenv from "dotenv";

dotenv.config();

export const port        = process.env.PORT;
export const pg_database = process.env.PG_DATABASE;
export const pg_username = process.env.PG_USERNAME;
export const pg_password = process.env.PG_PASSWORD;
export const pg_dialect  = process.env.PG_DIALECT;
export const pg_host     = process.env.PG_HOST;
export const jwtSecret   = process.env.JWT_SECRET;
export const emailApp    = process.env.EMAIL_APP;
export const passwordApp = process.env.PASSWORD_APP;
export const urlApp      = process.env.URL_APP;
