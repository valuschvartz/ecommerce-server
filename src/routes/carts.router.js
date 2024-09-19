const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

// Obtener todos los productos en un carrito específico
router.get('/:cid', cartController.getCartDetails);

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', cartController.removeProductFromCart);

// Actualizar el carrito con un arreglo de productos
router.put('/:cid', cartController.updateCart);

// Actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', cartController.updateProductQuantity);

// Eliminar todos los productos del carrito
router.delete('/:cid', cartController.clearCart);

module.exports = router;