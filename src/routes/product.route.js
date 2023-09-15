import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
} from "../services/product.service.js";
import fileUpload from "express-fileupload";

const productRoutes = Router();
productRoutes.post(
  "/",
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: false,
    tempFileDir: "./uploads",
  }),
  async (req, res) => {
    const product = req.body;
    const image = req.files?.image;

    try {
      const data = await createProduct(product, image);

      return res.status(201).json(data);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Error interno del servidor.", details: error.message });
    }
  }
);

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

productRoutes.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await deleteProduct(id);
    if (!data) return res.status(400).json("Producto no encontrado");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
});


export default productRoutes;
