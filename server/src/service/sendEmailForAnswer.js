import Question from "../models/Question.js";
import User from "../models/User.js";
import { sendEmail } from "./email.js";

export const sendEmailForAnswer = async (answer) => {
  const { question_id } = answer;
  const question = await Question.findById(question_id);
  const { user_id } = question;
  const user = await User.findById(user_id);
  sendEmail(user, "newAnswer", question);
};
