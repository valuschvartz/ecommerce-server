const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');

const cartsFilePath = path.join(__dirname, '../../data/carrito.json');

// Leer carritos desde el archivo
async function readCarts() {
  try {
    const data = await fs.readFile(cartsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Escribir carritos en el archivo
async function writeCarts(carts) {
  await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
}

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const carts = await readCarts();
    const newId = (carts.length + 1).toString(); // ID más corto
    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    await writeCarts(carts);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

// Obtener productos de un carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    const carts = await readCarts();
    const cart = carts.find(c => c.id === req.params.cid);
    if (cart) {
      res.status(200).json(cart.products);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// Agregar un producto a un carrito por ID
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const carts = await readCarts();
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const productId = req.params.pid;
    const existingProduct = cart.products.find(p => p.product === productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await writeCarts(carts);
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

module.exports = router;
