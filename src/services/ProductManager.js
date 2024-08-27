const fs = require('fs-extra');
const path = require('path');

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.products = [];
        this.loadProducts(); // Cargar los productos al inicializar la instancia
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            this.products = JSON.parse(data);
        } catch (err) {
            console.error('Error al cargar los productos:', err);
            this.products = [];
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(this.products, null, 2));
        } catch (err) {
            console.error('Error al guardar los productos:', err);
        }
    }

    getAllProducts(limit) {
        return limit ? this.products.slice(0, limit) : this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id) || null;
    }

    async addProduct(product) {
        const newId = this.products.length ? this.products[this.products.length - 1].id + 1 : 1;
        const newProduct = { id: newId, ...product };
        this.products.push(newProduct);
        await this.saveProducts();
        return newProduct;
    }

    async updateProduct(id, updatedFields) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedFields };
            await this.saveProducts();
            return this.products[index];
        }
        return null;
    }

    async deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            const [deletedProduct] = this.products.splice(index, 1);
            await this.saveProducts();
            return deletedProduct;
        }
        return null;
    }
}

module.exports = ProductManager;