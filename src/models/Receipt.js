const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Receipt = sequelize.define('receipt', {
  receipt_id : { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  order_id: { type: DataTypes.INTEGER, allowNull: false },
  receipt_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  Receipt_path: {
    type: DataTypes.STRING(255),
    allowNull: false,
    // validate: {
    //   is: /\.(jpg|png)$/i, // Ensure image path ends with .jpg or .png
    // },
  },
}, {
  tableName: 'receipt', // Add this line to make sure Sequelize uses the correct table name
  timestamps: false // Disable automatic `createdAt` and `updatedAt` fields
});

module.exports = Receipt;

