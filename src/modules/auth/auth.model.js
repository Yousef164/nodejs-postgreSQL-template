import { DataTypes } from "sequelize";

import DBconnect from "../../config/db.js";

const auth = DBconnect.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  emailToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default auth;