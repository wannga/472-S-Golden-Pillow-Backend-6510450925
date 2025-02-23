Feature: Customer Review Management

  Scenario: View existing reviews
    Given a product has reviews 
    When the customer goes to the product's review page
    Then the customer can see the existing reviews

  Scenario: Filter reviews by star rating
    Given a product has reviews
    When the customer filters the 5 star reviews
    Then 5 star reviews should be shown

  Scenario: Filter reviews by star rating (no results)
    Given a product has reviews
    When the customer filters the 1 star reviews
    Then no reviews should be shown

  Scenario: Like a review
    Given a product has reviews
    When a customer clicks on "like" button on that review
    Then the like count for that review should increase by 1

  Scenario: Dislike a review
    Given a product has reviews
    When a customer clicks on "dislike" button on that review
    Then the dislike count for that review should increase by 1