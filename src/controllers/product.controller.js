const Product = require('../models/Product');

// Obtener todos los productos
const getProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Obtener todos los productos
        res.status(200).json({ status: 'success', payload: products });
    } catch (error) {
        console.error(error); // Log de error
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
};

// Obtener un producto específico por ID
const getProductById = async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await Product.findById(productId);
        if (product) {
            res.status(200).json({ status: 'success', payload: product });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el producto', error });
    }
};

// Agregar un nuevo producto
const addProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json({ status: 'success', payload: savedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el producto', error });
    }
};

// Actualizar un producto por su ID
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });
        if (updatedProduct) {
            res.status(200).json({ status: 'success', payload: updatedProduct });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
};

// Eliminar un producto por su ID
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.pid;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (deletedProduct) {
            res.status(200).json({ status: 'success', message: 'Producto eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el producto', error });
    }
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
};