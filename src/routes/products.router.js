const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Ruta para obtener productos con paginación
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = '', query = '', category, available } = req.query;

        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            sort: {}
        };

        if (sort === 'asc') {
            options.sort = { price: 1 };
        } else if (sort === 'desc') {
            options.sort = { price: -1 };
        }

        const filter = {};
        const cleanedQuery = query.trim();

        if (cleanedQuery) {
            filter.$or = [
                { name: { $regex: new RegExp(cleanedQuery, 'i') } },
                { description: { $regex: new RegExp(cleanedQuery, 'i') } }
            ];
        }

        if (category) {
            filter.category = category;
        }

        if (available === 'false') {
            filter.$or = [
                { stock: 0 },
                { available: false }
            ];
        }

        const result = await Product.paginate(filter, options);

        res.json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${cleanedQuery}&category=${category}&available=${available}` : null,
            nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${cleanedQuery}&category=${category}&available=${available}` : null,
        });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
});

// Ruta para actualizar un producto
router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { available, stock } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(pid, { available, stock }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json({
            status: 'success',
            message: 'Producto actualizado exitosamente',
            payload: updatedProduct
        });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
});

// Ruta para eliminar un producto
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(pid);

        if (!deletedProduct) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado.' });
        }

        res.json({
            status: 'success',
            message: 'Producto eliminado exitosamente',
            payload: deletedProduct
        });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ message: 'Error al eliminar el producto', error });
    }
});

// Ruta para obtener detalles de un producto
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await Product.findById(pid);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.render('productDetails', { product }); // Asegúrate de que 'productDetails' sea el nombre correcto de la vista
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ message: 'Error al obtener el producto', error });
    }
});

module.exports = router;
