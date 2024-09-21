const express = require('express');
const Product = require('../models/Product'); // Asegúrate de que la ruta sea correcta
const router = express.Router();

// Ruta para obtener productos
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = '', query = '', category, available } = req.query;

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: {}
        };

        if (sort === 'asc') {
            options.sort = { price: 1 }; // Orden ascendente
        } else if (sort === 'desc') {
            options.sort = { price: -1 }; // Orden descendente
        }

        const filter = {};

        // Limpiar el valor de query
        const cleanedQuery = query.trim();

        // Ajustar el filtro por nombre o descripción
        if (cleanedQuery) {
            filter.$or = [
                { name: { $regex: new RegExp(cleanedQuery, 'i') } },
                { description: { $regex: new RegExp(cleanedQuery, 'i') } }
            ];
        }

        // Filtrar por categoría
        if (category) {
            filter.category = category;
        }

        // Filtrar por disponibilidad
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
        const updatedProduct = await Product.findByIdAndUpdate(
            pid,
            { available, stock },
            { new: true } // Devuelve el documento actualizado
        );

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

module.exports = router;
