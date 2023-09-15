import ImageType from "../common/type-image-enum.js";
import {
  deleteImageProduct,
  uploadImageProduct,
} from "../config/cloudinary.js";
import IMAGE from "../database/images.entity.js";
import PRODUCT from "../database/product.entity.js";

export async function createProduct(productData, image) {
  const { code } = productData;

  if (!code) {
    throw new Error("El codigo es obligatorio");
  }

  try {
    const existingCode = await PRODUCT.findOne({
      where: {
        code: code,
      },
    });
    if (existingCode) {
      throw new Error("El codigo ya existe");
    }
    const newProduct = await PRODUCT.create(productData);


    const imagesArray = Array.isArray(image) ? image : [image];

    const newImagesPromises = imagesArray.map(async (imageFile) => {
      const imageUploadResult = await uploadImageProduct(imageFile);

      return IMAGE.create({
        productId: newProduct.id,
        publicId: imageUploadResult.public_id,
        imageUrlSecurity: imageUploadResult.secure_url,
        type:ImageType.PRODUCT
      });
    });

    const newImages = await Promise.all(newImagesPromises);


    
    await newProduct.addImages(newImages);

  
    await newProduct.save();

    return newProduct;
  } catch (error) {
    console.error("Error al crear el producto:", error);
    throw new Error("Error al crear el producto: " + error.message);
  }
}


export async function addImagesToProduct(productId, imageFiles) {
  try {
    const product = await PRODUCT.findByPk(productId);

    if (!product) {
      throw new Error("Producto no encontrado");
    }
    const imagesArray = Array.isArray(imageFiles) ? imageFiles : [imageFiles];

    const newImagesPromises = imagesArray.map(async (imageFile) => {
      const imageUploadResult = await uploadImageProduct(imageFile);

      return IMAGE.create({
        productId: product.id,
        publicId: imageUploadResult.public_id,
        imageUrlSecurity: imageUploadResult.secure_url,
        type:ImageType.PRODUCT
      });
    });

    const newImages = await Promise.all(newImagesPromises);

    await product.addImages(newImages);

    const updatedProduct = await PRODUCT.findByPk(productId, {
      include: "images",
    });

    return updatedProduct;
  } catch (error) {
    console.error("Error al agregar imágenes al producto:", error);
    throw new Error("Error al agregar imágenes al producto: " + error.message);
  }
}

export async function deleteProductImage(productId, imageId) {
  try {
    const product = await PRODUCT.findByPk(productId);

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    const image = await IMAGE.findByPk(imageId);

    if (!image) {
      throw new Error("Imagen no encontrada");
    }


    await deleteImageProduct(image.publicId);

    await image.destroy();

    return "Imagen eliminada correctamente";
  } catch (error) {
    console.error("Error al eliminar la imagen del producto:", error);
    throw new Error("Error al eliminar la imagen del producto: " + error.message);
  }
}

export async function getProduct(id) {
  try {
    const product = await PRODUCT.findByPk(id, {
      include: "images",
    });
    return product;
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    throw new Error("Error al obtener el producto: " + error.message);
  }
}


export async function getAllProducts() {
  try {
    const products = await PRODUCT.findAll({
      include: "images",
    });
    return products;
  } catch (error) {
    console.error("Error al obtener todos los productos:", error);
    throw new Error("Error al obtener todos los productos: " + error.message);
  }
}

export async function deleteProduct(productId) {
  try {
    const product = await PRODUCT.findByPk(productId);

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    const productImages = await IMAGE.findAll({
      where: {
        productId: product.id,
      },
    });

    for (const image of productImages) {
      await deleteImageProduct(image.publicId);
      await image.destroy();
    }
    await product.destroy();

    return "Producto y sus imágenes asociadas eliminados correctamente";
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    throw new Error("Error al eliminar el producto: " + error.message);
  }
}
