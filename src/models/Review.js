const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Order = require('./Order');
const Product = require('./Product');

const Review = sequelize.define('Review', {
  review_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    references: {
      model: User,
      key: 'username',
    },
  },
  star: {
    type: DataTypes.ENUM('1', '2', '3', '4', '5'),
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  like_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  dislike_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: 'order_id',
    },
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
  tableName: 'reviews',
  timestamps: false,
  // indexes: [
  //   {
  //     unique: false,
  //     name: 'reviews_username_order_id_lot_id_grade',
  //     fields: ['username', 'order_id', 'lot_id', 'grade'],
  //   },
  // ],
});

// Relationships
Review.belongsTo(User, { foreignKey: 'username' });
Review.belongsTo(Order, { foreignKey: 'order_id' });
Review.belongsTo(Product, { foreignKey: 'lot_id' });
Review.belongsTo(Product, { foreignKey: 'grade' });

module.exports = Review;