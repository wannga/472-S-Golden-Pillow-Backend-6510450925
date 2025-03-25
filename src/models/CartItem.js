const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');
const Cart = require('./Cart');

const CartItem = sequelize.define('cartitem', {
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
  tableName: 'productincart',
  timestamps: false, 
});

CartItem.belongsTo(Cart, { foreignKey: 'cart_id'});
CartItem.belongsTo(Product, { foreignKey: 'lot_id' });
CartItem.belongsTo(Product, { foreignKey: 'grade' });

module.exports = CartItem;
