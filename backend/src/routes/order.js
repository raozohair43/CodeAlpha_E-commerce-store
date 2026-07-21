const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', auth, async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } }
    });

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ error: 'Cart is empty' });

    // Check stock before doing anything
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for "${item.product.name}". Available: ${item.product.stock}`
        });
      }
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 0
    );

    // Atomic: create order + decrement stock + clear cart
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          total,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity:  item.quantity,
              price:     item.product.price,
            })),
          },
        },
        include: { items: true },
      });

      await Promise.all(
        cart.items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data:  { stock: { decrement: item.quantity } },
          })
        )
      );

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/status', auth, admin, async (req, res) => {
  const { status } = req.body;
  try {
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /:id/cancel
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    
    if(isNaN(orderId)) return res.status(400).json({ error: 'Invalid order ID' });

    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.userId !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Access denied' });

    if (order.status !== 'pending')
      return res.status(400).json({ error: 'Only pending orders can be cancelled' });

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'cancelled' }
    });

    res.json(updated);
  } catch (err) {
    console.error('Cancel order error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;