import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { logError } from "../util/logging.js";
dotenv.config();

export const sendEmail = (user, content, question = "") => {
  let subject, body;
  switch (content) {
    case "register":
      subject = "Welcome to HYQ";
      body = `
      <h3>Dear ${user.firstName} ${user.lastName}!,</h3>
      <p>Welcome to HYQ!</p>
      <p>We are excited to have you on board and ready to help you with all your programming questions and needs.</p>
      <p>HYQ is a community-driven platform where you can ask questions, share knowledge, and engage with other developers from around the world.</p>
      <p>Feel free to explore our website, ask questions, provide answers, and interact with fellow programmers.</p>
      <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team at c42hyfteama@gmail.com.</p>
      <p>Happy coding!</p>
      <a href='https://c42-team-a.herokuapp.com/'><p>The HYQ Team</p></a>
      `;
      break;
    case "update":
      subject = "Changes on Profile";
      body = `
      <h3>Dear ${user.firstName} ${user.lastName}!,</h3>
      <p>We want to inform you that there have been changes made to your profile information.</p>
      <p>If you made these changes, please ignore this message.</p>
      <p>If you didn't make these changes, please contact our support team at c42hyfteama@gmail.com.</p>
      <p>Happy coding!</p>
      <a href='https://c42-team-a.herokuapp.com/'><p>The HYQ Team</p></a>
      `;
      break;
    case "newAnswer":
      subject = "New Answer on Your HYQ Question";
      body = `<h3>Dear ${user.firstName} ${user.lastName}!,</h3>
      <p>We wanted to inform you that there is a new answer to your question on HYQ.</p>
      <a  href=https://c42-team-a.herokuapp.com/question/${question._id}>${question.question_title}</a> 
      <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team at c42hyfteama@gmail.com.</p>
      <p>Happy coding!</p>
      <a href='https://c42-team-a.herokuapp.com/'><p>The HYQ Team</p></a>
      `;
      break;
    default:
      break;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
  });

  const mailOptions = {
    from: "HYQ@gmail.com",
    to: user.email,
    subject: subject,
    html: body,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      logError(error);
    }
  });
};
