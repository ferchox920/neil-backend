import { Router } from "express";
import { login } from "../services/auth.service.js";

const authRoutes = Router();

authRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await login(email, password);
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
});

export default authRoutes;
