const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Update with the correct path to your database configuration

const Product = sequelize.define('products', {
  lot_id: {
    type: DataTypes.CHAR(10),
    allowNull: false,
    primaryKey: true // This is part of the composite primary key
  },
  grade: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    primaryKey: true // This is part of the composite primary key
  },
  RemainLotamount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 }
  },
  LotamountStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 }
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: { isIn: [['Available', 'Out of Stock']] }
  },
  base_price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sale_price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image_path: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      is: /\.(jpg|png)$/i // Ensure image path ends with .jpg or .png
    }
  },
  exp_date: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'products',
  timestamps: false, // Disable timestamps if not needed
});

module.exports = Product;