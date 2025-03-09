Feature: Add/Delete Admin Role
    As an owner, I want to be able to add or remove admins, so that I can manage admin users in the system.

    Scenario: Add a new admin
        Given I am an owner
        When Check if username "admin_user1" is not taken
        And I add a new admin with username "admin_user1"
        Then "admin_user1" will be added to the user table in the database with the "admin" role.


    Scenario: Delete an existing admin
        Given I am an owner
        And I add a new admin with username "admin_user2"
        And "admin_user2" will be added to the user table in the database with the "admin" role.
        When I delete "admin_user2"
        Then "admin_user2" should disappear from the user table in the database.
    
    Scenario: Adding an existing admin
        Given I am an owner
        And I add a new admin with username "admin_user3"
        And "admin_user3" will be added to the user table in the database with the "admin" role.
        When I add an already existed admin with username "admin_user3"
        Then I should fail.
