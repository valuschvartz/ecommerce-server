const express = require('express');
const router = express.Router();
const ProductManager = require('../services/ProductManager');
const productManager = new ProductManager();

module.exports = function (io) {
  router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
  });

  router.post('/', async (req, res) => {
    const newProduct = await productManager.addProduct(req.body);
    const products = await productManager.getProducts();
    io.emit('updateProducts', products);
    res.status(201).json(newProduct);
  });

  router.delete('/:id', async (req, res) => {
    await productManager.deleteProduct(req.params.id);
    const products = await productManager.getProducts();
    io.emit('updateProducts', products);
    res.sendStatus(204);
  });

  return router;
};
