const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const productsRouter = require('./src/routes/products.router');
const cartsRouter = require('./src/routes/carts.router');
const Product = require('./src/models/Product');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Montar las rutas de API solo una vez
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    }
}));

app.set('view engine', 'handlebars');
app.set('views', __dirname + '/src/views');

// Configuración de Content Security Policy (CSP)
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "script-src 'self' https://apis.google.com"
    );
    next();
});

// Ruta para la vista de productos
app.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = '', query = '' } = req.query;

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

        const filter = query ? { $text: { $search: query } } : {};

        const result = await Product.paginate(filter, options);

        res.render('products', {
            products: result.docs,
            title: 'Lista de Productos',
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
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
});

// Ruta para la página de inicio
app.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = '', query = '' } = req.query;

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

        const filter = query ? { $text: { $search: query } } : {};

        const result = await Product.paginate(filter, options);

        res.render('home', {
            products: result.docs,
            title: 'Página de Inicio',
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
        console.error('Error al obtener los productos para la página de inicio:', error);
        res.status(500).json({ message: 'Error al obtener los productos para la página de inicio', error });
    }
});

// Ruta para test
app.get('/test', (req, res) => {
    res.render('test', (err) => {
        if (err) {
            console.error('Error al renderizar la vista:', err);
            res.status(500).send('Error al renderizar la vista');
        }
    });
});

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce')
    .then(() => {
        console.log('Conectado a MongoDB');
    })
    .catch(error => {
        console.error('Error al conectar a MongoDB', error);
        process.exit(1);
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
