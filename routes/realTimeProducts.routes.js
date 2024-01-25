const express = require('express');
const { Router } = express;

const ProductManager = require("../src/models/productManager");

const productManager = new ProductManager("./products.json");

const routerRealTimeProducts = Router()

routerRealTimeProducts.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();

        res.status(200).render("realTimeProducts", {
          products: products,
        });
    } catch (error) {
        console.log(`Error obteniendo los productos: ${error}`);
    }
});

module.exports = routerRealTimeProducts