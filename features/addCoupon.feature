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

  Scenario: Coupon code is available
    Given a coupon code "NEWCODE"
    When I check the availability of the coupon code
    Then I should get a success message "Code is available"

  Scenario: Coupon code already exists
    Given a coupon code "EXISTINGCODE"
    When I check the availability of the coupon code
    Then I should get an error message "Coupon code is already exist"

  