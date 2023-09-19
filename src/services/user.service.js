import { uploadImageProfile } from "../config/cloudinary.js";
import USER from "../database/user.entity.js";
import bcrypt from "bcrypt";
import { generateToken } from "./jwt.service.js";

export async function createUser(userData, image) {
  try {
    const { password, email } = userData;

    // Verifica si el usuario ya existe
    const user = await findUserByEmail(email);
    if (user) {
      throw new Error("El usuario ya existe");
    }

    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUploadResult; 

    if (image) {
      imageUploadResult = await uploadImageProfile(image);
    }

    const newUser = await USER.create({
      ...userData,
      password: hashedPassword,
      profilePicture: imageUploadResult ? imageUploadResult.secure_url : null,
      profilePublicId: imageUploadResult ? imageUploadResult.public_id : null,
    });

    const token =  generateToken(newUser)
    return {newUser, token};
  } catch (error) {
    throw new Error("Error al crear el usuario: " + error.message);
  }
}

// En tu servicio de usuario (userService.js o similar)

// Función para cambiar la imagen de perfil del usuario
export async function updateUserProfileImage(userId, newImage) {
  try {
    // Verifica si el usuario existe
    const existingUser = await findUserById(userId);
    if (!existingUser) {
      throw new Error("Usuario no encontrado");
    }

    // Sube la nueva imagen de perfil
    const newImageUploadResult = await uploadImageProfile(newImage);

    // Borra la imagen anterior si existe
    if (existingUser.profilePublicId) {
      await deleteProfileImage(existingUser.profilePublicId);
    }

    // Actualiza la imagen de perfil del usuario en la base de datos
    await existingUser.update({
      profilePicture: newImageUploadResult.secure_url,
      profilePublicId: newImageUploadResult.public_id,
    });

    return existingUser;
  } catch (error) {
    throw new Error("Error al cambiar la imagen de perfil: " + error.message);
  }
}


export async function findUserById(userId) {
  try {
    const user = await USER.findByPk(userId);
    return user;
  } catch (error) {
    throw new Error("Error al buscar el usuario: " + error.message);
  }
}

export async function getAllUser() {
  try {
    const users = await USER.findAll();
    return users;
  } catch (error) {
    throw new Error("Error al buscar el usuario: " + error.message);
  }
}

export async function updateUser(id, updatedData) {
  try {
    const user = await USER.findByPk(id);

    if (user) {
      if ("password" in updatedData) {
        delete updatedData.password;
      }
      if ("email" in updatedData) {
        delete updatedData.email;
      }

      const data = await user.update(updatedData);
      return data;
    } else {
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    throw new Error("Error al actualizar el usuario: " + error.message);
  }
}

export async function deleteUser(userId) {
  try {
    const user = await USER.findByPk(userId);
    if (user) {
      await user.destroy();
      return "Usuario eliminado correctamente";
    } else {
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    throw new Error("Error al eliminar el usuario: " + error.message);
  }
}

export async function changePassword(id, newPassword) {
  try {
    const user = await USER.findByPk(id);

    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar la contraseña en la base de datos
      await user.update({ password: hashedPassword });
      return "Contraseña actualizada correctamente";
    } else {
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    throw new Error("Error al cambiar la contraseña: " + error.message);
  }
}

export async function changeEmail(id, newEmail) {
  try {
    const user = await USER.findByPk(id);

    if (user) {
      const existingUser = await findUserByEmail(newEmail);
      if (existingUser) {
        throw new Error("El email ya existe");
      }

      await user.update({ email: newEmail, status: "inactive" });
      return "Email actualizado correctamente";
    } else {
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    throw new Error("Error al cambiar el email: " + error.message);
  }
}

async function findUserByEmail(email) {
  try {
    const user = await USER.findOne({ where: { email } });
    return user;
  } catch (error) {
    throw new Error("Error al buscar el usuario: " + error.message);
  }
}
