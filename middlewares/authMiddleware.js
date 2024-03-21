import jwt from "jsonwebtoken";
import User from "../db/user.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Not authorized" });
  }
  const [bearer, token] = authHeader.split(" ", 2);

  if (!authHeader || bearer !== "Bearer") {
    return res.status(401).send({ message: "Invalid token" });
  }

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId);

    if (!user || token !== user.token) {
      return res.status(401).send({ message: "Not authorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Not authorized" });
  }
};

export default authMiddleware;
