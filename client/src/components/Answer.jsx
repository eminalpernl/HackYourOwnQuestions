import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Card from "react-bootstrap/Card";
import PropTypes from "prop-types";
import useFetch from "../hooks/useFetch";
import Modal from "react-bootstrap/Modal";
import { useAuthContext } from "../hooks/useAuthContext";

const Answer = ({ questionAnswers, answerDate, userData, answerId }) => {
  const [smShow, setSmShow] = useState(false);
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAnswerEditing, setIsAnswerEditing] = useState(false);
  const [editedAnswer, setEditedAnswer] = useState("");
  const { auth } = useAuthContext();

  const handleAnswerSaveClick = () => {
    const answer = {
      answer: editedAnswer,
    };
    updateAnswer.performFetch({
      method: "PUT",
      body: JSON.stringify({
        answer,
      }),
    });
    setIsAnswerEditing(false);
    window.location.reload();
  };
  const handleAnswerEditClick = () => {
    setEditedAnswer(questionAnswers);
    setIsAnswerEditing(true);
  };
  const handleAnswerCancelClick = () => {
    setIsAnswerEditing(false);
  };
  const updateAnswer = useFetch(`/answer/update/${userData._id}`);
  const { performFetch: performUserFetch } = useFetch(
    `/user/${userData.user_id}`,
    (data) => {
      setUser(data.user);
    }
  );
  const { performFetch: performDeleteAnswer } = useFetch(
    `/answer/delete/${answerId}`,
    () => {}
  );

  const report = useFetch(`/answer/report/${answerId}`, () => {});

  useEffect(() => {
    performUserFetch();
  }, [userData]);

  const handleDelete = () => {
    performDeleteAnswer({
      method: "DELETE",
    });
    setSmShow(true);
  };
  const handleCloseModal = () => {
    setSmShow(false);
    window.location.reload();
  };
  useEffect(() => {
    auth && setIsLoggedIn(true);
  }, [auth]);

  const handleReport = () => {
    report.performFetch({ method: "PUT" });
  };

  return (
    <div className="mt-5" fluid="true">
      <Card>
        <Card.Header as="h5" className="d-flex gap-2 align-items-center">
          <div>{user.firstName}</div>
          <div className="text-black-50 fs-6 me-auto">{answerDate}</div>

          {auth?._id === userData.user_id ? (
            <Dropdown className="float-end" size="sm">
              <Dropdown.Toggle
                split
                variant="secondary"
                id="dropdown-split-basic"
              >
                more{" "}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleAnswerEditClick}>
                  Edit
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleReport} className="text-danger">
                  Report
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : isLoggedIn ? (
            <Dropdown className="float-end" size="sm">
              <Dropdown.Toggle
                split
                variant="secondary"
                id="dropdown-split-basic"
              >
                more{" "}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleReport} className="text-danger">
                  Report
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <div></div>
          )}
        </Card.Header>

        <Card.Body>
          {isAnswerEditing ? (
            <>
              <textarea
                className="from-control m-3 w-75"
                value={editedAnswer}
                onChange={(e) => setEditedAnswer(e.target.value)}
              ></textarea>
              <button
                className="btn btn-info w-25 m-1 "
                onClick={handleAnswerSaveClick}
              >
                save
              </button>
              <button
                onClick={handleAnswerCancelClick}
                className="btn btn-secondary w-25 m-1"
              >
                cancel
              </button>
            </>
          ) : (
            <Card.Text>{questionAnswers}</Card.Text>
          )}
        </Card.Body>
      </Card>
      <Modal size="sm" show={smShow} aria-labelledby="deleteQuestion">
        <Modal.Header>
          <Modal.Title id="deleteQuestion">Delete Answer</Modal.Title>
        </Modal.Header>
        <Modal.Body>Answer deleted successfully</Modal.Body>
        <Button variant="info" className="btn-sm" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal>
    </div>
  );
};

Answer.propTypes = {
  questionAnswers: PropTypes.string,
  answerDate: PropTypes.string,
  userData: PropTypes.object,
  answerId: PropTypes.string,
};

export default Answer;
