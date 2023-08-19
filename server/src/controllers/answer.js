import Answer, {
  validateAnswer,
  validateAnswerUpdate,
} from "../models/Answer.js";
import { logError } from "../util/logging.js";
import validationErrorMessage from "../util/validationErrorMessage.js";
import mongoose from "mongoose";
import { performDelete } from "../service/answer.js";
import { sendEmailForAnswer } from "../service/sendEmailForAnswer.js";

export const getAnswers = async (req, res) => {
  try {
    const answers = await Answer.find();
    res.status(200).json({ success: true, result: answers });
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      msg: "Unable to get answers, try again later",
    });
  }
};

export const getAnswerByQuestionId = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ success: false, result: "invalid question id" });
      return;
    }
    const answer = await Answer.find({ question_id: id }).sort({
      createdAt: -1,
    });
    if (answer) {
      res.status(200).json({ success: true, answer: answer });
    }
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      msg: "Unable to get answers, try again later",
    });
  }
};

export const createAnswer = async (req, res) => {
  try {
    let { answer } = req.body;

    if (!req.session.user) {
      res
        .status(404)
        .json({ success: false, message: "you are not logged in" });
      return;
    }
    const user_id = req.session.user._id;

    answer = { ...answer, user_id };
    if (typeof answer !== "object") {
      res.status(400).json({
        success: false,
        msg: `You need to provide a 'answer' object. Received: ${JSON.stringify(
          answer
        )}`,
      });

      return;
    }

    const errorList = validateAnswer(answer);

    if (errorList.length > 0) {
      res
        .status(400)
        .json({ success: false, msg: validationErrorMessage(errorList) });
    } else {
      const newAnswer = await Answer.create(answer);
      sendEmailForAnswer(answer);

      res.status(201).json({ success: true, answer: newAnswer });
    }
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      msg: "Unable to create answer, try again later",
    });
  }
};

export const updateAnswer = async (req, res) => {
  const { answer } = req.body;
  const answerId = req.params.id;

  if (typeof answer !== "object") {
    res.status(400).json({
      success: false,
      msg: `You need to provide a 'answer' object. Received: ${JSON.stringify(
        answer
      )}`,
    });
    return;
  }
  const errorList = validateAnswerUpdate(answer, res);
  if (errorList.length > 0) {
    res
      .status(400)
      .json({ success: false, msg: validationErrorMessage(errorList) });
  } else {
    await Answer.findByIdAndUpdate(answerId, answer);
    res.status(200).json({ success: true, result: answer });
  }
};

export const deleteAnswer = async (req, res) => {
  const answerId = req.params.id;
  try {
    const isAdmin = req.session.user.role === "admin";

    if (isAdmin) {
      await performDelete(answerId, res);
    } else {
      const answer = await Answer.findById(answerId);

      if (answer) {
        const isOwner = answer.user_id.valueOf() === req.session.user._id;

        if (isOwner) {
          await performDelete(answerId, res);
        } else {
          res.status(403).json({
            success: false,
            message: "Unauthorized. You are not the owner of this answer.",
          });
        }
      } else {
        res.status(404).json({ success: false, message: "Answer not found." });
      }
    }
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the answer.",
    });
  }
};

export const getReportedAnswers = async (req, res) => {
  try {
    const isAdmin = req?.session?.user?.role === "admin";

    if (isAdmin) {
      const sortedAnswers = await Answer.find({
        reported_by: { $exists: true, $ne: [] },
      }).sort({ reported_by: -1 });

      res.status(200).json({ success: true, answers: sortedAnswers });
    } else {
      res.status(401).json({ success: false, message: "Unauthorized person" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

export const reportAnswer = async (req, res) => {
  const answer_id = req.params.id;
  try {
    const user_id = req?.session?.user._id;
    if (user_id) {
      const answer = await Answer.findById(answer_id);
      if (answer) {
        if (answer.reported_by.includes(user_id)) {
          res.status(400).json({
            success: false,
            message: "You have already reported this answer.",
          });
        } else {
          answer.reported_by.push(user_id);
          await answer.save();
          res.status(200).json({
            success: true,
            message: "Answer reported successfully.",
          });
        }
      } else {
        res.status(404).json({ success: false, message: "Answer not found." });
      }
    } else {
      res.status(401).json({ success: false, message: "Unauthorized person." });
    }
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};
