import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
} from "../services/product.service.js";

const productRoutes = Router();

productRoutes.get("/", async (req, res) => {
  try {
    const data = await getAllProducts();
    if (!data) return res.status(400).json("Base de datos vacia");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
});

productRoutes.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getProduct(id);
    if (!data) return res.status(400).json("Base de datos vacia");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
});

productRoutes.post("/", async (req, res) => {
  const product = req.body;

  try {
    const data = await createProduct(product);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
});

export default productRoutes;
