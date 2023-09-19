import { Router } from "express";
import {
  createUser,
  findUserById,
  getAllUser,
  updateUser,
  updateUserProfileImage,
} from "../services/user.service.js";
import { uploadOptions } from "../common/utils.js";
import fileUpload from "express-fileupload";
import { authenticateJWT, isAdmin } from "../middleware/middleware.js";

const userRoutes = Router();

userRoutes.get("/", authenticateJWT, isAdmin, async (req, res) => {
  try {
    console.log("res.user");
    console.log(req.user.email);
    const data = await getAllUser();
    if (!data) return res.status(400).json("Base de datos vacia");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
});

userRoutes.get("/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;
  try {
    const data = await findUserById(id);
    if (!data) return res.status(400).json("Base de datos vacia");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
});

userRoutes.post("/", fileUpload(uploadOptions), async (req, res) => {
  const user = req.body;
  const img = req.files?.image;
  try {
    console.log(req.files);
    const data = await createUser(user, img);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
});

userRoutes.put(
  "/:userId/profile-image",
  authenticateJWT,
  fileUpload(uploadOptions),
  async (req, res) => {
    const { userId } = req.params;
    const newImage = req.files?.image;
    try {
      const updatedUser = await updateUserProfileImage(userId, newImage);
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  }
);

userRoutes.put("/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;

  const updatedData = req.body;
  try {
    const data = await updateUser(id, updatedData);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
});

userRoutes.delete("/:id", authenticateJWT, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const data = await deleteUser(id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
});

export default userRoutes;
