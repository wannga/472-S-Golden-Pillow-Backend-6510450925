const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');
const Order = require('./Order');
const OrderLine = sequelize.define('orderline', {
  order_line_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    
  },
  lot_id: {
    type: DataTypes.STRING,
    allowNull: false,
    
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: false,
    
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
OrderLine.belongsTo(Order, { foreignKey: 'order_id'});
OrderLine.belongsTo(Product, { foreignKey: 'lot_id' });
OrderLine.belongsTo(Product, { foreignKey: 'grade' });

module.exports = OrderLine;
