import * as usersService from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";
import gravatar from "gravatar";
import jimp from "jimp";
import path from "path";
import fs from "fs/promises";

export const register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const avatarURL = gravatar.url(
      email,
      { s: "100", r: "x", d: "retro" },
      true
    );
    const user = await usersService.registerUser(email, password, avatarURL);
    res.status(201).json({ user });
  } catch (error) {
    next(HttpError(409, error.message));
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await usersService.loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    next(HttpError(401, error.message));
  }
};

export const logout = async (req, res, next) => {
  try {
    await usersService.logoutUser(req.user._id);
    res.status(204).end();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await usersService.getCurrentUser(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};

export const updateSubscription = async (req, res, next) => {
  const { subscription } = req.body;

  try {
    const user = await usersService.updateSubscription(
      req.user._id,
      subscription
    );
    res.status(200).json(user);
  } catch (error) {
    next(HttpError(500, error.message));
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const { file } = req;
    const { id } = req.user;

    // Обробка зображення з jimp
    const img = await jimp.read(file.path);
    await img.resize(250, 250).writeAsync(file.path);

    // Переміщення файлу з tmp до public/avatars
    const fileName = Date.now() + path.extname(file.originalname);
    const newLocation = path.join("public", "avatars", fileName);
    await fs.rename(file.path, newLocation);

    // Оновлення avatarURL користувача
    const avatarURL = "/avatars/" + fileName;
    const user = await usersService.updateUser(id, { avatarURL });

    res.json({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
};
