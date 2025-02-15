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

Given('I am a {string} {string}', async function (role, username) {
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
  const user = await User.findOne({ where: { username } });
  assert(user, 'User should be found in the database');
  assert.strictEqual(user.role, role, 'User role should be packaging staff');
});

Given('I have an order with order_id {string}', async function (orderId) {
  this.order = await fetch(`http://localhost:13889/order/${orderId}`);
  assert.strictEqual(this.order.status, 200, 'Order should be available');
});

When('packaging staff {string} add a ems code {string} to order with order_id {string}', async function (username, ems_code, order_id) {
  const user = await User.findOne({ where: { username } });
  const staff_id = parseInt(user.user_id, 10);

  const data = {
    order_id: parseInt(order_id, 10),
    ems_code: ems_code,
    staff_id: staff_id,
  };

  const response = await fetch('http://localhost:13889/delivered-orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  assert.strictEqual(response.status, 201);
});

Then('A delivery order with order_id {string} and ems code {string} will be added to the deliveryOrder table in the database', async function (orderId, ems_code) {
  const response = await axios.get('http://localhost:13889/delivered-orders');
  const allDelivery = response.data;
  const delivery = allDelivery.find(order => order.order_id === parseInt(orderId, 10) && order.ems_code === ems_code);
  assert(delivery, 'Delivery Order should be found in the database');
});

After(async function () {
  // Ensure to delete both the order and the user if they exist
  const orderToDelete = await DeliveredOrder.findOne({
    where: {
      order_id: 52,
      ems_code: 'EMS1234567890',
    },
  });

  const userToDelete = await User.findOne({ where: { username: 'package_user1' } });

  if (orderToDelete) {
    const response = await axios.delete(`http://localhost:13889/delivered-order/${orderToDelete.deliver_id}`);
    assert.strictEqual(response.status, 200, 'Delivery Order deleted successfully');
  }

  if (userToDelete) {
    const response = await axios.delete(`http://localhost:13889/delete-user/${userToDelete.user_id}`);
    assert.strictEqual(response.status, 200, 'User deleted successfully');
  }
});
