import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  // get token from cookie
  let signedToken = req.cookies.token;

  if (!signedToken) {
    return res.status(401).json({ message: "please login first" });
  }

  try {
    // verify token
    let decodedToken = jwt.verify(signedToken, "abcdef");
    // attach decoded data
    req.user = decodedToken;
    // allow request to continue
    next();
  } catch (err) {
    return res.status(401).json({ message: "invalid token" });
  }
}
