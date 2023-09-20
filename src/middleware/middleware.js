// jwt-auth-middleware.js
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import USER from "../database/user.entity.js";

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey,
};

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await USER.findOne({ where: { id: jwtPayload.userId } });

      console.log(jwtPayload);
      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

export const authenticateJWT = passport.authenticate("jwt", { session: false });

export const isAdmin = (req, res, next) => {
  // Verificar si el usuario autenticado es un administrador
  if (req.user && req.user.isAdmin) {
    // El usuario es un administrador, continuar con la ejecución
    next();
  } else {
    // El usuario no es un administrador, devolver un error
    res
      .status(403)
      .json({ message: "Acceso no autorizado para administradores" });
  }
};
