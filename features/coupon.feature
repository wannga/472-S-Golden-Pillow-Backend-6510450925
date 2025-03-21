Feature: Create Coupons
  As a user
  I want to create a new coupon
  So that I can apply discounts
  
  Scenario: Successfully create a coupon
    Given I am on the Create Coupon Page
    When I enter "10% discount" in the discount field
    And I enter "THIRD" in the coupon code field
    And I enter "Minimum purchase of 500 baht" in the coupon condition field
    And I click the confirm button in createCouponPage
    Then I should see a success message "Coupon created successfully!"
  
  Scenario: Save when coupon code already exists
    Given I am an admin
    When I enter "10% discount" in the discount field
    And I enter "SECOND" in the coupon code field
    And I enter "Minimum purchase of 500 baht" in the coupon condition field
    And I click the confirm button in createCouponPage
    Then I should receive an error message saying "Coupon code already exists"
  
  Scenario: Null condition when creating coupon
    Given I am an admin
    When I enter "10% discount" in the discount field
    And I enter "FOURTH" in the coupon code field
    And I click the confirm button in createCouponPage
    Then I should receive an error message saying "Coupon condition field is not inputted."
  
  Scenario: Successfully use a coupon for discount
    Given customer has a coupon
    When the customer makes an order with total price = 3200 Baht
    And the customer uses a 10% discount coupon code and the order placed meets the coupon condition
    Then the total price of the order will decrease to 2880 Baht.
  
  Scenario: Coupon does not meet condition
    Given a customer has 4 products in the order and customer has a coupon with condition saying the order has to have more than 6 products
    When the order placed does not meets the coupon condition
    Then the customer should get error message as "Order must contain at least 6 products."
  
  Scenario: Customer already used a coupon
    Given a customer already used a coupon for the order
    When customer want to add another coupon code
    Then the coupon used for the order would be changed to the new one and discard the old one.

  Scenario: Customer use a disabled coupon
    Given customer has a coupon
    When customer apply coupon code which admin had changed the status of that coupon to “NOT AVAILABLE”
    Then the customer should get error message as “This coupon code is not available anymore, the discount will not be applied.”

  Scenario: Admin disable coupon
    Given I am an admin
    When I changed the status of coupon id 1 to “NOT AVAILABLE”
    Then coupon id 1 status will be “UNAVAILABLE"

  Scenario: Admin reActivate coupon
    Given I am an admin
    When I changed the status of coupon id 1 to “AVAILABLE”
    Then coupon id 1 status will be “AVAILABLE”