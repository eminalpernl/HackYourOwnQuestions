import User from "../models/User.js";
import { BadRequestError, responseBadRequestError } from "./userError.js";
import { verifyHashPassword } from "./verifyHashPassword.js";

export const getUserData = async (req) => {
  const email = req.body.user?.email;
  const password = req.body.user?.password;
  if (!email) {
    throw Error(BadRequestError("Please, send email "));
  }
  let userData = null;
  if (email) {
    userData = await User.findOne({ email: email });
  }
  if (!userData) {
    throw Error(BadRequestError("Sorry, can not find this account!"));
  }
  let matchPassword = await verifyHashPassword(password, userData.password);
  if (matchPassword) {
    return userData;
  } else {
    throw Error(
      BadRequestError("Incorrect password! check your password again.")
    );
  }
};

export const getUserDataBySession = async (req, res) => {
  const userId = req.session?.user?._id;

  try {
    const user = await User.find({ _id: userId });
    res.status(200).json({ success: true, result: user });
  } catch (error) {
    throw Error(responseBadRequestError());
  }
};
