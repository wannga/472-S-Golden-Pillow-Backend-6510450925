const { Given, When, Then, After } = require('@cucumber/cucumber');
const assert = require('assert');
const axios = require('axios');
const Review = require('../../src/models/Review');
const Order = require('../../src/models/Order');

let response = null;

After(async function () {
    if (this.order) {
        await Review.destroy({ where: { order_id: this.order.order_id } });
        await Order.destroy({ where: { order_id: this.order.order_id } });
    }
    if (this.review) {
        await Review.destroy({ where: { review_id: this.review.review_id } });
    }
});

// Scenario: Customer can review a delivered product
Given('a customer has an order in which delivery_status of that order is "sent the packet"', async function () {
    this.order = await Order.create({
        order_id: 1270,
        delivery_status: "sent the packet",
        user_id: 1,
        total_price: 12700,
        payment_status: "Approved",
        packed_status: "packed",
        order_date: new Date()
    });
});

When('customer wants to comment on a product in that order', async function () {
    try {
        response = await axios.post('http://localhost:13889/reviews/create', {
            order_id: this.order.order_id,
            lot_id: 'LOT001',
            grade: 'A',
            username: 'jonnybaboo',
            star: 5,
            comment: 'Great product!',
        });
    } catch (error) {
        console.error('Error creating review:', error);
        this.error = error;
    }
});

Then('customer should be able to submit a review', async function () {
    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.data.comment, 'Great product!');
    
    this.review = await Review.findOne({ where: { order_id: this.order.order_id } });
});

// Scenario: Customer edits an existing review
Given('a customer already commented on the product', async function () {
    this.review = await Review.create({
        review_id: 141,
        order_id: 46,
        lot_id: 'LOT001',
        grade: 'A',
        username: 'jonnybaboo',
        star: 4,
        comment: 'This is the updated test.',
    });
});

When('customer tries to edit the review', async function () {
    try {
        response = await axios.put(`http://localhost:13889/reviews/edit/${this.review.review_id}`, {
            username: 'jonnybaboo',
            star: 1,
            comment: 'Updated Comment test +1',
        });
    } catch (error) {
        console.error('Error updating review:', error);
        this.error = error;
    }
});

Then('the comment is updated successfully', async function () {
    const updatedReview = await Review.findByPk(this.review.review_id);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(updatedReview.comment, 'Updated Comment test +1');
});

// Scenario: Customer reviews a product that has no reviews
Given('a product with no review', async function () {
    this.product = {
        lot_id: 'Lot007',
        grade: 'C',
    };
});

When('customer comments something', async function () {
    try {
        response = await axios.post('http://localhost:13889/reviews/create', {
            order_id: 47,
            lot_id: this.product.lot_id,
            grade: this.product.grade,
            username: 'jonnybaboo',
            star: 3,
            comment: 'First review!',
        });
    } catch (error) {
        console.error('Error creating first review:', error);
        this.error = error;
    }
});

Then('the product\'s first review should be the comment provided by the customer', async function () {
    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.data.comment, 'First review!');
    
    this.review = await Review.findOne({ where: { order_id: 47 } });
});
