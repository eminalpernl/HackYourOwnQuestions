import {
  addUserToSession,
  checkAuthentication,
  genSuccessAuthResObj,
} from "../service/auth.js";
import { createUser } from "./user.js";
import { getUserData } from "../service/getUserData.js";
import { logError } from "../util/logging.js";
import { catchError } from "../service/userError.js";

export const signUp = async (req, res) => {
  try {
    if (checkAuthentication(req))
      return res.status(400).json({
        success: false,
        msg: "You are already authenticated",
      });
    const userDoc = await createUser(req, res);
    if (!userDoc) return;
    addUserToSession(req.session, userDoc);
    res.status(200).json(genSuccessAuthResObj(req.session));
  } catch (error) {
    catchError(error, res);
  }
};

export const logIn = async (req, res) => {
  if (checkAuthentication(req))
    return res.status(400).json({
      success: false,
      msg: "You are already authenticated",
    });
  try {
    const userDoc = await getUserData(req, res);
    if (!userDoc) return;
    addUserToSession(req.session, userDoc);
    res.status(200).json(genSuccessAuthResObj(req.session));
  } catch (error) {
    catchError(error, res);
  }
};

export const checkAuth = (req, res) => {
  res.status(200).json(genSuccessAuthResObj(req.session));
};

export const logOut = (req, res) => {
  if (!checkAuthentication(req))
    return res.status(400).json({
      success: false,
      msg: "You are not authenticated. No need to log out",
    });
  req.session.destroy((err) => {
    if (err) {
      logError(err.message);
      res.status(500).json({ success: false, msg: err.message });
    }
  });
  res.clearCookie("sid");
  res.status(200).json(genSuccessAuthResObj(req.session));
};
