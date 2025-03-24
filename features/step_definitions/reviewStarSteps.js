const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const request = require('supertest');


let response;
let existingReviews = [4, 3, 5];
let order = { id: 1, delivery_status: "Delivered" };
let userHasReviewed = false;

Given('a customer has an order in which delivery_status of that order is {string}', function (status) {
    order.delivery_status = status;
});

Given('the product in that order already has reviews with {int}, {int}, and {int} stars', function (star1, star2, star3) {
    existingReviews = [star1, star2, star3];
});

When('the customer rates the product with {int} stars', async function (newRating) {
    existingReviews.push(newRating);
    const totalStars = existingReviews.reduce((sum, star) => sum + star, 0);
    this.averageRating = totalStars / existingReviews.length;
});

Then('the star average should be {float} stars', function (expectedAverage) {
    assert.strictEqual(this.averageRating, expectedAverage);
});

Given('a customer already rated the product', function () {
    userHasReviewed = true;
});

When('the customer tries to rate it again', async function () {
    if (userHasReviewed) {
        response = { status: 400, message: "You already rate this product in this order." };
    }
});

Then('the customer will get an error message saying, {string}', function (expectedMessage) {
    assert.strictEqual(response.message, expectedMessage);
});

Given('a customer has an account', function () {
    this.customerHasAccount = true;
});

When('the customer buys a product', function () {
    this.customerHasBoughtProduct = true;
});

Then('the customer should be able to rate it', function () {
    assert.strictEqual(this.customerHasAccount && this.customerHasBoughtProduct, true);
});
