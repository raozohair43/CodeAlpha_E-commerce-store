const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', async (req, res) => {
  const { page = 1, limit = 10, minPrice, maxPrice } = req.query;

  const where = {
    price: {
      gte: minPrice ? parseFloat(minPrice) : undefined,
      lte: maxPrice ? parseFloat(maxPrice) : undefined,
    }
  };

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.product.count({ where }),
    ]);
    res.json({ products, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, admin, async (req, res) => {
  const { name, description, price, stock, image } = req.body;
  try {
    const product = await prisma.product.create({
      data: { name, description, price: parseFloat(price), stock: parseInt(stock), image }
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', auth, admin, async (req, res) => {
  const { name, description, price, stock, image } = req.body;
  try {
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: { name, description, price: parseFloat(price), stock: parseInt(stock), image }
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Block delete if product is referenced in any order
    const orderItemCount = await prisma.orderItem.count({ where: { productId: id } });
    if (orderItemCount > 0) {
      return res.status(400).json({ error: 'Cannot delete a product that has existing orders.' });
    }

    // CartItems are transient — safe to delete
    await prisma.cartItem.deleteMany({ where: { productId: id } });

    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

