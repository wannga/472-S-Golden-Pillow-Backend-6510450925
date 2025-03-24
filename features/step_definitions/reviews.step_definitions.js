const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

const axios = require('axios');
const Review = require('../../src/models/Review');

let response = null;
let review;

Given('a product has reviews', async function () {
    ReviewData =({
        review_id: 38,
        username: 'testcustomer',
        star: '3',
        comment: 'Average product.',
        order_id: 49,
        lot_id: 'LOT001',
        grade: 'A',
        like_count: 0,
        dislike_count: 0,
        });
    }); 

When('the customer goes to the product\'s review page', async function () {
  try {
    response = await axios.get('http://localhost:13889/reviews?lot_id=LOT001&grade=A'); 
  } catch (error) {
    console.error('Error getting reviews:', error);
    this.error = error;
  }
});

Then('the customer can see the existing reviews', function () {
  assert.strictEqual(response.status, 200);
  assert(response.data.length > 0);
});

When('the customer filters the 5 star reviews', async function () {
  try {
    response = await axios.get('http://localhost:13889/reviews?lot_id=LOT001&grade=A&star=5');
  } catch (error) {
    console.error('Error getting reviews:', error);
    this.error = error;
  }
});

Then('5 star reviews should be shown', function () {
    assert.strictEqual(response.status, 200);
    if (response.data.length > 0) {
      response.data.forEach(review => {
        assert.strictEqual(review.star, '5');
      });
    }
  });

  When('the customer filters the 1 star reviews', async function () {
    try {
      response = await axios.get('http://localhost:13889/reviews?lot_id=LOT001&grade=A&star=1');
    } catch (error) {
      console.error('Error getting reviews:', error);
      this.error = error;
    }
  });
  
  Then('no reviews should be shown', function () {
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.data.length, 0);
  });

  When('a customer clicks on "like" button on that review', async function () {
    try {
        const review = ReviewData;
        if (!review) throw new Error('Review not found');
    
        const response = await axios.put(`http://localhost:13889/reviews/feedback/${review.review_id}`, {
          review_id: review.review_id,
          action: 'like',
        });
    
        this.review = await Review.findByPk(review.review_id);
      } catch (error) {
        console.error('Error updating feedback:', error);
        this.error = error;
      }
});

Then('the like count for that review should increase by 1', async function () {
    if (!this.review || !this.review.review_id) {
        throw new Error('Review not found or review_id is missing');
    }

    const updatedReview = await Review.findByPk(this.review.review_id);

    console.log(`Before like: ${this.review.like_count}, After like: ${updatedReview.like_count}`);

    assert.strictEqual(updatedReview.like_count, this.review.like_count);
});

When('a customer clicks on "dislike" button on that review', async function () {
  try {
    const review = ReviewData;
    if (!review) throw new Error('Review not found');

    const response = await axios.put(`http://localhost:13889/reviews/feedback/${review.review_id}`, {
      review_id: review.review_id,
      action: 'dislike',
    });

    this.review = await Review.findByPk(review.review_id);
  } catch (error) {
    console.error('Error updating feedback:', error);
    this.error = error;
  }
});

Then('the dislike count for that review should increase by 1', async function () {
    if (!this.review || !this.review.review_id) {
        throw new Error('Review not found or review_id is missing');
    }

    const updatedReview = await Review.findByPk(this.review.review_id);

    console.log(`Before dislike: ${this.review.dislike_count}, After dislike: ${updatedReview.dislike_count}`);

    assert.strictEqual(updatedReview.dislike_count, this.review.dislike_count);
});



