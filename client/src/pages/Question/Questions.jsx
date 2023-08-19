import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import NavDropdown from "react-bootstrap/NavDropdown";
import Answer from "../../components/Answer";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Modal from "react-bootstrap/Modal";
import { useAuthContext } from "../../hooks/useAuthContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Question = () => {
  const navigate = useNavigate();
  const [textArea, setTextArea] = useState("");
  const [answers, setAnswers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  const [questionData, setQuestionData] = useState({});
  const [userData, setUserData] = useState({}); // State for user data
  const [smShow, setSmShow] = useState(false);
  const { id } = useParams();
  const { auth } = useAuthContext();

  const [isQuestionEditing, setIsQuestionEditing] = useState(false); // State for question editing
  const [editedQuestionTitle, setEditedQuestionTitle] = useState("");
  const [editedQuestionBody, setEditedQuestionBody] = useState("");
  const { performFetch: performCreateAnswer } = useFetch(
    "/answer/create",
    (res) => {
      if (res.success == true) {
        window.location.reload();
      }
    }
  );

  const { performFetch: fetchQuestion } = useFetch(
    `/question/${id}`,
    (data) => {
      setQuestionData(data.result);
    }
  );
  const { performFetch: fetchDeleteQuestion } = useFetch(
    `/question/delete/${id}`,
    () => {}
  );

  const { performFetch: fetchUserQuestion } = useFetch(
    `/user/${questionData.user_id}`,
    (data) => {
      setUserData(data.user);
    }
  );

  const { performFetch: fetchAnswers } = useFetch(
    `/answer/questions-answer/${id}`,
    (data) => setAnswers(data.answer)
  );

  const updateQuestion = useFetch(`/question/update/${id}`, () => {});
  const report = useFetch(`/question/report/${id}`, () => {});

  useEffect(() => {
    fetchQuestion();
    fetchAnswers();
    if (questionData.user_id) {
      fetchUserQuestion();
    }

    auth && setIsLoggedIn(true);
  }, [id, questionData.user_id, auth]);

  const handleSendAnswer = () => {
    if (textArea) {
      performCreateAnswer({
        method: "POST",
        body: JSON.stringify({
          answer: {
            answer: textArea,
            question_id: id,
          },
        }),
      });
    }
  };

  const handleDelete = () => {
    fetchDeleteQuestion({
      method: "DELETE",
    });
    setSmShow(true);
  };

  const handleCloseModal = () => {
    setSmShow(false);
    navigate("/");
  };

  const handleQuestionEditClick = () => {
    setEditedQuestionTitle(questionData.question_title);
    setEditedQuestionBody(questionData.question_body);
    setIsQuestionEditing(true);
  };

  const handleQuestionSaveClick = () => {
    const question = {
      question_title: editedQuestionTitle,
      question_body: editedQuestionBody,
    };
    updateQuestion.performFetch({
      method: "PUT",
      body: JSON.stringify({
        question,
      }),
    });
    setIsQuestionEditing(false);
    window.location.reload();
  };
  const handleQuestionCancelClick = () => {
    setIsQuestionEditing(false);
  };

  const handleReport = () => {
    report.performFetch({ method: "PUT" });
  };

  const styles = {
    height: "30vh",
  };

  if (!questionData || !userData) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Container className="position-relative">
        <Container className="mt-3 d-flex align-items-center gap-3">
          <div className="d-flex flex-column w-100">
            <div className="d-flex align-items-center gap-2">
              <div className="fs-6">{userData.firstName}</div>
              <div className="text-black-50 fs-6">
                {new Date(questionData.createdAt).toLocaleString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            {isQuestionEditing ? (
              <>
                <textarea
                  value={editedQuestionTitle}
                  onChange={(e) => setEditedQuestionTitle(e.target.value)}
                  className="form-control fs-3 fw-bold"
                >
                  {questionData.question_title}
                </textarea>
                <ReactQuill
                  value={editedQuestionBody}
                  onChange={(value) => setEditedQuestionBody(value)}
                  className="mb-5"
                  style={styles}
                />
                <button
                  className="btn btn-info w-25 m-1 "
                  onClick={handleQuestionSaveClick}
                >
                  save
                </button>
                <button
                  onClick={handleQuestionCancelClick}
                  className="btn btn-secondary w-25 m-1"
                >
                  cancel
                </button>
              </>
            ) : (
              <>
                <p className="fs-3 fw-bold">{questionData.question_title}</p>
                <div
                  className="mb-5"
                  dangerouslySetInnerHTML={{
                    __html: questionData.question_body,
                  }}
                ></div>
              </>
            )}
          </div>
          {questionData.user_id == auth?._id ? (
            <div>
              <NavDropdown title="more" id="navbarScrollingDropdown">
                <NavDropdown.Item onClick={handleQuestionEditClick}>
                  Edit
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleDelete}>
                  Delete
                </NavDropdown.Item>
                <NavDropdown.Item
                  className="text-danger"
                  onClick={handleReport}
                >
                  Report
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          ) : isLoggedIn ? (
            <NavDropdown title="more" id="navbarScrollingDropdown">
              <NavDropdown.Item className="text-danger" onClick={handleReport}>
                Report
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <div></div>
          )}
        </Container>
        {report?.error && (
          <>
            <div className="fs-6 text-danger position-absolute bottom-0 end-0">
              Already reported
            </div>
          </>
        )}
      </Container>
      {isLoggedIn ? (
        <div className="form-outline mb-4">
          <textarea
            className="form-control"
            id="textAreaExample6"
            rows="5"
            placeholder="Write your answer here..."
            onChange={(e) => setTextArea(e.target.value)}
          ></textarea>
          <div className="d-flex flex-row-reverse gap-3 justify-content-between align-items-center mt-3">
            <Button
              variant="info"
              size="sm"
              onClick={() => {
                handleSendAnswer();
              }}
            >
              Send Answer
            </Button>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning mt-3" role="alert">
          You need to <a href="/login">log in</a> or{" "}
          <a href="/register">register</a> to provide a response.
        </div>
      )}

      {answers.length > 0 && (
        <>
          <h2>Answers</h2>
          {answers.map((answer) => (
            <Answer
              key={answer._id}
              questionAnswers={answer.answer}
              answerDate={new Date(answer.createdAt).toLocaleString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              userData={answer}
              answerId={answer._id}
            />
          ))}
        </>
      )}
      <Modal
        size="sm"
        show={smShow}
        onHide={handleCloseModal}
        aria-labelledby="deleteQuestion"
      >
        <Modal.Header>
          <Modal.Title id="deleteQuestion">Delete Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>Question deleted successfully</Modal.Body>
        <Button variant="info" className="btn-sm" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal>
    </>
  );
};

export default Question;
