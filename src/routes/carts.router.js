const express = require('express');
const router = express.Router();
const CartManager = require('../services/CartManager');
const cartManager = new CartManager('./data/carritos.json');

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json({ message: 'Carrito creado exitosamente', payload: newCart });
});

// Ruta para obtener un carrito por su ID
router.get('/:cid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const cart = await cartManager.getCartById(cartId);

  if (cart) {
    res.status(200).json({ message: 'Carrito encontrado', payload: cart });
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' });
  }
});

// Ruta para agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const updatedCart = await cartManager.addProductToCart(cartId, productId);

  if (updatedCart) {
    res.status(200).json({ message: 'Producto agregado al carrito exitosamente', payload: updatedCart });
  } else {
    res.status(404).json({ message: 'Carrito o producto no encontrado' });
  }
});

module.exports = router;
