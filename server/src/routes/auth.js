import { Router } from "express";
import { logIn, signUp, checkAuth, logOut } from "../controllers/auth.js";

const authRouter = Router();

// Sign up
authRouter.post("/register", signUp);
// Log in
authRouter.post("/login", logIn);
// Check auth, return userRole
authRouter.get("/", checkAuth);
// Log out
authRouter.post("/logout", logOut);

export default authRouter;
