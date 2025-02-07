const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coupon = sequelize.define('Coupon', {
    discount_details: {
        type: DataTypes.VARCHAR,
        allowNull: false,
    },
    coupon_code: {
        type: DataTypes.VARCHAR,
        allowNull: false,
        unique: true
    },
    coupon_status: {
        type: DataTypes.ENUM('AVAILABLE', 'UNAVAILABLE'),
        defaultValue: 'AVAILABLE'
    },
    coupon_condition: {
        type: DataTypes.VARCHAR,
    }
});

module.exports = Coupon;
