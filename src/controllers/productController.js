// productController.js
const { Op } = require('sequelize');
const Order = require('../models/Order'); 
const OrderLine = require('../models/OrderLine');
const Product = require('../models/Product');
const moment = require('moment');

exports.getIncomeSummary = async (req, res) => {
  try {
    const year = 2024; // You can make this dynamic based on your needs.
    const incomeSummary = [];

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      
      // Fetch total income for the month
      const income = await Order.sum('total_price', {
        where: {
          order_date: {
            [Op.between]: [startDate, endDate]
          }
        }
      }) || 0;

      incomeSummary.push({ month: monthNames[month], totalIncome: income });
    }

    res.status(200).json(incomeSummary);
  } catch (error) {
    console.error('Error fetching income summary:', error);
    res.status(500).send({ error: 'Failed to fetch income summary' });
  }
};



exports.getMonthlySalesSummary = async (req, res) => {
  try {
    const { month } = req.params; // Expected to be in 'YYYY-MM' format
    const startDate = moment(month, 'YYYY-MM').startOf('month').format('YYYY-MM-DD');
    const endDate = moment(month, 'YYYY-MM').endOf('month').format('YYYY-MM-DD');

    // Find orders placed in the given month
    const orders = await Order.findAll({
      where: {
        order_date: {
          [Op.between]: [startDate, endDate] // Get all orders between the start and end of the month
        }
      },
      include: [
        {
          model: OrderLine,
          as: 'orderLines', // Ensure this matches the alias in the association
          include: [
            {
              model: Product,
              as: 'product', // Ensure this matches the alias in the association
              attributes: ['lot_id', 'grade', 'base_price', 'sale_price'],
            }
          ],
        }
      ]
    });

    const salesSummary = {};

    // Iterate through orders and calculate product sales
    orders.forEach(order => {
      order.orderLines.forEach(orderLine => {
        const product = orderLine.product;
        if (product) {
          // Use `lot_id` and `grade` concatenated as the product name
          const productKey = `${product.lot_id} - Grade: ${product.grade}`;
          
          if (!salesSummary[productKey]) {
            salesSummary[productKey] = {
              lot_id: product.lot_id,
              grade: product.grade,
              totalQuantity: 0,
              totalRevenue: 0,
              totalCost: 0,
              totalProfit: 0,
            };
          }

          const quantity = orderLine.amount; // Assuming `amount` is the quantity field
          const revenue = product.sale_price * quantity;
          const cost = product.base_price * quantity;
          const profit = revenue - cost;

          salesSummary[productKey].totalQuantity += quantity;
          salesSummary[productKey].totalRevenue += revenue;
          salesSummary[productKey].totalCost += cost;
          salesSummary[productKey].totalProfit += profit;
        }
      });
    });

    res.status(200).json(Object.values(salesSummary));
  } catch (error) {
    console.error('Error fetching sales summary:', error);
    res.status(500).send({ error: 'Failed to fetch sales summary' });
  }
};





// Function to get all products that are available
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { status: 'Available' } });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message || 'An unknown error occurred' });
  }
};


// Function to get a specific product by lot_id and grade
exports.getProduct = async (req, res) => {
  const { lot_id, grade } = req.params;

  try {
    const product = await Product.findOne({
      where: {
        lot_id,
        grade
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
};


// Get all products
exports.getProductsList = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { lot_id, grade,  RemainLotamount, LotamountStock, exp_date, base_price, sale_price } = req.body;
    const image_path = req.file ? `/images/${req.file.filename}` : null;
    const status = 'Available';
    const product = await Product.create({
      lot_id,
      grade,
      RemainLotamount,
      LotamountStock,
      exp_date,
      base_price,
      sale_price,
      image_path,
      status 
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(400).json({ error: error.message || 'An unknown error occurred' });
  }
};

