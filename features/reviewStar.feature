Feature: Product Review System

  Scenario: Calculate the average rating after a new review
    Given a customer has an order in which delivery_status of that order is "Delivered"
    And the product in that order already has reviews with 4, 3, and 5 stars
    When the customer rates the product with 5 stars
    Then the star average should be 4.25 stars

  Scenario: Prevent duplicate reviews from the same customer
    Given a customer already rated the product
    When the customer tries to rate it again
    Then the customer will get an error message saying, "You already rate this product in this order."

  Scenario: Allow customers to review purchased products
    Given a customer has an account
    When the customer buys a product
    Then the customer should be able to rate it
