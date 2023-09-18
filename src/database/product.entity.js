import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import IMAGE from "./images.entity.js";
import CategoryType from "../common/type-category-enum.js";

const PRODUCT = sequelize.define(
  "product",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: uuidv4(),
      unique: true,
    },
    category: {
      type: DataTypes.ENUM,
      values: [CategoryType.NINTENDO, CategoryType.PLAYSTATION , CategoryType.ATARI],
      allowNull: false,
    },

    code: {
      type: DataTypes.STRING, // Cambiado a STRING ya que parece ser un código alfanumérico
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT, // Cambiado a FLOAT ya que el precio generalmente es un número decimal
    },
    quantity: {
      type: DataTypes.INTEGER, // Cambiado a INTEGER ya que la cantidad generalmente es un número entero
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

PRODUCT.hasMany(IMAGE, { foreignKey: "productId" });

export default PRODUCT;
