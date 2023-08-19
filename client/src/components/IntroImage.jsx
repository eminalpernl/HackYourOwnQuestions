import React from "react";
import introImage from "../../assets/intro.png";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

function IntroImage() {
  const { auth, userRole } = useAuthContext();

  return (
    <>
      {auth ? (
        <div className="container">
          <div className="row">
            <div className="col fs-4">
              <span className="text-secondary">Welcome back</span>{" "}
              {auth.firstName}
              {"!"}
            </div>
            <div className="col fs-4 ">
              <div className="row d-flex align-items-center justify-content-center gap-1">
                <div className="col">
                  {auth && userRole === "admin" && (
                    <Link to="/admin" className="float-end">
                      <button
                        type="button"
                        className="btn btn-warning btn-lg px-4 me-md-0 pl-4"
                      >
                        Admin Panel
                      </button>
                    </Link>
                  )}
                </div>
                <div className="col">
                  <Link to="/ask" className="float-end">
                    <button
                      type="button"
                      className="btn btn-dark btn-lg px-4 me-md-2"
                    >
                      Ask Question
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container bg-info col-xxl-12 text-secondary rounded">
          <h1
            className=" fw-bold lh-1 mb-3 d-flex justify-content-center py-3"
            style={{
              textShadow: "1px 1px 2px black, 0 0 1em black, 0 0 0.2em black",
            }}
          >
            &lt;Hack Your Questions/&gt;
          </h1>
          <div className="row flex-lg-row-reverse align-items-center pb-3">
            <div className="col-10 col-sm-10 col-lg-5 d-flex justify-content-center">
              <img
                src={introImage}
                className="d-block mx-lg-auto img-fluid"
                alt="hero-image"
                loading="lazy"
              />
            </div>
            <div className="col-lg-7">
              <div className=" fs-4 text-dark my-4 text-center">
                <p>
                  Are you{" "}
                  <b>
                    <i className="text-white">stuck</i>
                  </b>{" "}
                  with something?
                </p>
                <p>
                  Have a nasty{" "}
                  <b>
                    <i className="text-white">bug?</i>
                  </b>
                </p>
                <p>
                  <b>
                    <i className="text-white">Unsure</i>
                  </b>{" "}
                  about a concept?
                </p>
                <p>
                  Not sure how to{" "}
                  <b>
                    <i className="text-white">refactor</i>
                  </b>{" "}
                  your code to make it better?
                </p>
                <p>
                  Just want to have a{" "}
                  <b>
                    <i className="text-white">chat?</i>
                  </b>
                </p>
                <p>
                  Then come by and find answers to all your{" "}
                  <b>
                    <i className="text-white">QUESTIONS</i>
                  </b>
                </p>
              </div>
            </div>
            <div className="d-grid gap-4 d-md-flex justify-content-center mt-3">
              <Link to="/register">
                <button
                  type="button"
                  className="btn btn-light btn-lg px-4 me-md-2"
                >
                  Join the community
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default IntroImage;
