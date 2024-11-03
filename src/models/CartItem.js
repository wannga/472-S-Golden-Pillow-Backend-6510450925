const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CartItem = sequelize.define('CartItem', {
  product_in_cart_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  },
  cart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lot_id: {
    type: DataTypes.CHAR(10),
    allowNull: false,
  },
  grade: {
    type: DataTypes.CHAR(1),
    allowNull: false,
  },
}, {
  tableName: 'ProductInCart',
  timestamps: false, 
});

module.exports = CartItem;
