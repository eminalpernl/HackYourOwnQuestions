import React, { useState, useEffect } from "react";
import PublicQuestion from "../../components/PublicQuestions";
import Answers from "../../components/Answers";
import useFetch from "../../hooks/useFetch";

const MyActivities = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const API = "/user/user-activities";
  const { isLoading, error, performFetch } = useFetch(API, (data) => {
    getData(data);
  });

  const getData = (data) => {
    setQuestions(data.questions);
    setAnswers(data.answers);
  };

  useEffect(() => {
    performFetch();
  }, []);

  const filteredQuestions = () => {
    if (filter === "all") {
      return questions;
    } else if (filter === "custom-range" && startDate && endDate) {
      const filteredStartTime = startDate.getTime();
      const filteredEndTime = endDate.getTime();

      return questions.filter((question) => {
        const questionDate = new Date(question.createdAt);
        const questionTime = questionDate.getTime();
        return (
          questionTime >= filteredStartTime &&
          questionTime <= filteredEndTime + 86400000
        );
      });
    } else {
      const currentDate = new Date();
      const timeLimit = {
        "last-24-hours": 24 * 60 * 60 * 1000,
        "last-7-days": 7 * 24 * 60 * 60 * 1000,
        "last-30-days": 30 * 24 * 60 * 60 * 1000,
      };
      const filteredTime = currentDate.getTime() - timeLimit[filter];
      return questions.filter((question) => {
        const questionDate = new Date(question.createdAt);
        return questionDate.getTime() > filteredTime;
      });
    }
  };

  const filteredAnswers = () => {
    if (filter === "all") {
      return answers;
    } else if (filter === "custom-range" && startDate && endDate) {
      const filteredStartTime = startDate.getTime();
      const filteredEndTime = endDate.getTime();
      return answers.filter((answer) => {
        const answerDate = new Date(answer.createdAt);
        const answerTime = answerDate.getTime();
        return (
          answerTime >= filteredStartTime &&
          answerTime <= filteredEndTime + 86400000
        );
      });
    } else {
      const currentDate = new Date();
      const timeLimit = {
        "last-24-hours": 24 * 60 * 60 * 1000,
        "last-7-days": 7 * 24 * 60 * 60 * 1000,
        "last-30-days": 30 * 24 * 60 * 60 * 1000,
      };
      const filteredTime = currentDate.getTime() - timeLimit[filter];
      return answers.filter((answer) => {
        const answerDate = new Date(answer.createdAt);
        return answerDate.getTime() > filteredTime;
      });
    }
  };

  let content = null;

  if (isLoading) {
    content = <div>loading...</div>;
  } else if (error != null) {
    content = <div>Error: {error.toString()}</div>;
  } else {
    content = (
      <>
        <div className="container mt-3 d-flex flex-column gap-4">
          <div>
            <select
              className="form-select form-select-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ width: "150px" }}
            >
              <option value="all">Filter by date:</option>
              <option value="all">All</option>
              <option value="last-24-hours">Last 24 Hours</option>
              <option value="last-7-days">Last 7 Days</option>
              <option value="last-30-days">Last 30 Days</option>
              <option value="custom-range">Custom Range</option>
            </select>
          </div>

          {filter === "custom-range" && (
            <div className="container">
              <h6>Pick Start & End Date </h6>
              <div className="form-horizontal">
                <div className="row">
                  <div className="col-sm-8">
                    <div className="form-group">
                      <div className="col-sm-3 control-label">
                        <label htmlFor="start-date" className="control-label">
                          Start Date:
                        </label>
                      </div>
                      <div className="col-sm-5">
                        <div className="input-group date" id="startdate">
                          <input
                            type="date"
                            className="form-control"
                            onChange={(e) =>
                              setStartDate(new Date(e.target.value))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-8">
                    <div className="form-group">
                      <div className="col-sm-3 control-label">
                        <label htmlFor="end-date">End Date:</label>
                      </div>
                      <div className="col-sm-5">
                        <div className="input-group date" id="enddate">
                          <input
                            type="date"
                            className="form-control"
                            onChange={(e) =>
                              setEndDate(new Date(e.target.value))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="border-bottom pb-5">
            <h3>My Questions</h3>
            <div
              className="overflow-auto mx-auto mt-2"
              style={{ width: "95%", height: "20em" }}
            >
              <>
                {filteredQuestions().length > 0 ? (
                  filteredQuestions().map((question) => (
                    <PublicQuestion key={question._id} question={question} />
                  ))
                ) : (
                  <div>
                    <span className="text-danger">
                      No results were found for the dates you selected.{" "}
                    </span>
                  </div>
                )}
              </>
            </div>
          </div>

          <div className="pb-5">
            <h3>My Answers</h3>
            <div
              className="overflow-auto mx-auto mt-2"
              style={{ width: "95%", height: "20em" }}
            >
              <>
                {filteredAnswers().length > 0 ? (
                  filteredAnswers().map((answer) => (
                    <Answers key={answer._id} answer={answer} />
                  ))
                ) : (
                  <div>
                    <span className="text-danger">
                      No results were found for the dates you selected!
                    </span>
                  </div>
                )}
              </>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <div>{content}</div>;
};

export default MyActivities;
