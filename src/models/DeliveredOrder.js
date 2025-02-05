const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DeliveredOrder = sequelize.define('DeliveredOrder', { 
    ems_code: {
        type: DataTypes.STRING(13),
        autoIncrement: true,
        primaryKey: true,
      },
    staff_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Reference the Users table
          key: 'user_id',
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders', // Reference the Users table
          key: 'order_id',
        },
      },
})