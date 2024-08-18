const express = require('express');
const app = express();
const PORT = 8080;
const productsRouter = require('./src/routes/products.router');
const cartsRouter = require('./src/routes/carts.router');

// Middleware para parsear JSON
app.use(express.json());

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.send('Bienvenidos a mi eCommerce');
});

// Rutas de productos
app.use('/api/products', productsRouter);

// Rutas de carritos
app.use('/api/carts', cartsRouter);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

