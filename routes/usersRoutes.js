import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import * as usersController from "../controllers/usersControllers.js";
import validateBody from "../helpers/validateBody.js";
import { userSchema, subscriptionSchema } from "../schemas/usersSchemas.js";

const router = express.Router();

router.post("/register", validateBody(userSchema), usersController.register);
router.post("/login", validateBody(userSchema), usersController.login);
router.post("/logout", authMiddleware, usersController.logout);
router.get("/current", authMiddleware, usersController.getCurrentUser);
router.patch(
  "/",
  authMiddleware,
  validateBody(subscriptionSchema),
  usersController.updateSubscription
);

export default router;
