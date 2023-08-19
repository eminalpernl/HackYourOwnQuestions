import mongoose from "mongoose";
import { catchError } from "../service/userError.js";
import { deleteAccount } from "../service/deletedAccount.js";
import { getUserDataBySession } from "../service/getUserData.js";
import { hashPassword } from "../service/hashPassword.js";
import { verifyHashPassword } from "../service/verifyHashPassword.js";
import { logError } from "../util/logging.js";
import User, { validateUser, validateUpdateUser } from "../models/User.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import validationErrorMessage from "../util/validationErrorMessage.js";
import { sendEmail } from "../service/email.js";

export const getUsers = async (req, res) => {
  try {
    const isAdmin = req.session.user.role === "admin";

    if (isAdmin) {
      const users = await User.find();
      res.status(200).json({ success: true, result: users });
    } else {
      res.status(403).json({
        success: false,
        message: "Unauthorized. You are not the owner of this question.",
      });
    }
  } catch (error) {
    logError(error);
    res
      .status(500)
      .json({ success: false, msg: "Unable to get users, try again later" });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ success: false, result: "Invalid user id" });
      return;
    }

    const user = await User.findById(id);
    if (user) {
      res.status(200).json({ success: true, user });
    } else {
      res.status(404).json({ success: false, result: "User not found" });
    }
  } catch (error) {
    logError(error);
    catchError(error, res);
  }
};

export const getUserBySession = async (req, res) => {
  getUserDataBySession(req, res);
};

export const getUserActivities = async (req, res) => {
  const { _id: id } = req.session.user;

  try {
    const questions = await Question.find({ user_id: id });
    const answers = await Answer.find({ user_id: id });
    if (questions.length > 0 || answers.length > 0) {
      res.status(200).json({ success: true, questions, answers });
    } else {
      res.status(200).json({ success: true, questions: [], answers: [] });
    }
  } catch (error) {
    logError(error);
    res
      .status(500)
      .json({ success: false, msg: "Unable to get answers, try again later" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { user } = req.body;
    const { email } = user;

    if (typeof user !== "object") {
      res.status(400).json({
        success: false,
        msg: `You need to provide a 'user' object. Received: ${JSON.stringify(
          user
        )}`,
      });
      return;
    }

    const userByEmail = await User.findOne({ email });
    if (userByEmail) {
      res.status(400).json({ success: false, msg: "Email is already in use" });
      return;
    }

    const errorList = validateUser(user);
    const password = await hashPassword(user.password);

    if (errorList.length > 0) {
      res
        .status(400)
        .json({ success: false, msg: validationErrorMessage(errorList) });
    } else {
      sendEmail(user, "register");
      const newUser = await User.create({ ...user, password });
      res.status(201).json({ success: true, user: newUser });
    }
  } catch (error) {
    logError(error);
    res
      .status(500)
      .json({ success: false, msg: "Unable to create user, try again later" });
  }
};

export const updateUser = async (req, res) => {
  const { user } = req.body;
  const { id } = req.params;

  if (typeof user !== "object") {
    res.status(400).json({
      success: false,
      msg: `You need to provide a 'user' object. Received: ${JSON.stringify(
        user
      )}`,
    });
    return;
  }

  const errorList = validateUpdateUser(user, res);

  if (errorList.length > 0) {
    res
      .status(400)
      .json({ success: false, msg: validationErrorMessage(errorList) });
  } else {
    const userDoc = await User.findById(id);
    sendEmail(userDoc, "update");
    await User.findByIdAndUpdate(id, user);
    res.status(200).json({ success: true, result: user });
  }
};

export const updateSecurity = async (req, res) => {
  try {
    const { user } = req.body;
    const { id } = req.params;

    if (typeof user !== "object") {
      res.status(400).json({
        success: false,
        msg: `You need to provide a 'user' object. Received: ${JSON.stringify(
          user
        )}`,
      });
      return;
    }

    const userData = await User.findById(id);
    if (!userData) {
      res.status(400).json({ success: false, message: "Invalid user id" });
      return;
    }

    const matchPassword = await verifyHashPassword(
      user.confirmPassword,
      userData.password
    );
    delete user.confirmPassword;

    if (matchPassword) {
      const errorList = validateUpdateUser(user, res);
      if (errorList.length > 0) {
        res
          .status(400)
          .json({ success: false, msg: validationErrorMessage(errorList) });
        return;
      }

      const newPassword = await hashPassword(user.password);
      user.password = newPassword;

      sendEmail(userData, "update");

      await User.findByIdAndUpdate(id, user);
      res.status(200).json({ success: true, result: "Updated!" });
    } else {
      res.status(404).json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      message: "Unable to update user, try again later",
    });
  }
};

export const checkPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      res.status(400).json({
        success: false,
        message: "Missing password or confirm password",
      });
      return;
    }

    const matchPassword = await verifyHashPassword(confirmPassword, password);

    if (matchPassword) {
      res.status(200).json({ success: true, message: "Password confirmed" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Password doesn't match" });
    }
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      message: "Unable to check password, please try again later",
    });
  }
};

export const deleteUser = async (req, res) => {
  const { password } = req.body;
  const { id } = req.params;

  try {
    const userData = await User.findById(id);
    if (!userData) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user id" });
    }

    const matchPassword = await verifyHashPassword(password, userData.password);
    if (matchPassword) {
      const user = await User.findByIdAndDelete(id);
      if (user) {
        const updatedQA = await deleteAccount(id);
        if (updatedQA) {
          return res
            .status(200)
            .clearCookie("sid")
            .json({ success: true, message: "User deleted" });
        }
      }
      return res
        .status(400)
        .json({ success: false, message: "Unable to find user" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    logError(error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete user, try again later",
    });
  }
};
