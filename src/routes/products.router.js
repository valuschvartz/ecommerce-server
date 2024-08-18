const express = require('express');
const router = express.Router();
const ProductManager = require('../services/ProductManager');
const path = require('path');

// Inicializar el ProductManager con la ruta correcta al archivo de productos
const productManager = new ProductManager(path.join(__dirname, '../../data/productos.json'));

// Ruta para listar todos los productos con límite opcional
router.get('/', (req, res) => {
    const limit = req.query.limit;
    const products = productManager.getAllProducts(limit ? parseInt(limit) : undefined);
    res.json({ message: 'Productos obtenidos exitosamente', payload: products });
});

// Ruta para obtener un producto específico por ID
router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const product = productManager.getProductById(parseInt(pid));
    if (product) {
        res.json({ message: 'Producto encontrado', payload: product });
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

// Ruta para agregar un nuevo producto
router.post('/', (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const newProduct = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails: thumbnails || []
    };

    const createdProduct = productManager.addProduct(newProduct);
    res.status(201).json({ message: 'Producto creado exitosamente', payload: createdProduct });
});

// Ruta para actualizar un producto específico por ID
router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const updatedFields = req.body;

    if (updatedFields.id) {
        return res.status(400).json({ message: 'No se puede modificar el ID del producto' });
    }

    const updatedProduct = productManager.updateProduct(parseInt(pid), updatedFields);
    if (updatedProduct) {
        res.json({ message: 'Producto actualizado exitosamente', payload: updatedProduct });
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

// Ruta para eliminar un producto específico por ID
router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    const deletedProduct = productManager.deleteProduct(parseInt(pid));
    if (deletedProduct) {
        res.json({ message: 'Producto eliminado exitosamente' });
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

module.exports = router;
