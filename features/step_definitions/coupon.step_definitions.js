// const { Given, When, Then } = require('@cucumber/cucumber');
// const assert = require('assert');
// const axios = require('axios');

// let response;
// let coupon_code;

// Given('I am on the Create Coupon Page', function () {
//     console.log("Navigating to the Create Coupon Page (UI testing skipped)");
// });

// When('I enter {string} in the discount details field', function (discount_details) {
//     console.log(`Entering discount details: ${discount_details}`);
// });

// When('I enter {string} in the coupon code field', function (code) {
//     coupon_code = code;
//     console.log(`Entering coupon code: ${coupon_code}`);
// });

// When('I enter {string} in the coupon condition field', function (coupon_condition) {
//     console.log(`Entering coupon condition: ${coupon_condition}`);
// });

// When('I click the confirm button', async function () {
//     try {
//         response = await axios.post('http://localhost:13889/coupon/create', {
//             coupon_code,
//             discount_details: '10% discount',
//             coupon_condition: 'Minimum purchase of 500 baht',
//             coupon_status: 'AVAILABLE',
//         });
//     } catch (error) {
//         response = error.response;
//     }
// });

// Then('I should see a success message {string}', function (message) {
//     assert.strictEqual(response.status, 200, 'Expected status 200 for success');
//     assert.strictEqual(response.data.message, message, 'Unexpected success message');
// });

// Given('a coupon code {string}', function (code) {
//     coupon_code = code;
// });

// When('I check the availability of the coupon code', async function () {
//     try {
//         response = await axios.get(`http://localhost:13889/coupon/check-coupon/${coupon_code}`);
//     } catch (error) {
//         response = error.response;
//     }
// });

// Then('I should get a success message {string}', function (expectedMessage) {
//     assert.strictEqual(response.status, 200, 'Expected status 200 for available coupon');
//     assert.strictEqual(response.data.message, expectedMessage, 'Unexpected message for available coupon');
// });

// Then('I should get an error message {string}', function (expectedMessage) {
//     assert.strictEqual(response.status, 409, 'Expected status 409 for duplicate coupon');
//     assert.strictEqual(response.data.message, expectedMessage, 'Unexpected message for duplicate coupon');
// });

// Given('I am an admin', function () {
//     console.log("Admin is authenticated (assuming authentication is handled separately).");
// });

// When('I enter the discount value, coupon code, coupon condition', function () {
//     couponData = {
//         coupon_code: 'TEST123',
//         discount_details: '10% off',
//         coupon_condition: 'Minimum purchase of 500 baht',
//         coupon_status: 'AVAILABLE',
//     };
// });

// When('I enter the coupon code that existed', function () {
//     couponData = {
//         coupon_code: 'EXISTINGCODE', // Assuming this code already exists
//         discount_details: '15% off',
//         coupon_condition: 'Minimum purchase of 1000 baht',
//         coupon_status: 'AVAILABLE',
//     };
// });

// When('I enter discount value, coupon code', function () {
//     couponData = {
//         coupon_code: 'NOCONDITION',
//         discount_details: '20% off',
//         coupon_condition: '', // Missing condition field
//         coupon_status: 'AVAILABLE',
//     };
// });

// When('I click the {string} button', async function (button) {
//     if (button === "Save") {
//         try {
//             response = await axios.post('http://localhost:13889/coupon/create', couponData);
//         } catch (error) {
//             response = error.response;
//         }
//     }
// });

// Then('The coupon should be successfully added to the system.', function () {
//     assert.strictEqual(response.status, 200, 'Expected status 200 for successful coupon creation');
//     assert.strictEqual(response.data.message, 'Coupon added successfully', 'Unexpected success message');
// });

// Then('I should receive an error message saying {string}', function (expectedMessage) {
//     assert.strictEqual(response.status, 409, 'Expected status 409 for duplicate coupon or validation error');
//     assert.strictEqual(response.data.message, expectedMessage, 'Unexpected error message');
// });

const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');

let response;
let coupon_code;
let discount_details;
let coupon_condition;
let couponData;

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

// When steps
When('I enter {string} in the discount field', function (discount_details) {
    this.discount_details = discount_details;
    console.log(`Entering discount details: ${discount_details}`);
});

When('I enter {string} in the coupon code field', function (code) {
    coupon_code = code;
    console.log(`Entering coupon code: ${coupon_code}`);
});

When('I enter {string} in the coupon condition field', function (coupon_condition) {
    this.coupon_condition = coupon_condition;
    console.log(`Entering coupon condition: ${coupon_condition}`);
});

When('I click the confirm button', async function () {
    try {
        response = await axios.post('http://localhost:13889/coupon/create', {
            coupon_code,
            discount_details: this.discount_details,
            coupon_condition: this.coupon_condition,
            coupon_status: 'AVAILABLE',
        });
    } catch (error) {
        response = error.response;
    }
});

When('I enter the discount value, coupon code, coupon condition', function () {
    couponData = {
        coupon_code: 'TEST123',
        discount_details: '15% off',
        coupon_condition: 'Minimum purchase of 300 baht',
        coupon_status: 'AVAILABLE',
    };
});

When('I enter the coupon code that existed', function () {
    couponData = {
        coupon_code: 'EXISTINGCODE', // Assuming this code already exists
        discount_details: '20% off',
        coupon_condition: 'Minimum purchase of 200 baht',
        coupon_status: 'AVAILABLE',
    };
});

When('I enter discount value, coupon code', function () {
    couponData = {
        coupon_code: 'NOCONDITION',
        discount_details: '25% off',
        coupon_condition: '', // Missing condition field
        coupon_status: 'AVAILABLE',
    };
});

When('I click the {string} button', async function (button) {
    if (button === "Save") {
        try {
            response = await axios.post('http://localhost:13889/coupon/create', couponData);
        } catch (error) {
            response = error.response;
        }
    }
});

When('I check the availability of the coupon code', async function () {
    try {
        response = await axios.get(`http://localhost:13889/coupon/check-coupon/${coupon_code}`);
    } catch (error) {
        response = error.response;
    }
});

// Then steps
Then('I should see a success message {string}', function (message) {
    assert.strictEqual(response.status, 200, 'Expected status 200 for success');
    assert.strictEqual(response.data.message, message, 'Unexpected success message');
});

Then('The coupon should be successfully added to the system.', function () {
    assert.strictEqual(response.status, 200, 'Expected status 200 for successful coupon creation');
    assert.strictEqual(response.data.message, 'Coupon created successfully!', 'Unexpected success message');
});

Then('I should receive an error message saying {string}', function (expectedMessage) {
    assert.strictEqual(response.status, 409, 'Expected status 409 for duplicate coupon or validation error');
    assert.strictEqual(response.data.message, expectedMessage, 'Unexpected error message');
});

Then('I should get a success message {string}', function (expectedMessage) {
    assert.strictEqual(response.status, 200, 'Expected status 200 for available coupon');
    assert.strictEqual(response.data.message, expectedMessage, 'Unexpected message for available coupon');
});

Then('I should get an error message {string}', function (expectedMessage) {
    assert.strictEqual(response.status, 409, 'Expected status 409 for duplicate coupon');
    assert.strictEqual(response.data.message, expectedMessage, 'Unexpected message for duplicate coupon');
});