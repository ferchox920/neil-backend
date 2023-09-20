import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import productRoutes from "../routes/product.route.js";
import userRoutes from "../routes/user.route.js";
import authRoutes from "../routes/auth.route.js";
import orderRouter from "../routes/order.route.js";

config();

const expressApp = express();


expressApp.use(
  cors({
    origin: "*",
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "reset",
      "pos",
      "confirm",
    ],
    methods: ["GET", "PUT", "POST", "DELETE"], 
  })
);

expressApp.use(express.json()); 
expressApp.use(express.urlencoded({ extended: true })); 
expressApp.use(cookieParser());

expressApp.use(morgan("dev"));

// RUTAS
expressApp.use('/product', productRoutes);
expressApp.use('/user', userRoutes);
expressApp.use('/auth', authRoutes);
expressApp.use('/order', orderRouter);

expressApp.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "*");
  next();
});

export default expressApp;
