import { Sequelize } from "sequelize";

import {
  pg_database,
  pg_username,
  pg_password,
  pg_host,
  pg_dialect,
} from "./env.js";

const db = new Sequelize(pg_database, pg_username, pg_password, {
  host: pg_host,
  dialect: pg_dialect,
  logging: false,
});

export default db;
