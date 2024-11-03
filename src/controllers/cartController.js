const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const User = require('../models/User');

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Fetching cart for userId:', userId); // Debugging statement

        const cart = await Cart.findOne({
            where: { user_id: userId },
            include: {
                model: CartItem,
                as: 'items',
                include: {
                    model: Product,
                    as: 'product',
                },
            },
        });

        console.log('Fetched cart:', cart); // Debugging statement

        if (!cart) {
            console.log('Cart not found for user:', userId); // Debugging statement
            return res.status(404).json({ error: 'Cart not found for the given user ID' });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
};

// Add item to user's cart
exports.addItemToCart = async (req, res) => {
    try {
      const { userId } = req.params; // Get userId from params
      const { lot_id, grade, amount } = req.body;
  
      // Validate userId
      if (!userId || userId === 'null') {
        console.error('Invalid userId:', userId);
        return res.status(400).json({ error: 'Invalid user ID' });
      }
  
      console.log(`Adding to cart: userId=${userId}, lot_id=${lot_id}, grade=${grade}, amount=${amount}`);
  
      // Ensure the user exists
      const user = await User.findByPk(userId);
      if (!user) {
        console.error(`User not found: userId=${userId}`);
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Find or create the user's cart
      let cart = await Cart.findOne({ where: { user_id: userId } });
      if (!cart) {
        console.log(`No cart found for user ${userId}, creating a new one.`);
        cart = await Cart.create({ user_id: userId });
      }
  
      // Find the product to add to the cart
      const product = await Product.findOne({ where: { lot_id, grade } });
      if (!product) {
        console.error(`Product not found: lot_id=${lot_id}, grade=${grade}`);
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Check if the item already exists in the cart
      let cartItem = await CartItem.findOne({
        where: { cart_id: cart.cart_id, lot_id, grade },
      });
  
      if (cartItem) {
        console.log(`Item already in cart. Updating amount for lot_id=${lot_id}, grade=${grade}`);
        cartItem.amount += amount;
        await cartItem.save();
      } else {
        console.log(`Adding new item to cart: lot_id=${lot_id}, grade=${grade}, amount=${amount}`);
        cartItem = await CartItem.create({
          cart_id: cart.cart_id,
          lot_id: product.lot_id,
          grade: product.grade,
          amount,
        });
      }
  
      res.status(201).json({ message: 'Item added to cart', cartItem });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      res.status(500).json({ error: 'Failed to add item to cart' });
    }
  };
  

// Clear user's cart
exports.clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user's cart
        const cart = await Cart.findOne({ where: { user_id: userId } });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found for the given user ID' });
        }

        // Delete all items from the user's cart
        await CartItem.destroy({ where: { cart_id: cart.cart_id } });

        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
};

// Delete a single item from the user's cart
exports.deleteCartItem = async (req, res) => {
    try {
        const { productInCartId } = req.params;

        const result = await CartItem.destroy({ where: { product_in_cart_id: productInCartId } });
        if (result === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ error: 'Failed to delete cart item' });
    }
};


// Update the amount of a cart item
exports.updateCartItemAmount = async (req, res) => {
    try {
        const { productInCartId } = req.params;
        const { amount } = req.body;

        const cartItem = await CartItem.findByPk(productInCartId);
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        cartItem.amount = amount;
        await cartItem.save();

        res.status(200).json({ message: 'Item amount updated successfully' });
    } catch (error) {
        console.error('Error updating cart item amount:', error);
        res.status(500).json({ error: 'Failed to update cart item amount' });
    }
};

// Delete all items in product_in_cart where cart_id matches
exports.deleteProductsByCartId = async (req, res) => {
    try {
      const { cartId } = req.params;
      console.log(`Deleting products for cart ID: ${cartId}`); // Debugging

      // Fetch all cart items for the given cart ID, including product data
      const cartItems = await CartItem.findAll({
        where: { cart_id: cartId },
        include: [{ model: Product, as: 'product' }],
    });

      // Update each product's RemainLotamount and status
      for (const item of cartItems) {
        const product = item.product;
        const newRemainLotamount = product.RemainLotamount - item.amount;

        let updatedStatus = 'Available'; // Default status

        if (newRemainLotamount <= 0) {
            updatedStatus = 'Out of Stock'; // Set status to Out of Stock if stock is depleted
        }

        // Update the product's RemainLotamount and status
        await Product.update(
            { 
                RemainLotamount: Math.max(newRemainLotamount, 0), // Prevent negative stock
                status: updatedStatus,
            },
            { where: { lot_id: product.lot_id } }
        );
    }

  
      await CartItem.destroy({
        where: { cart_id: cartId },
      });
  
      res.status(200).json({ message: 'Products in cart cleared successfully.' });
    } catch (error) {
      console.error('Error deleting products from cart:', error);
      res.status(500).json({ message: 'Failed to delete products from cart.' });
    }
  };
  
