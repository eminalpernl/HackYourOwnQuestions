import mongoose from "mongoose";
import validateAllowedFields from "../util/validateAllowedFields.js";

const { Schema } = mongoose;
const questionSchema = new mongoose.Schema(
  {
    question_title: { type: String, required: true },
    question_body: { type: String },
    reported_by: { type: Array },
    user_id: { type: Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const Question = mongoose.model("questions", questionSchema);

export const validateQuestion = (questionObject) => {
  const errorList = [];
  const allowedKeys = [
    "question_body",
    "question_title",
    "reported_by",
    "user_id",
  ];

  const validatedKeysMessage = validateAllowedFields(
    questionObject,
    allowedKeys
  );

  if (validatedKeysMessage.length > 0) {
    errorList.push(validatedKeysMessage);
  }

  if (questionObject.question_title < 1) {
    errorList.push("question_title is a required field");
  }

  return errorList;
};

export const validateQuestionUpdate = (questionObject) => {
  const errorList = [];
  const allowedKeys = ["question_body", "question_title", "reported_by"];

  const validatedKeysMessage = validateAllowedFields(
    questionObject,
    allowedKeys
  );

  if (validatedKeysMessage.length > 0) {
    errorList.push(validatedKeysMessage);
  }

  if (
    questionObject.question_title &&
    questionObject.question_title.length < 1
  ) {
    errorList.push("question_title is a required field");
  }

  return errorList;
};

export default Question;
