Feature: Add/Delete Packaging Staff Role
    As an owner, I want to be able to add or remove packaging staff, so that I can manage packaging staff users in the system.

    Scenario: Add a new packaging staff
        Given I am an owner
        When Check if username "package_user1" is not taken
        And I add a new packaging staff with username "package_user1"
        Then "package_user1" will be added to the user table in the database with the "packaging staff" role.



    Scenario: Delete an existing packaging staff
        Given I am an owner
        And I add a new packaging staff with username "package_user2"
        And "package_user2" will be added to the user table in the database with the "packaging staff" role.
        When I delete "package_user2"
        Then "package_user2" should disappear from the user table in the database.


    Scenario: Adding an ems code to order
        Given I am a "packaging staff" "package_user1"
        And I have an order with order_id "52"
        When packaging staff "package_user1" add a ems code "EMS1234567890" to order with order_id "52"
        Then A delivery order with order_id "52" and ems code "EMS1234567890" will be added to the deliveryOrder table in the database

