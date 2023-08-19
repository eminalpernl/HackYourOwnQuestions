import React from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";

function PublicQuestion({ question }) {
  const questionUrl = `/question/${question._id}`;

  return (
    <Link to={questionUrl} className="text-decoration-none">
      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between">
            <Card.Title>{question.question_title}</Card.Title>
            <p>
              {new Date(question.createdAt).toLocaleString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <Card.Text
            className="text-truncate"
            style={{ maxWidth: "100%", whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={{ __html: question.question_body }}
          />
          <div className="d-flex gap-2">
            <p>Share:</p>
            <div>
              <FacebookShareButton
                url={`https://c42-team-a.herokuapp.com/question/${question._id}`}
                quote={question.question_title}
                hashtag="#HYQ"
              >
                <FacebookIcon size={30} round />
              </FacebookShareButton>
            </div>
            <div>
              <TwitterShareButton
                url={`https://c42-team-a.herokuapp.com/question/${question._id}`}
                quote={question.question_title}
                hashtag="#HYQ"
              >
                <TwitterIcon size={30} round />
              </TwitterShareButton>
            </div>
            <div>
              <EmailShareButton
                subject={question.question_title}
                body={
                  "Please help me hack this question: " +
                  `${question.question_body}`
                }
                separator={" | "}
                url={`https://c42-team-a.herokuapp.com/question/${question._id}`}
              >
                <EmailIcon size={30} round />
              </EmailShareButton>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}

PublicQuestion.propTypes = {
  question: PropTypes.object,
};

export default PublicQuestion;
