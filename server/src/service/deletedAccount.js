import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import { logError } from "../util/logging.js";

export const deleteAccount = async (userId) => {
  const deleteAccountId = "649f079ef958a6a015698539";
  try {
    const questions = await Question.updateMany(
      { user_id: userId },
      { user_id: deleteAccountId }
    );

    const answers = await Answer.updateMany(
      { user_id: userId },
      { user_id: deleteAccountId }
    );

    return questions && answers;
  } catch (error) {
    logError(error);
    throw new Error("Unable to update questions and answers");
  }
};
