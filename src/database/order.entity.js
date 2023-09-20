// order.entity.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import USER from "./user.entity.js";
import PRODUCT from "./product.entity.js";
// Importa el modelo de User

const ORDER = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: uuidv4,
      unique: true,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    orderStatus: {
      type: DataTypes.ENUM("pending", "completed", "cancelled"),
      defaultValue: "pending",
    },
    orderDetails: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  {
    timestamps: true,
    modelName: "Order",
    tableName: "orders",
  }
);

// Establecer la relación
ORDER.belongsTo(USER, { foreignKey: "userId" });
USER.hasMany(ORDER, { foreignKey: "userId" });
ORDER.belongsToMany(PRODUCT, {
  through: "OrderProducts",
  foreignKey: "orderId",
});
PRODUCT.belongsToMany(ORDER, {
  through: "OrderProducts",
  foreignKey: "productId",
});
export default ORDER;
