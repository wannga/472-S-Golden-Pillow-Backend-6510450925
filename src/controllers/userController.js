// userController.js
const { body, validationResult } = require('express-validator');
const User = require('../models/User'); // Assuming Sequelize or similar ORM

// Validation function for user registration
exports.validateUserRegistration = [
  body('username').isString().isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  // Add other validation rules here...
];


exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords (no hashing applied here)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Send role along with the response
    res.status(200).json({ 
      message: 'Login successful', 
      user: { user_id: user.user_id, role: user.role } 
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



// Controller function for user registration
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    username, name, lastname, phone_number, password,
    email, address, house_details, name_road, district, province, postal_code
  } = req.body;

  try {
    // Create new user
    const newUser = await User.create({
      username,
      name,
      lastname,
      phone_number,
      role: 'client',
      password,
      email,
      address,
      house_details,
      name_road,
      district,
      province,
      postal_code,
    });

    // Create a cart for the new user
    await Cart.create({ user_id: newUser.user_id });

    res.status(201).json({ message: 'User registered and cart created successfully!' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'An error occurred while creating user and cart' });
  }
};

exports.checkUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(409).json({ message: 'Username is already taken' });
    }

    res.status(200).json({ message: 'Username is available' });
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ error: 'An error occurred while checking the username' });
  }
};

// userController.js
exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.findAll();
    
    // If users exist, return them as a response
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: 'No users found' });
    }
  } catch (error) {
    // Handle any errors
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};