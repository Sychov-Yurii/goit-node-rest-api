import * as usersService from "../services/usersServices.js";
import gravatar from "gravatar";
import jimp from "jimp";
import path from "path";
import fs from "fs/promises";
import { sendVerificationEmail } from "../services/emailService.js";
import { nanoid } from "nanoid";

export const register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const verificationToken = nanoid();
    const avatarURL = gravatar.url(
      email,
      { s: "250", r: "x", d: "retro" },
      true
    );
    const user = await usersService.registerUser(
      email,
      password,
      avatarURL,
      verificationToken
    );
    await sendVerificationEmail(email, verificationToken);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await usersService.loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      throw new Error("User not authorized");
    }
    await usersService.logoutUser(req.user._id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      throw new Error("User not authorized");
    }
    const user = await usersService.getCurrentUser(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  const { subscription } = req.body;

  try {
    if (!req.user || !req.user._id || !subscription) {
      throw new Error("User ID and subscription are required");
    }
    const user = await usersService.updateSubscription(
      req.user._id,
      subscription
    );
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const { file } = req;
    const { id } = req.user;

    const img = await jimp.read(file.path);
    await img.resize(250, 250).writeAsync(file.path);

    const fileName = Date.now() + path.extname(file.originalname);
    const newLocation = path.join("public", "avatars", fileName);
    await fs.rename(file.path, newLocation);

    const avatarURL = "/avatars/" + fileName;
    const user = await usersService.updateUser(id, { avatarURL });

    res.json({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
};

export const verifyUser = async (req, res, next) => {
  const { verificationToken } = req.params;

  try {
    const user = await usersService.verifyUser(verificationToken);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User verified successfully", user });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "missing required field email" });
  }
  try {
    const user = await usersService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }
    const verificationToken = nanoid();
    user.verificationToken = verificationToken;
    await user.save();
    await sendVerificationEmail(email, verificationToken);
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};
