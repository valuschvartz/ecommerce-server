const express = require('express');
const router = express.Router();
const ProductManager = require('../services/ProductManager');
const path = require('path');

// Crear instancia de ProductManager
const productManager = new ProductManager(path.join(__dirname, '../../data/productos.json'));

module.exports = function (io) {
    // Obtener todos los productos
    router.get('/', async (req, res) => {
        const products = productManager.getAllProducts(); // Método sincrónico
        res.json(products);
    });

    // Agregar un nuevo producto
    router.post('/', async (req, res) => {
        const newProduct = await productManager.addProduct(req.body);
        io.emit('updateProducts', productManager.getAllProducts());
        res.status(201).json(newProduct);
    });

    // Eliminar un producto
    router.delete('/:pid', async (req, res) => {
        const productId = parseInt(req.params.pid);
        const deletedProduct = await productManager.deleteProduct(productId);
        io.emit('updateProducts', productManager.getAllProducts());
        res.status(200).json(deletedProduct);
    });

    return router;
};