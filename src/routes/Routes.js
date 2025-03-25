// routes.js
const express = require('express');
const router = express.Router();
const userController = require('../src/controllers/userController');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const couponController = require('../controllers/couponController');



router.get('/products', productController.getAllProducts);

router.post('/register', userController.validateUserRegistration, userController.registerUser);

router.post('/login', userController.loginUser);
router.get('/cart/:userId', cartController.getCartItems);
router.delete('/cart/:productId', cartController.removeFromCart);

router.get('./coupon', couponController.getAllCoupons);

module.exports = router;