const Cart = require('../models/Cart'); // Asegúrate de tener un modelo de Cart
const Product = require('../models/Product'); // Asegúrate de tener un modelo de Product

// Obtener todos los productos en un carrito específico
const getCartDetails = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.render('cartDetails', { cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el carrito', error });
    }
};

// Eliminar un producto del carrito
const removeProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();
        res.json({ message: 'Producto eliminado del carrito', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto del carrito', error });
    }
};

// Actualizar el carrito con un arreglo de productos
const updateCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const products = req.body.products; // Espera un arreglo de productos con formato { product: productId, quantity: quantity }
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        cart.products = products;
        await cart.save();
        res.json({ message: 'Carrito actualizado', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el carrito', error });
    }
};

// Actualizar la cantidad de un producto en el carrito
const updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }
        cart.products[productIndex].quantity = quantity;
        await cart.save();
        res.json({ message: 'Cantidad del producto actualizada', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la cantidad del producto', error });
    }
};

// Eliminar todos los productos del carrito
const clearCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        cart.products = [];
        await cart.save();
        res.json({ message: 'Todos los productos han sido eliminados del carrito', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar los productos del carrito', error });
    }
};

module.exports = {
    getCartDetails,
    removeProductFromCart,
    updateCart,
    updateProductQuantity,
    clearCart,
};