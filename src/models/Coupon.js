const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coupon = sequelize.define('Coupon', {
    coupon_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    discount_details: {
        type: DataTypes.CHAR(20),
        allowNull: false,
    },
    coupon_code: {
        type: DataTypes.CHAR(13),
        allowNull: false,
        unique: true
    },
    coupon_status: {
        type: DataTypes.ENUM('AVAILABLE', 'UNAVAILABLE'),
        defaultValue: 'AVAILABLE'
    },
    coupon_condition: {
        type: DataTypes.CHAR(255),
        allowNull: true,
    }  },
{
tableName: 'Coupon',
  timestamps: false,
});

module.exports = Coupon;