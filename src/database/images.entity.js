import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { v4 as uuidv4 } from 'uuid';
import ImageType from "../common/type-image-enum.js";

const IMAGE = sequelize.define(
  "image",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: uuidv4,
      unique: true,
    },
    relationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    publicId: {
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
