import USER from "../database/user.entity.js";
import bcrypt from "bcrypt";
import { generateToken } from "./jwt.service.js";

export async function login(email, password) {
  try {
    const user = await USER.findOne({ where: { email } });
    if (!user) throw new Error("El usuario no existe");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("La contraseña es incorrecta");
    const token = generateToken(user)
    return { user, token };
  } catch (error) {
    throw new Error("Error al buscar el usuario: " + error.message);
  }
}

