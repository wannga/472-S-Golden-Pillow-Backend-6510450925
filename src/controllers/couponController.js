const { validationResult } = require('express-validator');
const Coupon = require('../models/Coupon');

//get function section

exports.getAllCoupons = async (req, res) => {
    try {
        const coupon = await Coupon.findAll(); // Added await
        res.status(200).json(coupon);
    } catch (error) {
        console.error('Error fetching coupons:', error);
        res.status(500).json({ message: 'Failed to fetch coupons' });
    }
};

exports.getCouponByCode = async (req, res) => {
    const { coupon_code } = req.params;
    console.log("Received coupon_code:", coupon_code); 

    try {
        const coupon = await Coupon.findOne({ where: { coupon_code } });

        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" }); // Fixed typo
        }

        res.status(200).json(coupon);
    } catch (error) {
        console.error('Error fetching coupon:', error);
        res.status(500).json({ message: 'Failed to fetch coupon' });
    }
};

exports.getAvailableCoupons = async (req, res) => {
    const { coupon_status } = req.params;
    console.log("Received coupon_status:", coupon_status);

    try {
        const availableCoupons = await Coupon.findAll({ where: { coupon_status } }); // Changed findOne -> findAll
        res.status(200).json(availableCoupons);
    } catch (error) {
        console.error('Error fetching available coupons:', error);
        res.status(500).json({ message: 'Failed to fetch available coupons' });
    }
};

//delete function section

exports.disableCoupon = async (req, res) => {
    const { coupon_code } = req.params;
    console.log("Received coupon_code:", coupon_code);

    try {
        const coupon = await Coupon.findOne({ where: { coupon_code } });

        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        await coupon.update({ coupon_status: "disabled" }); // Updating status
        res.status(200).json({ message: "Coupon disabled successfully!" });
    } catch (error) {
        console.error('Error disabling coupon:', error);
        res.status(500).json({ message: 'Failed to disable coupon' });
    }
};

//add function section

exports.addCoupon = async (req, res) => {
    console.log("Received body:", req.body);  // Debugging log

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { discount_details, coupon_code, coupon_condition, coupon_status = "AVAILABLE" } = req.body;

    try {
        const newCoupon = await Coupon.create({
            discount_details,
            coupon_code,
            coupon_condition,
            coupon_status
        });

        res.status(201).json({ message: 'Coupon created successfully!', coupon: newCoupon });
    } catch (error) {
        console.error('Error creating coupon:', error.message);
        res.status(500).json({ message: 'An error occurred while creating the coupon', error: error.message });
    }  
};

exports.checkCouponCode = async (req, res) => {
    const { coupon_code } = req.params;
  
    try {
      const existingCoupon = await Coupon.findOne({ where: { coupon_code } });
  
      if (existingCoupon) {
        return res.status(409).json({ message: 'Coupon code is already exist' });
      }
  
      res.status(200).json({ message: 'Code is available' });
    } catch (error) {
      console.error('Error checking coupon code:', error);
      res.status(500).json({ error: 'An error occurred while checking the coupon code' });
    }
  };