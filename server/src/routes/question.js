import express from "express";
import {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getPaginatedQuestions,
  getReportedQuestions,
  reportQuestion,
} from "../controllers/question.js";

const questionRouter = express.Router();

questionRouter.get("/paginated-questions", getPaginatedQuestions);
questionRouter.get("/", getQuestions);
questionRouter.post("/create", createQuestion);
questionRouter.get("/reported", getReportedQuestions);
questionRouter.put("/update/:id", updateQuestion);
questionRouter.delete("/delete/:id", deleteQuestion);
questionRouter.put("/report/:id", reportQuestion);
questionRouter.get("/:id", getQuestion);

export default questionRouter;
