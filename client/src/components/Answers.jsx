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

function Answers({ answer }) {
  const questionUrl = `/question/${answer.question_id}`;

  return (
    <Link to={questionUrl} className="text-decoration-none">
      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between">
            <p>
              {new Date(answer.createdAt).toLocaleString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <Card.Text className="text-truncate " style={{ maxWidth: "100%" }}>
            {answer.answer}
          </Card.Text>
          <div className="d-flex gap-2">
            <p>Share:</p>
            <div>
              <FacebookShareButton
                url={"https://www.example.com"}
                quote={"Dummy text!"}
                hashtag="#muo"
              >
                <FacebookIcon size={30} round />
              </FacebookShareButton>
            </div>
            <div>
              <TwitterShareButton
                url={"https://www.example.com"}
                quote={"Dummy text!"}
                hashtag="#muo"
              >
                <TwitterIcon size={30} round />
              </TwitterShareButton>
            </div>
            <div>
              <EmailShareButton
                subject={"Please help me hack this question"}
                body={"How to use React with Bootstrap"}
                separator={"|"}
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

Answers.propTypes = {
  answer: PropTypes.object,
};

export default Answers;
