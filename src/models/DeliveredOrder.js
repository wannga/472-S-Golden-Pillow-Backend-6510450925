const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DeliveredOrder = sequelize.define(
  "DeliveredOrder",
  {
    deliver_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ems_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    staff_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Reference the Users table
        key: "user_id",
      },
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Orders", // Reference the Orders table
        key: "order_id",
      },
    },
  },
  {
    tableName: "DeliveredOrders",
    timestamps: false, // Disable timestamps if not needed
  }
);

module.exports = DeliveredOrder;


