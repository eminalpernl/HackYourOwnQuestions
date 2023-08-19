import express from "express";
import cors from "cors";
import session from "express-session";
import userRouter from "./routes/user.js";
import questionRouter from "./routes/question.js";
import answerRouter from "./routes/answer.js";
import authRouter from "./routes/auth.js";
import connectMongoSession from "connect-mongodb-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const MongoDBSessionStore = connectMongoSession(session);

const { SESSION_SECRET, MONGODB_URL } = process.env;

// Create an express server
const app = express();

// Tell express to use the json middleware
app.use(express.json());
app.use(cookieParser());

const sessionStore = new MongoDBSessionStore({
  uri: MONGODB_URL,
  collection: "sessions",
});

// Init express-sessions
app.use(
  session({
    store: sessionStore,
    proxy: true,
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    name: "sid",
    cookie: {
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
    },
  })
);
// Allow everyone to access our API. In a real application, we would need to restrict this!
const corsOptions = {
  origin: ["https://c42-team-a.herokuapp.com/", "http://localhost:8080"], // Replace with the origin of your frontend application
  credentials: true,
};

app.use(cors(corsOptions));

/****** Attach routes ******/
/**
 * We use /api/ at the start of every route!
 * As we also host our client code on heroku we want to separate the API endpoints.
 */
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/question", questionRouter);
app.use("/api/answer", answerRouter);

export default app;
