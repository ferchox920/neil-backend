
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import USER from "../database/user.entity.js";

dotenv.config();

async function createAdminIfNotExists() {
  try {
 
    const adminExists = await USER.findOne({ where: { isAdmin: true } });

    if (!adminExists) {

      await USER.create({
        isAdmin: true,
        fullname: process.env.ADMIN_FULLNAME,
        email: process.env.ADMIN_EMAIL,
        password: await  bcrypt.hash(process.env.ADMIN_PASSWORD, 10), 
        status: "active",
      });

      console.log("Administrador creado exitosamente.");
    } else {
      console.log("El administrador ya existe en la base de datos.");
    }
  } catch (error) {
    console.error("Error al crear el administrador:", error);
  }
}

export default createAdminIfNotExists;

