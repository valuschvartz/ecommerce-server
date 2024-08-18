const fs = require('fs-extra');
const path = require('path');

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.products = [];
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            this.products = JSON.parse(data);
        } catch (err) {
            this.products = [];
        }
    }

    async saveProducts() {
        await fs.writeFile(this.filePath, JSON.stringify(this.products, null, 2));
    }

    getAllProducts(limit) {
        if (limit) {
            return this.products.slice(0, limit);
        }
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    addProduct(product) {
        const newId = this.products.length ? this.products[this.products.length - 1].id + 1 : 1;
        const newProduct = { id: newId, ...product };
        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }

    updateProduct(id, updatedFields) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedFields };
            this.saveProducts();
            return this.products[index];
        }
        return null;
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            const deletedProduct = this.products.splice(index, 1);
            this.saveProducts();
            return deletedProduct;
        }
        return null;
    }
}

module.exports = ProductManager;
