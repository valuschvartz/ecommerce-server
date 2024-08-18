const fs = require('fs-extra');
const path = require('path');

class CartManager {
    constructor() {
        this.filePath = path.join(__dirname, '../../data/carritos.json');
    }

    async _readFile() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    async _writeFile(data) {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }

    async createCart() {
        const carts = await this._readFile();
        const newId = carts.length ? carts[carts.length - 1].id + 1 : 1;
        const newCart = { id: newId, products: [] };
        carts.push(newCart);
        await this._writeFile(carts);
        return newCart;
    }

    async getCartById(id) {
        const carts = await this._readFile();
        return carts.find(c => c.id === id);
    }

    async addProductToCart(cartId, productId) {
        const carts = await this._readFile();
        const cart = carts.find(c => c.id === cartId);
        if (cart) {
            const existingProduct = cart.products.find(p => p.product === productId);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }
            await this._writeFile(carts);
            return cart;
        }
        return null;
    }
}

module.exports = CartManager;

