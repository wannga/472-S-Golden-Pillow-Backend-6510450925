const Order = require('../models/Order');
const OrderLine = require('../models/OrderLine');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const sequelize = require('../config/database');
const User = require('../models/User');
// const Receipt = require('../models/Receipt');
// const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs');



// Place an order
exports.placeOrder = async (req, res) => {
  try {
    const { userId } = req.params;

    // 🛒 ดึง cart พร้อม CartItem (ไม่ต้อง include Product แล้ว)
    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: {
        model: CartItem,
        as: 'items',
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ error: 'Cart is empty or not found' });
    }

    // 🟡 โหลด product ทั้งหมดขึ้นมา
    const allProducts = await Product.findAll();

    // 💸 คำนวณราคารวมด้วยการแมตช์สินค้าเอง
    let totalPrice = 0;
    for (const item of cart.items) {
      const product = allProducts.find(
        (p) => p.lot_id === item.lot_id && p.grade === item.grade
      );

      if (product) {
        totalPrice += item.amount * product.sale_price;
      } else {
        console.warn(`Product not found for lot_id: ${item.lot_id}, grade: ${item.grade}`);
      }
    }

    // 🧾 สร้าง order ใหม่
    const newOrder = await Order.create({
      user_id: userId,
      total_price: totalPrice,
      payment_status: 'Yet to check',
      delivery_status: 'yet to send',
      status_for_ledger: 'not done',
      packed_status: 'not packed yet',
      slip_payment: 'no path',
      order_date: new Date(),
    });

    if (!newOrder || !newOrder.order_id) {
      throw new Error('Failed to create order');
    }

    console.log('New order created:', newOrder);

    // 📦 สร้าง order lines สำหรับแต่ละ item
    for (const item of cart.items) {
      await OrderLine.create({
        order_id: newOrder.order_id,
        lot_id: item.lot_id,
        grade: item.grade,
        amount: item.amount,
      });
    }

    // ❗ ถ้าต้องการล้าง cart หลังสั่งซื้อ
    // await CartItem.destroy({ where: { cart_id: cart.cart_id } });

    // ✅ ส่งกลับไปที่หน้า payment
    res.status(201).json({
      message: 'Order created successfully',
      orderId: newOrder.order_id,
      redirectUrl: `/payment/${newOrder.order_id}`,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

exports.getOrderWithUser = async (req, res, next) => {
  const { orderId } = req.params;

  try {
    // ค้นหา Order พร้อมข้อมูล User
    const order = await Order.findOne({
      where: { order_id: orderId },
      include: [
        { model: User, as: 'user', attributes: ['name', 'address'] },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // ค้นหา cart_id จากตาราง Cart โดยใช้ user_id จาก Order
    const cart = await Cart.findOne({
      where: { user_id: order.user_id },
      attributes: ['cart_id'], // ดึงเฉพาะ cart_id
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // สร้าง JSON Response พร้อมข้อมูลที่ต้องการ
    res.json({
      order_id: order.order_id,
      total_price: order.total_price,
      cart_id: cart.cart_id, // เพิ่ม cart_id ใน response
      user: {
        name: order.user.name,
        address: order.user.address,
      },
    });
  } catch (error) {
    console.error('Error fetching order with user and cart:', error);
    next(error);
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Find the order
    const order = await Order.findOne({ where: { order_id: orderId } });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Delete all associated order lines
    await OrderLine.destroy({ where: { order_id: orderId } });

    // Delete the order
    await Order.destroy({ where: { order_id: orderId } });

    res.status(200).json({ message: 'Order and its lines deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Failed to delete order' });
  }
};


exports.getOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Fetch the order with the associated user and order lines
    const order = await Order.findOne({
      where: { order_id: orderId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username'], // Only include the user's username
        },
        {
          model: OrderLine,
          as: 'orderLines',
          attributes: ['lot_id', 'grade', 'amount'], // Only include these attributes
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Handle missing user or orderLines gracefully
    const userName = order.user ? order.user.username : 'Unknown User';
    const orderLines = order.orderLines || [];

    // Format the response
    const formattedResponse = {
      orderId: order.order_id,
      orderDate: order.order_date.toISOString().split('T')[0], // Format to 'YYYY-MM-DD'
      userName: userName,
      payment_status: order.payment_status,
      delivery_status: order.delivery_status,
      orderLines: orderLines.map((line) => ({
        lotId: line.lot_id,
        grade: line.grade,
        amount: line.amount,
        //image_path: Product.lot_id.grade.image_path
      })),
    };

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Failed to fetch order details' });
  }
};

// Get all orders for a specific user
exports.getOrdersByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username' , 'address'],
        },
      ],
      order: [['order_date', 'DESC']], // Sort orders by date, newest first
    });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    // Format the response
    const formattedOrders = orders.map((order) => ({
      orderId: order.order_id,
      purchasedDate: order.order_date.toISOString().split('T')[0],
      delivered: order.delivery_status,
      status: order.payment_status,
      totalPrice: order.total_price,
      userName: order.user ? order.user.username : 'Unknown User',
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders by user:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username','name', 'lastname', 'address','house_details','name_road','district','province','postal_code'], // Include only the username and address fields from the User table
        },
      ],
    });

    // Format the response to include user data in a readable format
    const formattedOrders = orders.map(order => ({
      order_id: order.order_id,
      user_id: order.user_id,
      namelastname: order.user.name + ' ' + order.user.lastname,
      username: order.user ? order.user.username : 'Unknown User',
      address: order.user.address + ', ' + order.user.house_details + ', ' + order.user.name_road + ', ' + order.user.district + ', ' + order.user.province + ', ' + order.user.postal_code ,
      total_price: order.total_price,
      payment_status: order.payment_status,
      delivery_status: order.delivery_status,
      status_for_ledger: order.status_for_ledger,
      packed_status: order.packed_status,
      slip_payment: order.slip_payment,
      order_date: order.order_date,
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};


// exports.updatePaymentStatus = async (req, res) => {
//   const { orderId, payment_status } = req.body;
//   try {
//     console.log('Received request to update payment status:', req.body); // Log incoming request
//     const order = await Order.findOne({ where: { order_id: orderId } });

//     if (!order) {
//       console.error('Order not found:', orderId);
//       return res.status(404).send({ error: 'Order not found' });
//     }
    

//     console.log(`Updating order ID ${orderId} to status: ${payment_status}`);
//     order.payment_status = payment_status;
//     await order.save();
//     console.log('Order payment status updated successfully');
//     res.status(200).send({ message: 'Payment status updated successfully' });
//   } catch (error) {
//     console.error('Error in updatePaymentStatus:', error);
//     res.status(500).send({ error: 'Failed to update payment status' });
//   }
// };

exports.updatePaymentStatus = async (req, res) => {
  const { orderId, payment_status } = req.body;
  try {
    console.log('Received request to update payment status:', req.body);

    // Fetch the order along with its order lines and associated products
    const order = await Order.findOne({
      where: { order_id: orderId },
      include: [
        {
          model: OrderLine,
          as: 'orderLines',
          include: [{ model: Product, as: 'product' }]
        }
      ]
    });

    if (!order) {
      console.error('Order not found:', orderId);
      return res.status(404).send({ error: 'Order not found' });
    }

    if (payment_status === 'Approved') {
      // Update each product's LotamountStock and status based on order lines
      for (const line of order.orderLines) {
        const product = line.product;
    
        if (!product) {
          console.warn(`⚠️ Product not found for order line: lot_id=${line.lot_id}, grade=${line.grade}`);
          continue;
        }
    
        const newLotamountStock = product.LotamountStock - line.amount;
        let updatedStatus = newLotamountStock <= 0 ? 'Out of Stock' : 'Available';
    
        await Product.update(
          {
            LotamountStock: Math.max(newLotamountStock, 0),
            status: updatedStatus,
          },
          {
            where: {
              lot_id: product.lot_id,
              grade: product.grade, // เพิ่ม grade ถ้าคุณใช้ composite key
            }
          }
        );
      }
    } else if (payment_status === 'Rejected') {
      // Revert stock for each product in the order lines
      for (const line of order.orderLines) {
        const product = line.product;
    
        if (!product) {
          console.warn(`⚠️ Product not found for order line: lot_id=${line.lot_id}, grade=${line.grade}`);
          continue;
        }
    
        const newRemainLotamount = product.RemainLotamount + line.amount;
    
        let updatedStatus = newRemainLotamount <= 0 ? 'Out of Stock' : 'Available';
    
        await Product.update(
          {
            RemainLotamount: Math.max(newRemainLotamount, 0),
            status: updatedStatus,
          },
          {
            where: {
              lot_id: product.lot_id,
              grade: product.grade,
            }
          }
        );
      }
    }
    

    console.log(`Updating order ID ${orderId} to status: ${payment_status}`);
    order.payment_status = payment_status;
    await order.save();
    console.log('Order payment status updated successfully');
    res.status(200).send({ message: 'Payment status updated successfully' });
  } catch (error) {
    console.error('Error in updatePaymentStatus:', error);
    res.status(500).send({ error: 'Failed to update payment status' });
  }
};



exports.updatedeliveryStatus = async (req, res) => {
  const { orderId, delivery_status } = req.body;
  try {
    console.log('Received request to update delivery_status:', req.body); 
    const order = await Order.findOne({ where: { order_id: orderId } });

    if (!order) {
      console.error('Order not found:', orderId);
      return res.status(404).send({ error: 'Order not found' });
    }

    console.log(`Updating order ID ${orderId} to status: ${delivery_status}`);
    order.delivery_status = delivery_status;
    await order.save();
    console.log('Order delivery_status updated successfully');
    res.status(200).send({ message: 'delivery_status updated successfully' });
  } catch (error) {
    console.error('Error in updatedeliveryStatus:', error);
    res.status(500).send({ error: 'Failed to update delivery_status' });
  }
};

exports.updateStatusLedger = async (req, res) => {
  const { orderId, status_for_ledger } = req.body;
  try {
    await updateOrderStatusLedger(orderId, status_for_ledger);
    res.status(200).send({ message: 'Status Ledger updated successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to update Status Ledger' });
  }
};

exports.updatePackedStatus = async (req, res) => {
  const { orderId, packed_status } = req.body;
  try {
    console.log('Received request to update packed_status:', req.body); 
    const order = await Order.findOne({ where: { order_id: orderId } });

    if (!order) {
      console.error('Order not found:', orderId);
      return res.status(404).send({ error: 'Order not found' });
    }

    console.log(`Updating order ID ${orderId} to status: ${packed_status}`);
    order.packed_status = packed_status;
    await order.save();
    console.log('Order packed_status updated successfully');
    res.status(200).send({ message: 'packed_status updated successfully' });
  } catch (error) {
    console.error('Error in updatePackedStatus:', error);
    res.status(500).send({ error: 'Failed to update packed_status' });
  }
};

// exports.createreceipt = async (req, res) => {
//   const { orderId, userId } = req.body;

//   if (!userId || !orderId) {
//     return res.status(400).send({ error: 'userId and orderId are required' });
//   }

//   try {
//     // Fetch order details to get total price
//     const order = await Order.findOne({ where: { order_id: orderId } });
//     if (!order) {
//       return res.status(404).send({ error: 'Order not found.' });
//     }

//     // Fetch order lines for the given orderId
//     const orderLines = await OrderLine.findAll({ where: { order_id: orderId } });
//     if (!orderLines.length) {
//       return res.status(404).send({ error: 'No order lines found for this order.' });
//     }

//     // Collect product details
//     let productsInfo = [];
//     for (let orderLine of orderLines) {
//       const product = await Product.findOne({
//         where: {
//           lot_id: orderLine.lot_id,
//           grade: orderLine.grade
//         }
//       });

//       if (!product) {
//         return res.status(404).send({ error: `Product not found for lot ${orderLine.lot_id} and grade ${orderLine.grade}` });
//       }

//       productsInfo.push({
//         lot_id: orderLine.lot_id,
//         grade: orderLine.grade,
//         sale_price: product.sale_price,
//         amount: orderLine.amount
//       });
//     }

//     // Create a receipt image
//     const canvas = createCanvas(600, 400 + productsInfo.length * 30);
//     const ctx = canvas.getContext('2d');

//     // Draw receipt background
//     ctx.fillStyle = '#ffffff';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     ctx.fillStyle = '#000000';
//     ctx.font = '20px Arial';
//     ctx.fillText('Receipt', 250, 50);

//     ctx.font = '16px Arial';
//     ctx.fillText(`Order ID: ${orderId}`, 50, 100);

//     let y = 150;
//     productsInfo.forEach((product, index) => {
//       ctx.fillText(
//         `Product Lot: ${product.lot_id}, Grade: ${product.grade}, Price: ${product.sale_price} Baht, Amount: ${product.amount}`,
//         50,
//         y
//       );
//       y += 30;
//     });

//     // Draw the total price from the order
//     ctx.font = '18px Arial';
//     ctx.fillText(`Total Price: ${order.total_price} Baht`, 50, y + 30);

//     // Create 'public/images' directory if it doesn't exist
//     const imageDir = path.join(__dirname, '..', 'public', 'images');
//     if (!fs.existsSync(imageDir)) {
//       fs.mkdirSync(imageDir, { recursive: true });
//     }

//     // Save the canvas as an image
//     let imagePath = path.join(imageDir, `receipt_${orderId}.png`);
//     imagePath = path.resolve(imagePath);
//     if (!imagePath.startsWith(imageDir)) {
//       throw new Error('Invalid path');
//     }
//     const out = fs.createWriteStream(imagePath);
//     const stream = canvas.createPNGStream();
//     stream.pipe(out);

//     out.on('finish', async () => {
//       // Insert into receipt table
//       await Receipt.create({
//         order_id: orderId,
//         user_id: userId,
//         receipt_date: new Date(),
//         Receipt_path: `/images/receipt_${orderId}.png`
//       });

//       res.status(200).send({ message: 'Receipt created successfully', path: imagePath });
//     });

//   } catch (error) {
//     console.error('Error creating receipt:', error);
//     res.status(500).send({ error: 'Failed to create receipt' });
//   }
// };