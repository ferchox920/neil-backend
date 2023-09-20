import ORDER from "../database/order.entity.js";
import PRODUCT from "../database/product.entity.js";
import USER from "../database/user.entity.js";

export async function createOrder(userId, orderDetails) {
    try {
      const user = await USER.findByPk(userId);
  
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
  
      // Calcular el totalAmount sumando los precios de los productos
      let totalAmount = 0;
  
      for (const productDetail of orderDetails.products) {
        const product = await PRODUCT.findByPk(productDetail.productId);
  
        if (!product) {
          throw new Error(`Producto con ID ${productDetail.productId} no encontrado`);
        }
  
        // Verificar si hay suficiente stock disponible
        if (product.quantity < productDetail.quantity) {
          throw new Error(`No hay suficiente stock para el producto ${product.name}`);
        }
  
        // Reducir la cantidad de productos en stock
        product.quantity -= productDetail.quantity;
        await product.save();
  
        // Agregar el precio del producto multiplicado por la cantidad
        totalAmount += product.price * productDetail.quantity;
      }
  
      const order = await ORDER.create({
        userId,
        totalAmount,
        orderStatus: "pending",
        orderDetails: orderDetails.products,
      });
  
      return order;
    } catch (error) {
      throw new Error("Error al crear el pedido: " + error.message);
    }
  }