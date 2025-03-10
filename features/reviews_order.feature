Feature: Product Reviews

  Scenario: Customer can review a delivered product
    Given a customer has an order in which delivery_status of that order is "sent the packet"
    When customer wants to comment on a product in that order
    Then customer should be able to submit a review

  Scenario: Customer edits an existing review
    Given a customer already commented on the product
    When customer tries to edit the review
    Then the comment is updated successfully

  Scenario: Customer reviews a product that has no reviews
    Given a product with no review
    When customer comments something
    Then the product's first review should be the comment provided by the customer
