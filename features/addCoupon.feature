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
    And I click the "Save" button
    Then The coupon should be successfully added to the system.

  Scenario: Save when coupon code already exists
    Given I am an admin 
    When I enter the coupon code that existed 
    And I click the “Save” Button 
    Then I should receive an error message saying "Coupon code already exists"

  Scenario: Check condition
    Given I am an admin When I enter discount value, coupon code 
    And I click the “Save” Button
    Then I should receive an error message saying "coupon condition field is not inputted.

  Scenario: Coupon code is available
    Given a coupon code "NEWCODE"
    When I check the availability of the coupon code
    Then I should get a success message "Code is available"

  Scenario: Coupon code already exists
    Given a coupon code "EXISTINGCODE"
    When I check the availability of the coupon code
    Then I should get an error message "Coupon code is already exist"

  