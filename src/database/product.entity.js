import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { v4 as uuidv4 } from 'uuid';

const PRODUCT = sequelize.define(
  "product",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: uuidv4,
      unique: true,
    },
    imageId: {
      type: DataTypes.STRING,
    },
    imageUrlSecurity: {
      type: DataTypes.STRING,

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
