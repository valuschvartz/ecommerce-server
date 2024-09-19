const express = require('express');
const { getProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const router = express.Router();

// Obtener todos los productos con filtros, paginación y ordenamiento
router.get('/', getProducts);

// Obtener un producto por su ID
router.get('/:pid', getProductById);

// Agregar un nuevo producto
router.post('/', addProduct);

// Actualizar un producto por su ID
router.put('/:pid', updateProduct);

// Eliminar un producto por su ID
router.delete('/:pid', deleteProduct);

module.exports = router;