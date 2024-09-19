const Product = require('../models/product.model');

// Obtener todos los productos con paginación, filtrado y ordenamiento
const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = '', query = '' } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},
        };

        const filter = query ? { $text: { $search: query } } : {};

        const result = await Product.paginate(filter, options);

        res.status(200).json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
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
        res.status(500).json({ message: 'Error al obtener el producto', error });
    }
};

module.exports = {
    getProducts,
    getProductById,
};