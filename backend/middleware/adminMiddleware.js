import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const adminProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Not authorized as admin" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Token failed or expired" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

export { adminProtect };
