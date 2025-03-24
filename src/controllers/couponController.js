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

exports.getCouponById = async (req, res) => {
    const { coupon_id } = req.params;
    console.log("Received coupon_id:", coupon_id); 

    try {
        const coupon = await Coupon.findOne({ where: { coupon_id } });

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
    const coupon_status = "AVAILABLE";
    console.log("Received coupon_status:", coupon_status);

    try {
        const availableCoupons = await Coupon.findAll({ where: { coupon_status } });
        res.status(200).json(availableCoupons);
    } catch (error) {
        console.error('Error fetching available coupons:', error);
        res.status(500).json({ message: 'Failed to fetch available coupons' });
    }
};

//disable function section

exports.disableCoupon = async (req, res) => {
    const { coupon_id } = req.params;
    console.log("Received coupon_id:", coupon_id);

    try {
        const coupon = await Coupon.findOne({ where: { coupon_id } });

        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        await coupon.update({ coupon_status: "UNAVAILABLE" }); // Updating status
        res.status(200).json({ message: "Coupon disabled successfully!" });
    } catch (error) {
        console.error('Error disabling coupon:', error);
        res.status(500).json({ message: 'Failed to disable coupon' });
    }
};

exports.reActivateCoupon = async (req, res) => {
    const { coupon_id } = req.params;
    console.log("Received coupon_id:", coupon_id);

    try {
        const coupon = await Coupon.findOne({ where: { coupon_id } });

        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        await coupon.update({ coupon_status: "AVAILABLE" }); // Updating status
        res.status(200).json({ message: "Coupon reactivate successfully!" });
    } catch (error) {
        console.error('Error reactivating coupon:', error);
        res.status(500).json({ message: 'Failed to reactivate coupon' });
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
        const existingCoupon = await Coupon.findOne({ where: { coupon_code } });

        if (existingCoupon) {
            return res.status(409).json({ message: 'Coupon code already exists' });
        }

        // Validate required fields
        if (!coupon_condition || coupon_condition.trim() === '') {
            return res.status(400).json({ message: 'Coupon condition field is not inputted.' });
        }

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

exports.calculateDiscountedPrice = async (req, res) => {
    const { original_price, coupon_code } = req.body;

    try {
        const coupon = await Coupon.findOne({ where: { coupon_code, coupon_status: "AVAILABLE" } });

        if (!coupon) {
            return res.status(404).json({ message: "This coupon code is not available anymore, the discount will not be applied." });
        }

        // Extract discount percentage (ensure the format is correct in DB)
        const discountMatch = coupon.discount_details.match(/(\d+)%/);
        if (!discountMatch) {
            return res.status(400).json({ message: "Invalid discount format" });
        }

        const discountPercent = parseFloat(discountMatch[1]);
        const discountedPrice = original_price - (original_price * (discountPercent / 100));

        res.status(200).json({ 
            message: "Discount applied successfully",
            original_price, 
            discount: `${discountPercent}%`, 
            discounted_price: discountedPrice.toFixed(2)
        });

    } catch (error) {
        console.error("Error calculating discount:", error);
        res.status(500).json({ message: "Failed to calculate discount" });
    }
};

exports.validateCouponUsage = async (req, res) => {
    const { total_price, total_products, coupon_code } = req.body;

    try {
        const coupon = await Coupon.findOne({ where: { coupon_code } });

        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        // Ensure condition extraction works for different formats
        let minPurchaseRequirement = null;
        let minProductRequirement = null;

        if (coupon.coupon_condition) {
            const amountMatch = coupon.coupon_condition.match(/([\d,]+(?:\.\d+)?)\s*(?:baht|บาท|thb|THB|B|฿)/i);
    
            // Look for product quantities with various formats
            const productMatch = coupon.coupon_condition.match(/(\d+)\s*(?:product|products|item|items)/i);

            minPurchaseRequirement = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null;
            minProductRequirement = productMatch ? parseInt(productMatch[1]) : null;
        }

        // Debugging logs
        console.log("Coupon Condition:", coupon.coupon_condition);
        console.log("Extracted Min Purchase Requirement:", minPurchaseRequirement);
        console.log("Extracted Min Product Requirement:", minProductRequirement);
        console.log("Order Amount:", total_price);
        console.log("Total Products:", total_products);

        // Validate order amount
        if (minPurchaseRequirement !== null && total_price < minPurchaseRequirement) {
            return res.status(400).json({ 
                message: `Order does not meet the minimum purchase requirement of ${minPurchaseRequirement} baht.` 
            });
        }

        // Validate product count
        if (minProductRequirement !== null && total_products < minProductRequirement) {
            return res.status(400).json({ 
                message: `Order must contain at least ${minProductRequirement} products.` 
            });
        }

        res.status(200).json({ 
            message: "Coupon can be applied",
            total_price,
            total_products,
            conditions: coupon.coupon_condition
        });

    } catch (error) {
        console.error("Error validating coupon usage:", error);
        res.status(500).json({ message: "Failed to validate coupon" });
    }
};

exports.deleteCouponByCode = async (req, res) => {
    const { coupon_code } = req.params;
  
    try {
      const coupon = await Coupon.findByPk(coupon_code);
      if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
  
       await coupon.destroy();
       return res.status(200).json({ message: 'Coupon deleted successfully' });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };