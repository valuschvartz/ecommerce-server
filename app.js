const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const ProductManager = require('./src/services/ProductManager');
const productsRouter = require('./src/routes/products.router');

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

// Usar el router de productos
app.use('/api/products', productsRouter(io));

// Ruta para mostrar todos los productos en home.handlebars
app.get('/', (req, res) => {
    const products = productManager.getAllProducts(); // No se usa await porque es sincrónico ahora
    res.render('home', { title: 'Productos', products });
});

// Ruta para mostrar productos en tiempo real en realTimeProducts.handlebars
app.get('/realtimeproducts', (req, res) => {
    const products = productManager.getAllProducts(); // No se usa await porque es sincrónico ahora
    res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products });
});

// WebSocket
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Enviar productos a un cliente cuando se conecta
    socket.emit('updateProducts', productManager.getAllProducts());

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});