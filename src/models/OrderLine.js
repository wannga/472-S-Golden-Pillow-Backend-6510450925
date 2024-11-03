const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderLine = sequelize.define('OrderLine', {
  order_line_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders', // Reference to the orders table
      key: 'order_id',
    },
  },
  lot_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'products', // Reference to the products table
      key: 'lot_id',
    },
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'products', 
      key: 'grade',
    },
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
}, {
  tableName: 'orderline', 
  timestamps: false,
});

module.exports = OrderLine;
