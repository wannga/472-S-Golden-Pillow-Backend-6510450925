Feature: Add/Delete Delivering Staff Role
    As an owner, I want to be able to add or remove delivering staff, so that I can manage delivering staff users in the system.

    Scenario: Add a new delivering staff
        Given I am an owner
        When Check if username "deliver_user1" is not taken
        And I add a new delivering staff with username "deliver_user1"
        Then "deliver_user1" will be added to the user table in the database with the "delivering staff" role.



    Scenario: Delete an existing delivering staff
        Given I am an owner
        And I add a new delivering staff with username "deliver_user2"
        And "deliver_user2" will be added to the user table in the database with the "delivering staff" role.
        When I delete "deliver_user2"
        Then "deliver_user2" should disappear from the user table in the database.


    Scenario: Adding an ems code to order
        Given I am a "delivering staff" "deliver_user1"
        And I have an order with order_id "52"
        When delivering staff "deliver_user1" add a ems code "EMS1234567890" to order with order_id "52"
        Then A delivery order with order_id "52" and ems code "EMS1234567890" will be added to the deliveryOrder table in the database

