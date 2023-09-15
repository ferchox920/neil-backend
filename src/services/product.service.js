import {
  deleteImageProduct,
  uploadImageProduct,
} from "../config/cloudinary.js";
import PRODUCT from "../database/product.entity.js";

export async function createProduct(productData, image) {
  try {
    const newProduct = await PRODUCT.create(productData);

    if (image) {
      const imageUploadResult = await uploadImageProduct(image.tempFilePath);
      newProduct.imageId = imageUploadResult.public_id;
      newProduct.imageUrlSecurity = imageUploadResult.secure_url;

      await newProduct.save();
    }

    return newProduct;
  } catch (error) {
    console.error("Error al crear el producto:", error);
    throw new Error("Error al crear el producto: " + error.message);
  }
}

export async function getProduct(id) {
  try {
    const product = await PRODUCT.findByPk(id);
    return product;
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    throw new Error("Error al obtener el producto: " + error.message);
  }
}

export async function getAllProducts() {
  try {
    const products = await PRODUCT.findAll();
    return products;
  } catch (error) {
    console.error("Error al obtener todos los productos:", error);
    throw new Error("Error al obtener todos los productos: " + error.message);
  }
}

export async function deleteProduct(id) {
  try {
    const product = await PRODUCT.findByPk(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    await deleteImageProduct(product.imageId);
    await product.destroy();
    return product;
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    throw new Error("Error al eliminar el producto: " + error.message);
  }
}
