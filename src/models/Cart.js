const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Cart = sequelize.define(
  'Cart',
  {
    cart_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', 
        key: 'user_id',
      }
    },
  },
  {
    tableName: 'Cart',
    timestamps: false,
  }
);

Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = Cart;
