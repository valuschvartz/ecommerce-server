const express = require('express');
const { getProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const router = express.Router();

// Obtener todos los productos con filtros, paginación y ordenamiento
router.get('/', getProducts);

// Obtener un producto por su ID
router.get('/:pid', getProductById);

// Agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body); // Asegúrate de importar el modelo
        await newProduct.save();
        res.status(201).json({ status: 'success', message: 'Producto creado correctamente', product: newProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Actualizar un producto por su ID
router.put('/:pid', updateProduct);

// Eliminar un producto por su ID
router.delete('/:pid', deleteProduct);

module.exports = router;
