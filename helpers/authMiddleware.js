import jwt, { decode } from "jsonwebtoken";
import User from "../models/user.js";

export function authMiddleware(req, res, next) {
  const authToken = req.headers.authorization;

  if (typeof authToken === "undefined") {
    return res.status(401).send({ message: "Not authorized" });
  }

  const [bearer, token] = authToken.split(" ", 2);

  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Not authorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (error, decode) => {
    if (error) {
      return res.status(401).send({ message: "Not authorized" });
    }
    try {
      const user = await User.findById(decode.id);

      if (user === null) {
        return res.status(401).send({ message: "Not authorized" });
      }

      if (user.token !== token) {
        return res.status(401).send({ message: "Not authorized" });
      }

      req.user = {
        id: decode.id,
        email: decode.email,
      };

      next();
    } catch (error) {
      next(error);
    }
  });
}
