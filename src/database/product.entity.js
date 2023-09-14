import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PRODUCT = sequelize.define(
  "product",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING, // Asegúrate de que el tipo de datos sea el correcto para el precio
    },
    quantity: {
      type: DataTypes.STRING, // Asegúrate de que el tipo de datos sea el correcto para la cantidad
    },
    status: {
      type: DataTypes.ENUM,
      values: ["active", "inactive"],
      defaultValue: "active",
    },
  },
  {
    timestamps: false,
  }
);

export default PRODUCT;
