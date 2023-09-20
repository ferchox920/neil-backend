// Importa la función para subir la imagen de perfil desde el archivo de configuración
import { uploadImageProfile } from "../config/cloudinary.js";

// Importa el modelo de datos de usuario desde el archivo '../database/user.entity.js'
import USER from "../database/user.entity.js";

// Importa el módulo 'bcrypt' para el cifrado de contraseñas
import bcrypt from "bcrypt";

// Importa la función 'generateToken' desde el archivo './jwt.service.js'
import { generateToken } from "./jwt.service.js";

// Función para crear un nuevo usuario
export async function createUser(userData, image) {
  try {
    const { password, email } = userData;

    if(userData.isAdmin){
      throw new Error("Acceso no autorizado para administradores");
    }
    // Verifica si el usuario ya existe
    const user = await findUserByEmail(email);
    if (user) {
      throw new Error("El usuario ya existe");
    }

    // Hashea la contraseña // *Hashing es un proceso criptográfico que convierte una cadena 
    //* de caracteres, como una contraseña, en una representación fija de longitud fija llamada "hash" y 10
    //* es el nivel de trabajo en crear el "hash". 
    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUploadResult;

    if (image) {
      // Sube la imagen de perfil si se proporciona una
      imageUploadResult = await uploadImageProfile(image);
    }

    // Crea un nuevo usuario en la base de datos
    const newUser = await USER.create({
      ...userData,
      password: hashedPassword,
      profilePicture: imageUploadResult ? imageUploadResult.secure_url : null,
      profilePublicId: imageUploadResult ? imageUploadResult.public_id : null,
    });

    // Genera un token JWT para el nuevo usuario
    const token = generateToken(newUser);
    
    // Devuelve el nuevo usuario y el token generado
    return { newUser, token };
  } catch (error) {
    // Lanza un error en caso de problemas
    throw new Error("Error al crear el usuario: " + error.message);
  }
}

// Función para cambiar la imagen de perfil del usuario
export async function updateUserProfileImage(userId, newImage) {
  try {
    // Verifica si el usuario existe
    const existingUser = await findUserById(userId);
    if (!existingUser) {
      throw new Error("Usuario no encontrado");
    }

    if(existingUser.isAdmin){
      throw new Error("Acceso no autorizado para administradores");
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

    // Devuelve el usuario actualizado
    return existingUser;
  } catch (error) {
    throw new Error("Error al cambiar la imagen de perfil: " + error.message);
  }
}

// Función para buscar un usuario por su ID
export async function findUserById(userId) {
  try {
    const user = await USER.findByPk(userId);
    return user;
  } catch (error) {
    throw new Error("Error al buscar el usuario: " + error.message);
  }
}

// Función para obtener todos los usuarios
/*
export async function getAllUser() {
  try {
    const users = await USER.findAll();
    return users;
  } catch (error) {
    throw new Error("Error al buscar el usuario: " + error.message);
  }
}
*/

// Función para obtener todos los usuarios menos los admin
export async function getAllUser() {
  try {
    const users = await USER.findAll({
      where: {
        isAdmin: false, // Excluye al usuario administrador
      },
    });
    return users;
  } catch (error) {
    throw new Error("Error al buscar los usuarios: " + error.message);
  }
}


// Función para actualizar un usuario por su ID
export async function updateUser(id, updatedData) {
  try {
    // Busca al usuario por su ID
    const user = await USER.findByPk(id);

    if (user) {
      // Verifica si la contraseña o el correo electrónico están en los datos actualizados y los elimina para evitar cambios no autorizados
      if ("password" in updatedData) {
        delete updatedData.password;
      }
      if ("email" in updatedData) {
        delete updatedData.email;
      }

      // Actualiza los datos del usuario en la base de datos
      const data = await user.update(updatedData);
      return data;
    } else {
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    throw new Error("Error al actualizar el usuario: " + error.message);
  }
}

// Función para eliminar un usuario por su ID
/*
export async function deleteUser(userId) {
  try {
    // Busca al usuario por su ID
    const user = await USER.findByPk(userId);

    if (user) {
      // Elimina el usuario de la base de datos
      await user.destroy();
      return "Usuario eliminado correctamente";
    } else {
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    throw new Error("Error al eliminar el usuario: " + error.message);
  }
}
*/

// Función para eliminar un usuario por su ID excepto que sea admin
export async function deleteUser(userId) {
  try {
    const user = await USER.findByPk(userId);

    if (user) {
      // Verifica si el usuario no es administrador antes de eliminarlo
      if (!user.isAdmin) {
        await user.destroy();
        return "Usuario eliminado correctamente";
      } else {
        throw new Error("No puedes eliminar al administrador");
      }
    } else {
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    throw new Error("Error al eliminar el usuario: " + error.message);
  }
}


// Función para cambiar la contraseña de un usuario por su ID
export async function changePassword(id, newPassword) {
  try {
    // Busca al usuario por su ID
    const user = await USER.findByPk(id);

    if (user) {
      if(user.isAdmin){
        throw new Error("Acceso no autorizado para administradores");
      }
      // Hashea la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Actualiza la contraseña en la base de datos
      await user.update({ password: hashedPassword });
      return "Contraseña actualizada correctamente";
    } else {
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    throw new Error("Error al cambiar la contraseña: " + error.message);
  }
}

// Función para cambiar el correo electrónico de un usuario por su ID
export async function changeEmail(id, newEmail) {
  try {
    // Busca al usuario por su ID
    const user = await USER.findByPk(id);

    if (user) {
      if(user.isAdmin){
        throw new Error("Acceso no autorizado para administradores");
      }
      // Verifica si el nuevo correo electrónico ya existe
      const existingUser = await findUserByEmail(newEmail);
      if (existingUser) {
        throw new Error("El email ya existe");
      }
      // Actualiza el correo electrónico del usuario y cambia su estado a "inactivo"
      await user.update({ email: newEmail, status: "inactive" });
      return "Email actualizado correctamente";
    } else {
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    throw new Error("Error al cambiar el email: " + error.message);
  }
}

// Función para buscar un usuario por su dirección de correo electrónico
async function findUserByEmail(email) {
  try {
    const user = await USER.findOne({ where: { email } });
    return user;
  } catch (error) {
    throw new Error("Error al buscar el usuario: " + error.message);
  }
}
