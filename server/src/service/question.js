import Question from "../models/Question.js";
import Answer from "../models/Answer.js";

export const performDelete = async (questionId, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(questionId);

    if (deletedQuestion) {
      await deleteAnswer(questionId, res);
    } else {
      res.status(404).json({ success: false, message: "Question not found." });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the question.",
    });
  }
};

const deleteAnswer = async (questionId, res) => {
  try {
    const deletedAnswers = await Answer.deleteMany({ question_id: questionId });

    if (deletedAnswers.deletedCount > 0) {
      res.status(200).json({
        success: true,
        message: "Question and related answers successfully deleted.",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Question deleted. No related answers found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the answers.",
    });
  }
};
