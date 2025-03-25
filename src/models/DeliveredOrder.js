const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require('./User');
const Order = require('./Order');
const DeliveredOrder = sequelize.define(
  "deliveredorders",
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
      
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
  },
  {
    tableName: "deliveredorders",
    timestamps: false, // Disable timestamps if not needed
  }
);
DeliveredOrder.belongsTo(Order, { foreignKey: 'order_id'});
DeliveredOrder.belongsTo(User, { foreignKey: 'staff_id', targetKey: 'user_id' });
module.exports = DeliveredOrder;


