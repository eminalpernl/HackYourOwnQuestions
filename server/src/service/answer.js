import Answer from "../models/Answer.js";
import { logError } from "../util/logging.js";

export const performDelete = async (answerId, res) => {
  try {
    const deletedAnswer = await Answer.findByIdAndDelete(answerId);

    if (deletedAnswer) {
      res
        .status(200)
        .json({ success: true, message: "Answer successfully deleted." });
    }
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the answer.",
    });
  }
};
