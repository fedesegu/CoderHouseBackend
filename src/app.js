import express from "express";
import viewsRouter from "./routes/views.router.js";
import usersRouter from "./routes/users.router.js";
import chatRouter from "./routes/chat.router.js";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import sessionsRouter from "./routes/sessions.router.js"
import {productsManager} from "./DAO/managerDB/productsManagerDB.js"
import { messagesManager } from "./DAO/managerDB/messageManager.js";
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import session from "express-session";
import "./db/configDB.js";


const app = express();
const URI = "mongodb+srv://federicosegu:Abeyp231@cluster0.gjwkb4d.mongodb.net/PreEntregaDos?retryWrites=true&w=majority";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/carts", cartsRouter);
app.use("/api/views", viewsRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/chat", chatRouter);
app.use("/api/sessions", sessionsRouter);

const httpServer = app.listen(8080, () => {
  console.log("Escuchando el puerto 8080");
});

const messages = [];

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log(`Client connected ${socket.id}`);
  const products = await manager.getProducts({});
  socket.emit("products", products);

  socket.on("addProduct", async (productsData) => {
    console.log(productsData);
    await manager.addProduct(productsData);
    const productsUpdated = await manager.getProducts({});
    socket.emit("productsUpdated", productsUpdated);
  });

  socket.on("message", (info) => {
    messages.push(info);
    socketServer.emit("chat", messages);
  });

  socket.on("id", async (id) => {
    await manager.deleteProduct(+id);
    socket.emit("productsUpdated", products);
  });
});

app.use(session({ 
  store: new MongoStore({mongoUrl: URI}),
  secret: 'secretSession', 
  cookie: { maxAge: 60000 }
}))




