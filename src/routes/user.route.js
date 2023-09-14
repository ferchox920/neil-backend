import { Router } from "express";
import {
  createUser,
  findUserById,
  getAllUser,
  updateUser,
} from "../services/user.service.js";

const userRoutes = Router();

userRoutes.get("/", async (req, res) => {
  try {
    const data = await getAllUser();
    if (!data) return res.status(400).json("Base de datos vacia");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
});

userRoutes.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await findUserById(id);
    if (!data) return res.status(400).json("Base de datos vacia");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
});

userRoutes.post("/", async (req, res) => {
  const user = req.body;

  try {
    const data = await createUser(user);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
});
userRoutes.put("/:id", async (req, res) => {
  const { id } = req.params;

  const updatedData = req.body;
  try {
    const data = await updateUser( id , updatedData);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
});

userRoutes.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const data = await deleteUser(id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
});

export default userRoutes;
