import Question, {
  validateQuestion,
  validateQuestionUpdate,
} from "../models/Question.js";
import { logError } from "../util/logging.js";
import validationErrorMessage from "../util/validationErrorMessage.js";
import mongoose from "mongoose";
import { performDelete } from "../service/question.js";

export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json({ success: true, result: questions });
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      msg: "Unable to get questions, try again later",
    });
  }
};

export const getQuestion = async (req, res) => {
  const questionId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    res.status(400).json({ success: false, msg: "Invalid question ID" });
    return;
  }

  try {
    const question = await Question.findById(questionId);
    if (question) {
      res.status(200).json({ success: true, result: question });
    }
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      msg: "Unable to get question, try again later",
    });
  }
};

export const getPaginatedQuestions = async (req, res) => {
  try {
    const allQuestions = await Question.find({}).sort({ createdAt: -1 });
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const lastIndex = page * limit;

    const results = {};
    results.totalQuestions = allQuestions.length;
    results.pageCount = Math.ceil(allQuestions.length / limit);

    if (lastIndex < allQuestions.length) {
      results.next = {
        page: page + 1,
      };
    }

    if (startIndex > 0) {
      results.prev = {
        page: page - 1,
      };
    }

    results.result = allQuestions.slice(startIndex, lastIndex);
    res.status(200).json({ success: true, result: results });
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      msg: "Unable to get questions, try again later",
    });
  }
};

export const createQuestion = async (req, res) => {
  try {
    let { question } = req.body;
    if (!req.session.user) {
      res
        .status(404)
        .json({ success: false, message: "you are not logged in" });
      return;
    }
    const user_id = req.session.user._id;
    question = { ...question, user_id };

    if (typeof question !== "object") {
      res.status(400).json({
        success: false,
        msg: `You need to provide a 'question' object. Received: ${JSON.stringify(
          question
        )}`,
      });

      return;
    }

    const errorList = validateQuestion(question);

    if (errorList.length > 0) {
      res
        .status(400)
        .json({ success: false, msg: validationErrorMessage(errorList) });
    } else {
      const newQuestion = await Question.create(question);

      res.status(201).json({ success: true, question: newQuestion });
    }
  } catch (error) {
    logError(error);
    res.status(500).json({
      success: false,
      msg: "Unable to create question, try again later",
    });
  }
};

export const updateQuestion = async (req, res) => {
  const { question } = req.body;
  const questionId = req.params.id;

  if (typeof question !== "object") {
    res.status(400).json({
      success: false,
      msg: `You need to provide a 'question' object. Received: ${JSON.stringify(
        question
      )}`,
    });
    return;
  }
  const errorList = validateQuestionUpdate(question, res);
  if (errorList.length > 0) {
    res
      .status(400)
      .json({ success: false, msg: validationErrorMessage(errorList) });
  } else {
    await Question.findByIdAndUpdate(questionId, question);
    res.status(200).json({ success: true, result: question });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const isAdmin = req.session.user.role === "admin";

    if (isAdmin) {
      await performDelete(questionId, res);
    } else {
      const question = await Question.findById(questionId);

      if (question) {
        const isOwner = question.user_id.valueOf() === req.session.user._id;

        if (isOwner) {
          await performDelete(questionId, res);
        } else {
          res.status(403).json({
            success: false,
            message: "Unauthorized. You are not the owner of this question.",
          });
        }
      } else {
        res
          .status(404)
          .json({ success: false, message: "Question not found." });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the question.",
    });
  }
};

export const getReportedQuestions = async (req, res) => {
  try {
    const isAdmin = req?.session?.user?.role === "admin";

    if (isAdmin) {
      const sortedQuestions = await Question.find({
        reported_by: { $exists: true, $ne: [] },
      }).sort({ reported_by: -1 });

      res.status(200).json({ success: true, questions: sortedQuestions });
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

export const reportQuestion = async (req, res) => {
  const question_id = req.params.id;
  try {
    const user_id = req?.session?.user._id;
    if (user_id) {
      const question = await Question.findById(question_id);
      if (question) {
        if (question.reported_by.includes(user_id)) {
          res.status(400).json({
            success: false,
            message: "You have already reported this question.",
          });
        } else {
          question.reported_by.push(user_id);
          await question.save();
          res.status(200).json({
            success: true,
            message: "Question reported successfully.",
          });
        }
      } else {
        res
          .status(404)
          .json({ success: false, message: "Question not found." });
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
