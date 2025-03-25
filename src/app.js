const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const http = require('http');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

// Load environment 
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// const Receipt = require('../models/receipt');
app.use(express.static(path.join(__dirname, '../public')));
// app.get('/receipt/:orderId', async (req, res) => {
//   try {
//     const orderId = parseInt(req.params.orderId, 10);
//     console.log('Fetching receipt for order ID:', orderId); // Debugging line

//     const receipt = await Receipt.findOne({ where: { order_id: orderId } });
//     if (!receipt) {
//       console.warn(`Receipt not found for order ID: ${orderId}`); // Debugging line
//       return res.status(404).send({ error: 'Receipt not found' });
//     }
//     console.log('Receipt found:', receipt); // Debugging line

//     res.status(200).send({ receiptPath: receipt.Receipt_path });
//   } catch (error) {
//     console.error('Error fetching receipt:', error);
//     res.status(500).send({ error: 'Failed to fetch receipt' });
//   }
// });


const sequelize = require('./config/database');


require('./models/associations');
require('app-module-path').addPath(__dirname);
require('events').EventEmitter.defaultMaxListeners = 15;


const orderController = require('./controllers/orderController');
const productController = require('./controllers/productController');
const userController = require('./controllers/userController');
const cartController = require('./controllers/cartController'); 
const couponController = require('./controllers/couponController');
const deliveredOrderController = require('./controllers/deliveredOrderController');
const reviewController = require('./controllers/reviewController')


const Order = require('./models/Order');
// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images')); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Keep original extension
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`); // Create unique filename
  },
});
const upload = multer({ storage: storage });

app.post('/upload/:orderId', upload.single('image'), async (req, res) => {
  try {
    const { orderId } = req.params;
    const filePath = `/images/${req.file.filename}`; // Path to save in DB

    // Find the order and update the slip_payment field
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    order.slip_payment = filePath; // Update the image path in the order
    await order.save(); // Save the updated order

    res.status(200).json({
      message: 'Image uploaded and order updated successfully!',
      filePath,
    });
  } catch (error) {
    console.error('Error uploading image and updating order:', error);
    res.status(500).json({ message: 'Failed to upload image and update order.', error });
  }
});


app.post('/register', userController.registerUser);
app.post('/products', upload.single('image'), productController.addProduct);
app.get('/products', productController.getAllProducts);
app.get('/products/:lot_id/:grade', productController.getProduct);
app.get('/cart/:userId', cartController.getCart);
app.post('/cart/:userId', cartController.addItemToCart); 
app.delete('/cart/:userId/clear', cartController.clearCart);
app.patch('/cart/item/:productInCartId', cartController.updateCartItemAmount);
app.delete('/cart/item/:productInCartId', cartController.deleteCartItem);
app.post('/order/:userId/payall', orderController.placeOrder);
app.get('/order/:orderId', orderController.getOrderWithUser);
app.delete('/order/:orderId', orderController.deleteOrder);
app.get('/orders', orderController.getAllOrders);
app.delete('/cart/clearitems/:cartId', cartController.deleteProductsByCartId);
app.get('/order/detail/:orderId', orderController.getOrderDetails);
app.get('/check-username/:username', userController.checkUsername);
app.post('/login', userController.loginUser);
app.get('/user/:userId', userController.getUserById);
app.get('/orders/user/:userId', orderController.getOrdersByUserId);
app.get('/allproductslist', productController.getProductsList);
app.get('/allusers', userController.getAllUsers);
app.post('/orders/updatePaymentStatus', orderController.updatePaymentStatus);
app.post('/orders/updatedeliveryStatus', orderController.updatedeliveryStatus);
app.post('/orders/updateStatusLedger', orderController.updateStatusLedger);
app.post('/orders/updatePackedStatus', orderController.updatePackedStatus);
// app.post('/orders/createreceipt', orderController.createreceipt);
app.get('/sales-summary/:month', productController.getMonthlySalesSummary);
app.get('/income-summary', productController.getIncomeSummary);
app.get('/coupon', couponController.getAllCoupons);
app.post('/coupon/createCoupon', couponController.addCoupon);
app.get('/coupon/check-coupon/:coupon_code', couponController.checkCouponCode);
app.get('/coupon/available-coupon', couponController.getAvailableCoupons);
app.post('/coupon/check-coupon-condition', couponController.validateCouponUsage);
app.get('/coupon/get-coupon-by-id/:coupon_id', couponController.getCouponById);
app.put('/coupon/reActivateCoupon/:coupon_id', couponController.reActivateCoupon);
app.put('/coupon/disableCoupon/:coupon_id', couponController.disableCoupon);
app.delete('/coupon/delete-coupon/:coupon_code', couponController.deleteCouponByCode);
app.get('/coupon/get-coupon-by-code/:coupon_code', couponController.getCouponByCode);
app.post('/coupon/coupon-discount', couponController.calculateDiscountedPrice);
app.post('/delivered-orders',deliveredOrderController.addDelivery);
app.get('/delivered-orders', deliveredOrderController.getAllDeliveredOrders);
app.get('/delivered-order/:deliver_id', deliveredOrderController.getDeliveredOrderDetails);
app.post('/register-admin-staff', userController.addAdminAndStaff);
app.delete('/delete-user/:staffId', userController.deleteUserById);
app.get('/cart/:userId/item-count', cartController.getCartItemCount);

app.post('/reviews/create', reviewController.createReview);
app.put('/reviews/feedback/:review_id', reviewController.updateReviewFeedback);
app.get('/reviews/:review_id', reviewController.getReviewsByID);
app.get('/reviews', reviewController.getReviewsAll);
app.put('/reviews/edit/:review_id', reviewController.updateReview);
app.get('/reviews1/average-rating', reviewController.getAverageRating);


app.delete('/delivered-order/:deliver_id', deliveredOrderController.deleteDeliveredOrderById);
const server = http.createServer(app);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});


const PORT = process.env.PORT || 13889;
sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to sync database:', error);
});