const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const productsRouter = require('./src/routes/products.router');
const cartsRouter = require('./src/routes/carts.router');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Montar las rutas de API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta para la vista de productos
app.get('/products', (req, res) => {
    res.render('products'); // Asegúrate de que esta vista exista
});

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/supleboost', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conectado a MongoDB');
    })
    .catch(error => {
        console.error('Error al conectar a MongoDB', error);
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});