
import { uploadImageProduct } from "../config/cloudinary.js";
import PRODUCT from "../database/product.entity.js";

export async function createProduct(productData, image) {
  try {

    const newProduct = await PRODUCT.create(productData);

    if (image) {
   
      const imageUploadResult = await uploadImageProduct(image.tempFilePath);
      newProduct.imageUrl = imageUploadResult.url;
      newProduct.imageUrlSecurity = imageUploadResult.secure_url;

     
      await newProduct.save();
    }

    return newProduct;
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir durante el proceso
    console.error("Error al crear el producto:", error);
    throw new Error("Error al crear el producto: " + error.message);
  }
}

export async function getProduct(id) {
  const product = await PRODUCT.findByPk(id);
  return product;
}

export async function getAllProducts() {
  const products = await PRODUCT.findAll();
  return products;
}
