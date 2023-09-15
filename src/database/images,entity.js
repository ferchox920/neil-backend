import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { v4 as uuidv4 } from 'uuid';

const IMAGE = sequelize.define(
  "image",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: uuidv4,
      unique: true,
    },
    productId: {
      type: DataTypes.UUID, // Esto debe coincidir con el tipo de ID en tu modelo de Producto
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    imageUrlSecurity: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

export default IMAGE;
