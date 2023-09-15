import { Router } from "express";
import {
  addImagesToProduct,
  createProduct,
  deleteProduct,
  deleteProductImage,
  getAllProducts,
  getProduct,
} from "../services/product.service.js";
import fileUpload from "express-fileupload";
import { uploadOptions } from "../common/utils.js";



const productRoutes = Router();
productRoutes.post(
  "/",
  fileUpload(uploadOptions),
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

productRoutes.post('/addImages/:productId/',fileUpload(uploadOptions), async (req, res) => {
  const productId = req.params.productId;
  const imageFiles = req.files?.images; // Asegúrate de que el nombre del campo coincida con lo que esperas

  try {
    const updatedProduct = await addImagesToProduct(productId, imageFiles);

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
});

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





productRoutes.delete("/:productId/images/:imageId", async (req, res) => {
  const { productId, imageId } = req.params;

  try {
    const result = await deleteProductImage(productId, imageId);
    return res.status(200).json({ message: result });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor.", details: error.message });
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
