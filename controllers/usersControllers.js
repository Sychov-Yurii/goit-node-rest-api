import * as usersService from "../services/usersServices.js";

export const register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await usersService.registerUser(email, password);
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
    console.log(req.user);
    console.log(req.user._id);
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
