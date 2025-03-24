const Order = require("../models/Order");
const sequelize = require("../config/database");
const User = require("../models/User");
const DeliveredOrder = require("../models/DeliveredOrder");

// add delivery code to delivered order
exports.addDelivery = async (req, res) => {
  try {
    const { ems_code,order_id,staff_id } = req.body;
    const delivered_order = await DeliveredOrder.create({
      ems_code,
      order_id,
      staff_id
    });
    res.status(201).json(delivered_order);
  } catch (error) {
    console.error('Error adding delivered order code:', error);
    res.status(400).json({ error: error.message || 'An unknown error occurred' });
  }
};

exports.getAllDeliveredOrders =  async (req, res) => {
  try {
    const deliveredOrders = await DeliveredOrder.findAll();
    res.status(200).json(deliveredOrders);
  } catch (error) {
    console.error('Error fetching delivered orders:', error);
    res.status(500).json({ error: error.message || 'An unknown error occurred' });
  }
};


exports.getDeliveredOrderDetails = async (req, res) => {
  const { deliver_id } = req.params;
  console.log("Received deliver_id:", deliver_id); 

  try {
    // Fetch the delivered order with the associated ems code
    const deliveredOrder = await DeliveredOrder.findOne({
      where: { deliver_id: deliver_id },
    });

    if (!deliveredOrder) {
      return res.status(404).json({ message: "Delivered Order not found" });
    }
    res.status(200).json(deliveredOrder);
  } catch (error) {
    console.error("Error fetching delivered order details:", error);
    res.status(500).json({ message: "Failed to fetch delivered order details" });
  }
};

exports.deleteDeliveredOrderById = async (req, res) => {
  const { deliver_id } = req.params;

  try {
    const delivery = await DeliveredOrder.findByPk(deliver_id);
    if (!delivery) {
      return res.status(404).json({ message: 'Deliver order not found' });
    }
     await delivery.destroy();
     return res.status(200).json({ message: 'Deliver order deleted successfully' });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};