const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conexión a la base de datos MongoDB exitosa');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
        process.exit(1); // Detiene la ejecución de la aplicación si hay un error
    }
};

module.exports = connectDB;


