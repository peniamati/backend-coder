const express = require("express");
const handlebars = require("express-handlebars");
// const homeRouter = require('./routes/home.routes.js')
// const realTimeProductsRouter = require('./routes/realTimeProducts.routes.js')
// const path = require('path')
const http = require("http");
const { Server } = require("socket.io");
const app = express();
// const ProductManager = require('./src/models/productManager')
const Database = require("./public/dao/db/database.js");
const productsRoute = require("./routes/products.routes.js");
const ProductManager = require("./src/models/productManager");
const productManager = new ProductManager();
const cartsRoute = require("./routes/carts.routes.js");
const CartManager = require("./src/models/cartManager");
const cartManager = new CartManager();
const messagesRoute = require("./routes/chat.routes.js");
const Chat = require("./public/dao/db/models/chat.model.js");

// esto es desde la base de datos
app.use(express.json());

// app.use("/products", productsRoute);
app.use("/msg", messagesRoute);
app.use('/api/products', productsRoute)
app.use('/api/carts', cartsRoute)

// Crear una instancia de ProductManager
// const productManager = new Products();

// const productManager = new ProductManager('./products.json')

const PORT = 8080 || process.env.PORT;

// SERVER HTTP
const server = http.createServer(app);

// PUBLIC
app.use(express.static(__dirname + "/public"));

// ENGINE (Motor de plantillas)
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/public/dao/views");

app.get("/chat", async (req, res) => {
  try {
    const messages = await Chat.find();
    res.render("chat", { messages });
  } catch (error) {
    console.error(`Error al obtener mensajes: ${error}`);
    res.status(500).send("Error al obtener mensajes");
  }
});

// SOCKET SERVER
const io = new Server(server);
io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado ${socket.id}`);

  socket.on("all-messages", async () => {
    const messages = await Chat.find();
    socket.emit("message-all", messages);
  });

  socket.on("new-message", async (data) => {
    const newMessage = new Chat(data);
    await newMessage.save();
    const messages = await Chat.find();
    socket.emit("message-all", messages);
  });
});

server.listen(PORT, () => {
  console.log(`Escuchando en el puerto ${PORT}`);
  Database.connect()
    .then(() => {
      if (!server.listening) {
        server.listen(PORT, () => {
          console.log(`Escuchando en el puerto ${PORT}`);
        });
      }
    })
    .catch((error) => {
      console.error("Error al conectar a la base de datos:", error);
    });
});
