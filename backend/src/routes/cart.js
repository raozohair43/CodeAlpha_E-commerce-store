const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } }
    });
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) cart = await prisma.cart.create({ data: { userId: req.user.id } });
    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: parseInt(productId) }
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + parseInt(quantity) }
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId: parseInt(productId), quantity: parseInt(quantity) }
      });
    }
    const updatedCart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } }
    });
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:itemId', auth, async (req, res) => {
  const { quantity } = req.body;
  try {
    const item = await prisma.cartItem.update({
      where: { id: parseInt(req.params.itemId) },
      data: { quantity: parseInt(quantity) }
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:itemId', auth, async (req, res) => {
  try {
    await prisma.cartItem.delete({ where: { id: parseInt(req.params.itemId) } });
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;