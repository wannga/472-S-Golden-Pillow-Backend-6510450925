const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'Users',
        key: 'username'
      }
    },
    star: {
      type: DataTypes.ENUM('1', '2', '3', '4', '5'),
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    like_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    dislike_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'order_id'
      }
    },
    lot_id: {
      type: DataTypes.CHAR(10),
      allowNull: false
    },
    grade: {
      type: DataTypes.CHAR(1),
      allowNull: false
    }
  }, {
    tableName: 'reviews',
    timestamps: false,
  });
  
  // composite pk lot_id, grade in product
  Review.belongsTo(User, { foreignKey: 'username' });
  Review.belongsTo(Order, { foreignKey: 'order_id' });
  Review.belongsTo(Product, { foreignKey: ['lot_id', 'grade'] });
  
module.exports = Review;