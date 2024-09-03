const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const ProductManager = require('./src/services/ProductManager');

// Crear instancia de ProductManager
const productManager = new ProductManager(path.join(__dirname, 'data', 'productos.json'));

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para mostrar todos los productos en home.handlebars
app.get('/', async (req, res) => {
    try {
        const products = productManager.getAllProducts();
        res.render('home', { title: 'Productos', products });
    } catch (error) {
        console.error('Error en la ruta /:', error);
        res.status(500).send({ error: 'Error al obtener los productos', details: error.message });
    }
});

// Ruta para mostrar productos en tiempo real en realTimeProducts.handlebars
app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = productManager.getAllProducts();
        res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products });
    } catch (error) {
        console.error('Error en la ruta /realtimeproducts:', error);
        res.status(500).send({ error: 'Error al obtener los productos', details: error.message });
    }
});

// Ruta POST para agregar un nuevo producto
app.post('/api/products', async (req, res) => {
    try {
        const newProduct = req.body;
        const addedProduct = await productManager.addProduct(newProduct);
        io.emit('updateProducts', productManager.getAllProducts());
        res.status(201).json(addedProduct);
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).send({ error: 'Error al agregar el producto', details: error.message });
    }
});

// Ruta DELETE para eliminar un producto
app.delete('/api/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const deletedProduct = await productManager.deleteProduct(productId);
        if (deletedProduct) {
            io.emit('updateProducts', productManager.getAllProducts());
            res.status(200).json(deletedProduct);
        } else {
            res.status(404).send({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).send({ error: 'Error al eliminar el producto', details: error.message });
    }
});

// WebSocket
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Enviar productos a un cliente cuando se conecta
    socket.emit('updateProducts', productManager.getAllProducts());

    // Evento para agregar un producto
    socket.on('addProduct', (prod) => {
        const addedProduct = productManager.addProduct(prod);
        io.emit('updateProducts', productManager.getAllProducts());
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});