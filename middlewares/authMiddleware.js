import jwt from "jsonwebtoken";
import User from "../db/user.js";

const authMiddleware = async (req, res, next) => {
  const authorizationHeader = req.get("Authorization");

  if (!authorizationHeader) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authorizationHeader.replace("Bearer ", "");

  try {
    const userId = jwt.verify(token, process.env.JWT_SECRET).userId;
    const user = await User.findById(userId);

    if (!user || token !== user.token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

export default authMiddleware;