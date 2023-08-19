import express from "express";
import {
  getAnswers,
  getAnswerByQuestionId,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  getReportedAnswers,
  reportAnswer,
} from "../controllers/answer.js";

const answerRouter = express.Router();

answerRouter.get("/", getAnswers);
answerRouter.post("/create", createAnswer);
answerRouter.get("/reported", getReportedAnswers);
answerRouter.get("/questions-answer/:id", getAnswerByQuestionId);
answerRouter.put("/report/:id", reportAnswer);
answerRouter.put("/update/:id", updateAnswer);
answerRouter.delete("/delete/:id", deleteAnswer);

export default answerRouter;
