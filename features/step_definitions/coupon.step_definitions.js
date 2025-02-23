const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');

let response;
let coupon_code;

Given('I am on the Create Coupon Page', function () {
    console.log("Navigating to the Create Coupon Page (UI testing skipped)");
});

When('I enter {string} in the discount details field', function (discount_details) {
    console.log(`Entering discount details: ${discount_details}`);
});

When('I enter {string} in the coupon code field', function (code) {
    coupon_code = code;
    console.log(`Entering coupon code: ${coupon_code}`);
});

When('I enter {string} in the coupon condition field', function (coupon_condition) {
    console.log(`Entering coupon condition: ${coupon_condition}`);
});

When('I click the confirm button', async function () {
    try {
        response = await axios.post('http://localhost:13889/coupon/create', {
            coupon_code,
            discount_details: '10% discount',
            coupon_condition: 'Minimum purchase of 500 baht',
            coupon_status: 'AVAILABLE',
        });
    } catch (error) {
        response = error.response;
    }
});

Then('I should see a success message {string}', function (message) {
    assert.strictEqual(response.status, 200, 'Expected status 200 for success');
    assert.strictEqual(response.data.message, message, 'Unexpected success message');
});

Given('a coupon code {string}', function (code) {
    coupon_code = code;
});

When('I check the availability of the coupon code', async function () {
    try {
        response = await axios.get(`http://localhost:13889/coupon/check-coupon/${coupon_code}`);
    } catch (error) {
        response = error.response;
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
