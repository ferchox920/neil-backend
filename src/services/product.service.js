import PRODUCT from "../database/product.entity.js";

export async function createProduct(body){
    const newProduct = await PRODUCT.create(body);
    return newProduct
}

export async function getProduct(id){
    const product = await PRODUCT.findByPk(id);
    return product
}

export async function getAllProducts(){
    const products = await PRODUCT.findAll();
    return products
}