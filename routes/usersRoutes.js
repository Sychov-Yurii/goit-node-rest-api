import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import * as usersController from "../controllers/usersControllers.js";
import validateBody from "../helpers/validateBody.js";
import { userSchema, subscriptionSchema } from "../schemas/usersShemas.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "tmp" });

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

router.patch(
  "/avatars",
  authMiddleware,
  upload.single("avatar"),
  usersController.updateAvatar
);

router.get("/verify/:verificationToken", (req, res) => {
  usersController.verifyUser(req, res);
});

router.post("/verify", usersController.resendVerificationEmail);

export default router;
