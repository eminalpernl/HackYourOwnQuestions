import express from "express";
import {
  createUser,
  getUsers,
  getUserBySession,
  getUserActivities,
  updateUser,
  updateSecurity,
  deleteUser,
  getUserById,
  checkPassword,
} from "../controllers/user.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/profile", getUserBySession);
userRouter.get("/user-activities", getUserActivities);
userRouter.post("/create", createUser);
userRouter.post("/check", checkPassword);
userRouter.put("/update/:id", updateUser);
userRouter.put("/update-security/:id", updateSecurity);
userRouter.delete("/delete/:id", deleteUser);
userRouter.get("/:id", getUserById);

export default userRouter;
