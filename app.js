const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const productsRouter = require('./src/routes/products.router');
const cartsRouter = require('./src/routes/carts.router');
const Product = require('./src/models/Product'); // Asegúrate de importar el modelo Product

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true, // Agrega esta línea
    }
}));

app.set('view engine', 'handlebars');
app.set('views', __dirname + '/src/views'); // Ruta correcta

// Montar las rutas de API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta para la vista de productos
app.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = '', query = '' } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},
        };

        const filter = query ? { $text: { $search: query } } : {};

        const result = await Product.paginate(filter, options); // Asegúrate de que Product tenga el método paginate

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
        console.error('Error al renderizar los productos:', error);
        res.status(500).send(`Error al obtener los productos: ${error.message}`);
    }
});

// Ruta para la página de inicio (opcional)
app.get('/', (req, res) => {
    res.render('home'); // Asegúrate de tener un archivo home.handlebars
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
mongoose.connect('mongodb://localhost:27017/supleboost')
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
