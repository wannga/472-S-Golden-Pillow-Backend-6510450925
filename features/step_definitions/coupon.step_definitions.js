const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');

let response = {};
let order = {};

// Given steps
Given('I am on the Create Coupon Page', function () {
    console.log("Navigating to the Create Coupon Page (UI testing skipped)");
});

Given('I am an admin', function () {
    console.log("Admin is authenticated (assuming authentication is handled separately).");
});

Given('a coupon code {string}', function (code) {
    coupon_code = code;
});

Given('customer has a coupon', function () {
    console.log("customer has coupon");
});

Given('a customer has {int} products in the order and customer has a coupon with condition saying the order has to have more than {int} products', function (totalProducts, requiredProducts) {
    order = {
        coupon_code: "TEST10",
        total_products: totalProducts,
        total_price: 1000 // Adding a default order amount
    };
    this.requiredProducts = requiredProducts;
});

Given('a customer already used a coupon for the order', function () {
    order = {
        coupon_code: "OLD10",
        total_price: 1000,
        total_products: 5
    };
});

//When steps
When('I enter {string} in the discount field', function (discount) {
    this.couponData = this.couponData || {};
    this.couponData.discount_details = discount;
});

When('I enter {string} in the coupon code field', function (couponCode) {
    this.couponData = this.couponData || {};
    this.couponData.coupon_code = couponCode;
});

When('I enter {string} in the coupon condition field', function (couponCondition) {
    this.couponData = this.couponData || {};
    this.couponData.coupon_condition = couponCondition;
});

When('I click the confirm button in createCouponPage', async function () {
    this.couponData = {
        discount_details: this.couponData.discount_details || "",
        coupon_code: this.couponData.coupon_code || "",
        coupon_condition: this.couponData.coupon_condition || "",
        coupon_status: this.couponData.coupon_status || "AVAILABLE",
    };

    try {
        const response = await fetch('http://localhost:13889/coupon/createCoupon', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.couponData),
        });

        this.response = {
            status: response.status,
            data: await response.json(),
        };
    } catch (error) {
        this.response = { status: 500, data: { message: 'Internal Server Error' } };
    }
});

When('I check the availability of the coupon code', async function () {
    const coupon_code = "TEST";
    try {
        response = await axios.get(`http://localhost:13889/coupon/check-coupon/${coupon_code}`);
    } catch (error) {
        response = error.response;
    }
});

When('the customer makes an order with total price = {int} Baht', function (totalPrice) {
    order.original_price = totalPrice;
});

When('the customer uses a {int}% discount coupon code and the order placed meets the coupon condition', async function (discount) {
    try {
        // First validate the coupon usage
        await axios.post('http://localhost:13889/coupon/check-coupon-condition', {
            total_price: 3200,
            total_products: order.total_products || 5,
            coupon_code: "SECOND"
        });
        
        // Then calculate the discount
        response = await axios.post('http://localhost:13889/coupon/coupon-discount', {
            original_price: 3200,
            coupon_code: "SECOND"
        });
    } catch (error) {
        response = error.response;
    }
});

When('the order placed does not meets the coupon condition', async function () {
    try {
        response = await axios.post('http://localhost:13889/coupon/check-coupon-condition', {
            total_price: 1000,
            total_products: 1,
            coupon_code: "5ORMORE"
        });
    } catch (error) {
        response = error.response;
    }
});

When('customer want to add another coupon code', async function () { 
    try {
        // First validate the new coupon
        await axios.post('http://localhost:13889/coupon/check-coupon-condition', {
            total_price: 2900,
            total_products: 4,
            coupon_code: "TENTEN",
        });
        
        // Then calculate discount with the new coupon
        response = await axios.post('http://localhost:13889/coupon/coupon-discount', {
            original_price: 2900,
            coupon_code: "TENTEN",
        });
    } catch (error) {
        response = error.response;
    }
});

When('customer apply coupon code which admin had changed the status of that coupon to “NOT AVAILABLE”', async function () {
    try {
        response = await axios.post('http://localhost:13889/coupon/coupon-discount', {
            original_price: 1000,
            coupon_code: "CANTUSE",
        });
    } catch (error) {
        response = error.response;
    }
});

When('I changed the status of coupon id {int} to “NOT AVAILABLE”', async function (coupon_id) {
    response = await axios.put(`http://localhost:13889/coupon/disableCoupon/${coupon_id}`, {
    });
});

When('I changed the status of coupon id {int} to “AVAILABLE”', async function (coupon_id) {
    response = await axios.put(`http://localhost:13889/coupon/reActivateCoupon/${coupon_id}`, {
    });
});

When('I delete coupon {string}', async function(coupon_code) {
    const coupon = await axios.get(`http://localhost:13889/coupon`);
    const deleteCoupon = await coupon.findOne({ where: { coupon_code } });
    const response = await axios.delete(`http://localhost:13889/delete-coupon/${deleteCoupon.coupon_code}`);
    assert.strictEqual(response.status, 200, 'coupon deleted successfully');
  });

When('I see a success message {string}', function (expectedMessage) {
    assert.ok(this.response, 'Response is undefined');
    assert.strictEqual(this.response.status, 201, 'Expected status 201 for successful coupon creation');
    assert.strictEqual(this.response.data.message, expectedMessage, `Expected message: "${expectedMessage}", but got "${this.response.data.message}"`);
});

// Then steps
Then('the coupon should be successfully added to the system.', function () {
    assert.strictEqual(response.status, 201, 'Expected status 201 for successful coupon creation');
    assert.strictEqual(response.data.message, 'Coupon created successfully!', 'Unexpected success message');
});

Then('I should receive an error message saying {string}', function (expectedMessage) {
    if (expectedMessage === "Coupon code already exists") {
        assert.strictEqual(this.response.status, 409, `Expected 409, but got ${this.response.status}`);
    } else if (expectedMessage === "coupon condition field is not inputted.") {
        assert.strictEqual(response.status, 400, 'Expected status 400 for validation error');
    }
});

Then('I should get a success message {string}', function (expectedMessage) {
    assert.strictEqual(response.status, 200, 'Expected status 200 for available coupon');
    assert.strictEqual(response.data.message, expectedMessage, 'Unexpected message for available coupon');
});

Then('I should get an error message {string}', function (expectedMessage) {
    assert.strictEqual(response.status, 409, 'Expected status 409 for duplicate coupon');
    assert.strictEqual(response.data.message, expectedMessage, 'Unexpected message for duplicate coupon');
});

Then('the total price of the order will decrease to {int} Baht.', function (expectedTotal) {
    assert.strictEqual(response.status, 200, 'Expected status 200 for successful discount calculation');
    assert.strictEqual(parseFloat(response.data.discounted_price), expectedTotal, 'Discount calculation is incorrect');
});

Then('the customer should get error message as {string}', function (expectedMessage) {
    assert.strictEqual(response.status, 400, 'Expected status 400 for validation error');
});

Then('the coupon used for the order would be changed to the new one and discard the old one.', function () {
    assert.strictEqual(response.status, 200, 'Expected status 200 for successful discount calculation');
});

Then('the customer should get error message as “This coupon code is not available anymore, the discount will not be applied.”', function () {
    assert.strictEqual(response.status, 404);
    assert.strictEqual(response.data.message, 'This coupon code is not available anymore, the discount will not be applied.');
});

Then('coupon id {int} status will be “UNAVAILABLE"', async function (coupon_id) {
    const response = await axios.get(`http://localhost:13889/coupon/get-coupon-by-id/${coupon_id}`);
    assert.strictEqual(response.data.coupon_status, 'UNAVAILABLE');

});

Then('coupon id {int} status will be “AVAILABLE”', async function (coupon_id) {
    const response = await axios.get(`http://localhost:13889/coupon/get-coupon-by-id/${coupon_id}`);
    assert.strictEqual(response.data.coupon_status, 'AVAILABLE');
});

Then('coupon {string} should disappear from the user table in the database', async function (coupon_code) {
    const response = await axios.get(`http://localhost:13889/coupon`);

    const coupon = await response.data.findOne({ where: { coupon_code } });
    assert.strictEqual(coupon, null, 'Coupon should not be found in the database');
  });