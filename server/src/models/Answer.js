import mongoose from "mongoose";
import validateAllowedFields from "../util/validateAllowedFields.js";
const { Schema } = mongoose;
const answerSchema = new mongoose.Schema(
  {
    answer: { type: String, required: true },
    reported_by: { type: Array },
    user_id: { type: Schema.Types.ObjectId, ref: "users" },
    question_id: { type: Schema.Types.ObjectId, ref: "questions" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export const validateAnswer = (answerObject) => {
  const errorList = [];
  const allowedKeys = ["answer", "reported_by", "user_id", "question_id"];

  const validatedKeysMessage = validateAllowedFields(answerObject, allowedKeys);

  if (validatedKeysMessage.length > 0) {
    errorList.push(validatedKeysMessage);
  }

  if (answerObject.answer == null) {
    errorList.push("Answer is a required field");
  }

  return errorList;
};

export const validateAnswerUpdate = (answerObject) => {
  const errorList = [];
  const allowedKeys = ["answer", "reported_by", "user_id", "question_id"];

  const validatedKeysMessage = validateAllowedFields(answerObject, allowedKeys);

  if (validatedKeysMessage.length > 0) {
    errorList.push(validatedKeysMessage);
  }

  if (answerObject.answer && answerObject.answer == null) {
    errorList.push("question_title is a required field");
  }

  return errorList;
};

const Answer = mongoose.model("answers", answerSchema);

export default Answer;
