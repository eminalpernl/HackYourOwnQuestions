import mongoose from "mongoose";

import validateAllowedFields from "../util/validateAllowedFields.js";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userRole: { type: String, default: "regular" },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    reported_by: { type: Array },
    bio: { type: String },
  },
  { timestamps: { createdAt: "createdAt" } }
);

const User = mongoose.model("users", userSchema);

export const validateUser = (userObject) => {
  const errorList = [];
  const allowedKeys = [
    "firstName",
    "lastName",
    "userRole",
    "bio",
    "email",
    "password",
    "reported_by",
  ];

  const validatedKeysMessage = validateAllowedFields(userObject, allowedKeys);

  if (validatedKeysMessage.length > 0) {
    errorList.push(validatedKeysMessage);
  }

  if (userObject.firstName == null) {
    errorList.push("first name is a required field");
  }
  if (userObject.lastName == null) {
    errorList.push("last name is a required field");
  }

  if (userObject.email == null) {
    errorList.push("email is a required field");
  }
  if (userObject.password == null) {
    errorList.push("password is required");
  }

  if (userObject.password && userObject.password.length < 8) {
    errorList.push("password must be longer then 8 characters");
  }

  return errorList;
};

export const validateUpdateUser = (userObject) => {
  const errorList = [];
  const allowedKeys = [
    "firstName",
    "lastName",
    "userRole",
    "email",
    "bio",
    "password",
    "reported_by",
  ];

  const validatedKeysMessage = validateAllowedFields(userObject, allowedKeys);

  if (validatedKeysMessage.length > 0) {
    errorList.push(validatedKeysMessage);
  }
  if (
    typeof userObject.firstName !== "undefined" &&
    userObject.firstName.length < 1
  ) {
    errorList.push("first name is a required field");
  }

  if (
    typeof userObject.lastName !== "undefined" &&
    userObject.lastName.length < 1
  ) {
    errorList.push("last name is a required field");
  }

  if (typeof userObject.email !== "undefined" && userObject.email.length < 1) {
    errorList.push("email is a required field");
  }

  if (
    typeof userObject.password !== "undefined" &&
    userObject.password.length < 8
  ) {
    errorList.push("password must be longer then 8 digit");
  }
  if (typeof userObject.userRole !== "undefined" && userObject.userRole < 1) {
    errorList.push("first role is a required field");
  }

  return errorList;
};

export default User;
