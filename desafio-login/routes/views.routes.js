const express = require("express");
const { Router } = express;
const productsRoutes = require("./products.routes"); // Importa las rutas de productos
const cartsRoutes = require("./carts.routes"); // Importa las rutas de carritos
const authRoutes = require("./auth.routes");
const userManager = require("../src/models/userManager");

const route = new Router();

// Monta las rutas de autenticación
route.use("/", authRoutes);

// Monta las rutas de productos
route.use("/api/products", productsRoutes);

// Monta las rutas de carritos
route.use("/api/carts", cartsRoutes);

function auth(req, res, next) {
  let users = userManager.getUsers();
  if (users.some((user) => user.username === req.session.user.username && user.password === req.session.user.password)) {
    next();
  } else {
    res.redirect("/");
  }
}

route.get("/", (req, res) => {
  res.render("login");
})

route.get("/register", (req, res) => {
  res.render("register");
})

route.get("/profile", auth, (req, res) => {
  res.render("profile");
})

module.exports = route