// const Cart = require('./Cart');
// const CartItem = require('./CartItem');
// const Product = require('./Product');
// const Order = require('./Order'); // Import Order model
// const OrderLine = require('./OrderLine'); // Import OrderLine model
// const User = require('./User');

// // Define associations
// Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items' });
// CartItem.belongsTo(Cart, { foreignKey: 'cart_id', as: 'cart' });
// CartItem.belongsTo(Product, { foreignKey: 'lot_id', targetKey: 'lot_id', as: 'product' });

// Order.hasMany(OrderLine, { foreignKey: 'order_id', as: 'orderLines' });
// OrderLine.belongsTo(Order, { foreignKey: 'order_id', as: 'orders' });

// // Associate Order with User
// Order.belongsTo(User, { as: 'user', foreignKey: 'user_id' });

// module.exports = { Cart, CartItem, Product, Order, OrderLine, User };


// association.js
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Product = require('./Product');
const Order = require('./Order');
const OrderLine = require('./OrderLine');
const User = require('./User');

// Define associations
Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items' });

// Order and OrderLine association
Order.hasMany(OrderLine, { foreignKey: 'order_id', as: 'orderLines' });





module.exports = { Cart, CartItem, Product, Order, OrderLine, User };
