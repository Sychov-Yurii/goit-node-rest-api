import * as usersService from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";

export const register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await usersService.registerUser(email, password);
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
