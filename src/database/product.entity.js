import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PRODUCT = sequelize.define(
  "product",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique:true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["active", "inactive"],
      defaultValue: "active",
    }

  },
  {
    timestamps: false,
  }
);

export default PRODUCT;