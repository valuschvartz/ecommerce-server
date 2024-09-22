const express = require('express');
const Cart = require('../models/Cart'); // Asegúrate de que esta línea esté presente
const { createCart, addProductToCart, removeProductFromCart, updateCart, clearCart } = require('../controllers/cart.controller');

const router = express.Router();

// Crear un nuevo carrito
router.post('/', createCart);

// Obtener un carrito específico con productos poblados
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        console.log(`Buscando carrito con ID: ${cid}`);
        const cart = await Cart.findById(cid).populate('products.product'); // Usar populate para obtener los detalles del producto
        
        if (!cart) {
            console.log('Carrito no encontrado');
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        console.log(`Carrito encontrado:`, cart);
        res.json(cart); // Devuelve el carrito con los productos poblados
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error al obtener el carrito', error: error.message || error });
    }
});

// Agregar un producto al carrito
router.post('/:cid/products/:pid', addProductToCart);

// Actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
        return res.status(400).json({ message: 'La cantidad debe ser mayor que 0' });
    }

    try {
        console.log(`Buscando carrito con ID: ${cid}`);
        const cart = await Cart.findById(cid);
        
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        console.log(`Carrito encontrado:`, cart);

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid.toString());
        
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        // Actualiza la cantidad
        cart.products[productIndex].quantity = quantity;

        await cart.save();
        res.json({ message: 'Cantidad del producto actualizada', cart });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto:', error);
        res.status(500).json({ message: 'Error al actualizar la cantidad del producto', error: error.message || error });
    }
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        console.log(`Buscando carrito con ID: ${cid}`);
        const cart = await Cart.findById(cid);
        
        if (!cart) {
            console.log('Carrito no encontrado');
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        cart.products = [];
        await cart.save();

        res.json({ message: 'Todos los productos han sido eliminados del carrito', cart });
    } catch (error) {
        console.error('Error al eliminar los productos del carrito:', error);
        res.status(500).json({ message: 'Error al eliminar los productos del carrito', error: error.message || error });
    }
});

// Limpiar todos los productos del carrito
router.delete('/:cid/clear', clearCart);

// Exportar el router
module.exports = router;