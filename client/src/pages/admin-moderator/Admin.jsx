import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { Link } from "react-router-dom";
import UserEmail from "../../components/UserEmail";

function Admin() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const [deletedQuestionId, setDeletedQuestionId] = useState(null);
  const [deletedAnswerId, setDeletedAnswerId] = useState(null);

  const reportedQuestions = useFetch("/question/reported", (data) => {
    getQuestions(data);
  });

  const reportedAnswers = useFetch("/answer/reported", (data) => {
    getAnswers(data);
  });

  const deleteQuestion = useFetch(
    `/question/delete/${deletedQuestionId}`,
    () => {
      reportedQuestions.performFetch();
    }
  );
  const deleteAnswer = useFetch(`/answer/delete/${deletedAnswerId}`, () => {
    reportedAnswers.performFetch();
  });

  const getQuestions = (data) => {
    setQuestions(data.questions);
  };

  const getAnswers = (data) => {
    setAnswers(data.answers);
  };

  const handleDeleteQuestion = (id) => {
    setDeletedQuestionId(id);
  };
  const handleDeleteAnswer = (id) => {
    setDeletedAnswerId(id);
  };

  useEffect(() => {
    reportedQuestions.performFetch();
    reportedAnswers.performFetch();
  }, []);

  useEffect(() => {
    if (deletedQuestionId !== null) {
      deleteQuestion.performFetch({
        method: "DELETE",
      });
    }
  }, [deletedQuestionId]);

  useEffect(() => {
    if (deletedAnswerId !== null) {
      deleteAnswer.performFetch({
        method: "DELETE",
      });
    }
  }, [deletedAnswerId]);

  let questionContent = null;
  let answerContent = null;

  if (reportedQuestions.isLoading || reportedAnswers.isLoading) {
    questionContent = <div>loading...</div>;
    answerContent = <div>loading...</div>;
  } else if (reportedQuestions.error != null || reportedAnswers.error != null) {
    questionContent = <div>Error: {reportedQuestions.error.toString()}</div>;
    answerContent = <div>Error: {reportedAnswers.error.toString()}</div>;
  } else {
    const filteredQuestions = Object.values(questions)
      .filter((item) => item?.reported_by.length > 0)
      .map((question) => ({
        Question_Title: question.question_title,
        Question_ID: question._id,
        userID: question.user_id,
        reported: question.reported_by.length,
      }));
    const filteredAnswers = Object.values(answers)
      .filter((item) => item?.reported_by.length > 0)
      .map((answer) => ({
        Answer_ID: answer._id,
        Answer: `${answer.answer.substr(0, 20)}...`,
        userID: answer.user_id,
        reported: answer.reported_by.length,
        questionID: answer.question_id,
      }));
    questionContent = (
      <>
        <br />
        <h1>Reported Questions</h1>
        <br />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Question Title</th>
                        <th scope="col">User Email</th>
                        <th scope="col">Report Count</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuestions.map((q) => (
                        <tr key={q.Question_ID}>
                          <td>
                            <Link
                              className="text-decoration-none text-dark"
                              to={`/question/${q.Question_ID}`}
                            >
                              {q.Question_Title}
                            </Link>
                          </td>
                          <td>
                            <UserEmail userID={q.userID} />
                          </td>
                          <td>{q.reported}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm me-md-2"
                              onClick={() => {
                                handleDeleteQuestion(q.Question_ID);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );

    answerContent = (
      <>
        <br />
        <h1>Reported Answers</h1>
        <br />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Answer</th>
                        <th scope="col">User Email</th>
                        <th scope="col">Report Count</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAnswers.map((a) => (
                        <tr key={a.Answer_ID}>
                          <td>
                            <Link
                              className="text-decoration-none text-dark"
                              to={`/question/${a.questionID}`}
                            >
                              {a.Answer}
                            </Link>
                          </td>
                          <td>
                            <UserEmail userID={a.userID} />
                          </td>
                          <td>{a.reported}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm me-md-2"
                              onClick={() => {
                                handleDeleteAnswer(a.Answer_ID);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      {questionContent} <br /> {answerContent}
    </div>
  );
}

export default Admin;
