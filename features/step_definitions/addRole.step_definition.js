const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const User = require('../../src/models/User')
const axios = require('axios');
const { response } = require('express');

this.response=null;
// Step to ensure that the user is an owner (you might want to handle authentication in a more complex way)
Given('I am an owner', function () {
  console.log("Log in as Owner")
});

When('Check if username {string} is not taken', async function (username)
  {
    const response = await fetch(`http://localhost:13889/check-username/${username}`);
    assert.strictEqual(response.status, 200, 'Username should be available');
  });


// Step to add a new admin
When('I add a new admin with username {string}', async function (username) {
  userData = {
    username,
    name: 'Test',
    lastname: 'User',
    phone_number: '1234567890',
    password: 'password123',
    email: 'testuser@example.com',
    address: '123 Test St.',
    house_details: 'House 1',
    name_road: 'Test Road',
    district: 'Test District',
    province: 'Test Province',
    postal_code: '12345',
    role: 'admin'
  };
      const response = await fetch("http://localhost:13889/register-admin-staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      assert.strictEqual(response.status, 201, 'User registered successfully!');
});

// Step to confirm the new admin was added with the correct role in the database
Then('{string} will be added to the user table in the database with the {string} role.', async function (username,role) {
  const user = await User.findOne({ where: { username } });
  assert(user, 'User should be found in the database');
  assert.strictEqual(user.role, role, 'User role should be admin');
});


When('I delete {string}', async function(username) {
  const deleteUser = await User.findOne({ where: { username } });
  const response = await axios.delete(`http://localhost:13889/delete-user/${deleteUser.user_id}`);
  assert.strictEqual(response.status, 200, 'User deleted successfully');
});

Then('{string} should disappear from the user table in the database.', async function (username) {
  const user = await User.findOne({ where: { username } });
  assert.strictEqual(user, null, 'User should not be found in the database');
});


// Step to add a new admin
When('I add an already existed admin with username {string}', async function (username) {
  userData = {
    username,
    name: 'Test',
    lastname: 'User',
    phone_number: '1234567890',
    password: 'password123',
    email: 'testuser@example.com',
    address: '123 Test St.',
    house_details: 'House 1',
    name_road: 'Test Road',
    district: 'Test District',
    province: 'Test Province',
    postal_code: '12345',
    role: 'admin'
  };
      this.response = await fetch("http://localhost:13889/register-admin-staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

});

Then('I should fail.', function () {
  assert.notStrictEqual(this.response.status, 400, 'User should not be created again');
});
