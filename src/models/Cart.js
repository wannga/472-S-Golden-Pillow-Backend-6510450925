const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Cart = sequelize.define(
  'cart',
  {
    cart_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'cart',
    timestamps: false,
  }
);

Cart.belongsTo(User, { foreignKey: 'user_id' });
module.exports = Cart;