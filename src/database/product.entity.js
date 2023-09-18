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
      defaultValue: uuidv4,
      unique: true,
    },
    category: {
      type: DataTypes.STRING,
      values: [CategoryType.ATARY, CategoryType.NINTENDO,CategoryType.PLAYSTATION],
      nullable: false,
    },
    code: {
      type: DataTypes.ENUM,
      nullable: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
    },
    quantity: {
      type: DataTypes.STRING,
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
