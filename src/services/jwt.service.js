import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

export function generateToken(user) {
  const { id, isAdmin } = user;
  const token = jwt.sign(
    { userId: id, admin: isAdmin },
    secretKey,
    {
      expiresIn: "1h",
    }
  );
  return token;
}
