const { Given, When, Then, After } = require('@cucumber/cucumber');
const assert = require('assert');
const User = require('../../src/models/User');
const DeliveredOrder = require('../../src/models/DeliveredOrder');
const axios = require('axios');

When('I add a new packaging staff with username {string}', async function (username) {
  const userData = {
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
    role: 'packaging staff',
  };

  const response = await fetch('http://localhost:13889/register-admin-staff', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  assert.strictEqual(response.status, 201, 'User registered successfully!');
});



After(async function () {


  const userToDelete = await User.findOne({ where: { username: 'package_user1' } });

  if (userToDelete) {
    const response = await axios.delete(`http://localhost:13889/delete-user/${userToDelete.user_id}`);
    assert.strictEqual(response.status, 200, 'User deleted successfully');
  }
});
