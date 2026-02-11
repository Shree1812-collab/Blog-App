import jwt from "jsonwebtoken";
import { config } from "dotenv";

config(); // load env variables

export const verifyToken = async (req, res, next) => {
    // read token from cookies
    let token = req.cookies?.token;

    // if token not present
    if (!token) {
        return res.status(400).json({ message: "Please login" });
    }

    // verify the validity of token (decode token)
    let decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // store decoded data in request
    req.user = {
    id: decodedToken.id,
    role: decodedToken.role,
    email: decodedToken.email
  };

    // forward request to next middleware / route
    next();
    //return res.status(401).json({ message: "Invalid token" });
};
