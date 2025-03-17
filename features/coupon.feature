Feature: Create Coupons
  As a user
  I want to create a new coupon
  So that I can apply discounts
  
  Scenario: Successfully create a coupon
    Given I am on the Create Coupon Page
    When I enter "10% discount" in the discount field
    And I enter "SECOND" in the coupon code field
    And I enter "Minimum purchase of 500 baht" in the coupon condition field
    And I click the confirm button
    Then I should see a success message "Coupon created successfully!"
  
  Scenario: Save creating coupon
    Given I am an admin
    When I enter the discount value, coupon code, coupon condition 
    And I click the "Confirm" button
    Then The coupon should be successfully added to the system.
  
  Scenario: Save when coupon code already exists
    Given I am an admin
    When I enter the coupon code that existed
    And I click the "Confirm" button
    Then I should receive an error message saying "Coupon code already exists"
  
  Scenario: Check condition
    Given I am an admin
    When I enter discount value, coupon code
    And I click the "Confirm" button
    Then I should receive an error message saying "Coupon condition field is not inputted."
  
  Scenario: Coupon code is available
    Given a coupon code "NEWCODE"
    When I check the availability of the coupon code
    Then I should get a success message "Code is available"
  
  Scenario: Coupon code already exists
    Given a coupon code "EXISTINGCODE"
    When I check the availability of the coupon code
    Then I should get an error message "Coupon code is already exist"
  
  Scenario: Successfully use a coupon for discount
    Given customer has a coupon
    When the customer makes an order with total price = 3200 Baht
    And the customer uses a 10% discount coupon code and the order placed meets the coupon condition
    Then the total price of the order will decrease to 2880 Baht.
  
  Scenario: Coupon does not meet condition
    Given a customer has 4 products in the order and customer has a coupon with condition saying the order has to have more than 6 products
    When the order placed does not meets the coupon condition
    Then the customer should get error message as "Order must contain at least 6 products."
  
  Scenario: customer already used a coupon
    Given a customer already used a coupon for the order
    When customer want to add another coupon code
    Then the coupon used for the order would be changed to the new one and discard the old one.