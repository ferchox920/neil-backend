import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import productRoutes from "../routes/product.route.js";

config();

const expressApp = express();

// TODO: Investigar sobre cors
expressApp.use(
  cors({
    origin: "*", // Solo permitir llamadas desde http://localhost:3000
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "reset",
      "pos",
      "confirm",
    ],
    methods: ["GET", "PUT", "POST", "DELETE"], // Agregamos los métodos permitidos
  })
);

expressApp.use(express.json()); // Utiliza express.json() para analizar JSON
expressApp.use(express.urlencoded({ extended: true })); // Utiliza express.urlencoded() para analizar formularios
expressApp.use(cookieParser());
expressApp.use(morgan("dev"));

// RUTAS
expressApp.use('/product', productRoutes);

expressApp.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "*");
  next();
});

export default expressApp;
