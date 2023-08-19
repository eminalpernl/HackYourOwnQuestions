import { logError } from "../util/logging.js";

// Response in case server error
export const responseServerError = (error, res) => {
  logError(error);
  res.status(500).json({
    success: false,
    msg: "Unable to update user, try again later",
  });
};

// Response in case bad request Error
export const responseBadRequestError = (error, res) => {
  const objectError = JSON.parse(error.message);
  if (objectError.status) {
    res
      .status(objectError.status)
      .json({ success: false, msg: objectError.msg });
  }
};

export const catchError = (error, res) => {
  if (error.code) {
    responseServerError(error, res);
  } else {
    responseBadRequestError(error, res);
  }
};

export const BadRequestError = (message) => {
  return JSON.stringify({
    status: 400,
    msg: message,
  });
};
