import express from "express";
import { createOrder } from "../services/order.services.js";
// Asegúrate de que la ruta sea correcta

const orderRouter = express.Router();

// Ruta para crear una nueva orden
orderRouter.post("/", async (req, res) => {
  try {
    const { userId, products } = req.body;

    // Llama al servicio createOrder para crear la orden
    const order = await createOrder(userId, { products });

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default orderRouter;
