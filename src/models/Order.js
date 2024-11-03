const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  order_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Reference the Users table
      key: 'user_id',
    },
  },
  total_price: {
    type: DataTypes.FLOAT(10, 2),
    allowNull: false,
  },
  payment_status: {
    type: DataTypes.ENUM('Approved', 'Rejected', 'Yet to check'),
    defaultValue: 'Yet to check',
  },
  delivery_status: {
    type: DataTypes.ENUM('sent the packet', 'yet to send'),
    defaultValue: 'yet to send',
  },
  status_for_ledger: {
    type: DataTypes.ENUM('done', 'not done'),
    defaultValue: 'not done',
  },
  packed_status: {
    type: DataTypes.ENUM('packed', 'not packed yet'),
    defaultValue: 'not packed yet',
  },
  slip_payment: {
    type: DataTypes.STRING(255),
    defaultValue: 'no path',
  },
  order_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'orders',
  timestamps: false, 
});



module.exports = Order;
