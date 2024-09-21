const express = require('express');
const { createCart, addProductToCart, getCartDetails, removeProductFromCart, updateCart, updateProductQuantity, clearCart } = require('../controllers/cart.controller');

const router = express.Router();

// Crear un nuevo carrito
router.post('/', createCart);

// Obtener un carrito específico
router.get('/:cid', getCartDetails);

// Agregar un producto al carrito (cambiar a POST)
router.post('/:cid/products/:pid', addProductToCart);

// Actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', updateProductQuantity);

// Actualizar el carrito (agregar varios productos)
router.put('/:cid', updateCart);

// Eliminar un carrito
router.delete('/:cid', async (req, res) => {
    try {
        const deletedCart = await Cart.findByIdAndDelete(req.params.cid);
        if (!deletedCart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.json({ message: 'Carrito eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el carrito:', error);
        res.status(500).json({ message: 'Error al eliminar el carrito', error });
    }
});

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', removeProductFromCart);

// Limpiar todos los productos del carrito
router.delete('/:cid/clear', clearCart);

module.exports = router;
