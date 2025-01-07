import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyTokenforRole = (req, res, next) => {
  const token =
    req.cookies.access_token || req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token is missing or invalid" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token is not valid" });
    }
    req.user = user; // Store the decoded user data
    next();
  });
};
