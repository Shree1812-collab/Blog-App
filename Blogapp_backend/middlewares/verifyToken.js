import jwt from "jsonwebtoken";
import { config } from "dotenv";

config(); // load env variables

export const verifyToken = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
        //read tokens from cookies
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Please login" });
      }

      // verify token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // check role authorization
      if (!allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      // attach user info to request
      req.user = {
        id: decodedToken.id,
        role: decodedToken.role,
        email: decodedToken.email
      };

      next();
    } catch (error) {
        //jwt verify throws if token is invalid or expired
        if(error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired. Please login again." });
        }
        if(error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
    }
  };
};