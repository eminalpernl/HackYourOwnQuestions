import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Form, Nav, Navbar, Container, Offcanvas } from "react-bootstrap";
import { logInfo } from "../../../server/src/util/logging";
import { useUserContext } from "../hooks/useUserContext";
import useFetch from "../hooks/useFetch";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

function NavScroll() {
  const [searchResult, setSearchResult] = useState([]);
  const [key, setKey] = useState("");
  const { auth, logout } = useAuthContext();
  const { removeUser } = useUserContext();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const { isLoading, error, performFetch } = useFetch("/auth/logout", () => {
    logout();
    removeUser();
  });

  const { performFetch: searchFetch } = useFetch("/question", (data) =>
    setSearchResult(data.result)
  );

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setKey(""); // Clear the search when clicked outside
    }
  };

  useEffect(() => {
    // Add event listener when component mounts
    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener when component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!key.trim()) {
      setSearchResult([]);
      return;
    }
    searchFetch({
      method: "GET",
      params: { key: key },
    });
  }, [key]);
  logInfo(searchResult);

  const handleClickLogout = () => {
    performFetch({
      method: "POST",
    });
  };

  return (
    <>
      <Navbar key="lg" bg="secondary" expand="lg" className="mb-3 navbar-dark">
        <Container className="d-flex justify-content-between">
          <Navbar.Brand className="align-text-top fs-1 fw-bold text-info">
            <Nav.Link as={Link} to="/landing-page" href="#action1">
              &lt;HYQ/&gt;
            </Nav.Link>
          </Navbar.Brand>
          <div className="w-50">
            <Form className="d-flex">
              <Form.Control
                type="text"
                placeholder="Search"
                className="me-2 ms-auto"
                aria-label="Search"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
            </Form>
          </div>
          <div>
            <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" />
            <Navbar.Offcanvas
              id="offcanvasNavbar-expand-lg"
              aria-labelledby="offcanvasNavbarLabel-expand-lg"
              placement="end"
            >
              <Offcanvas.Header closeButton></Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  {auth ? (
                    <>
                      <Nav.Link as={Link} to="/my-activities" href="#action1">
                        <span className="btn btn-secondary">My activity</span>
                      </Nav.Link>
                      <Nav.Link as={Link} to="/profile" href="#action1">
                        <span className="btn btn-secondary">Profile</span>
                      </Nav.Link>
                      <Nav.Link as={Link} to="/landing-page" href="#action1">
                        <span
                          className="btn btn-secondary"
                          onClick={handleClickLogout}
                        >
                          Logout
                        </span>
                      </Nav.Link>
                    </>
                  ) : (
                    <>
                      <Nav.Link as={Link} to="/login" href="#action1">
                        <span className="btn btn-info">Log In</span>
                      </Nav.Link>
                      <Nav.Link as={Link} to="/register" href="#action1">
                        <span className="btn btn-secondary">Sign Up</span>
                      </Nav.Link>
                    </>
                  )}
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </div>
        </Container>
      </Navbar>
      {searchResult && searchResult.length > 0 && (
        <Container style={{ padding: "0" }}>
          <div
            ref={containerRef}
            className=" container position-absolute z-3 text-white py-3 bg-secondary rounded shadow"
            onClick={() => [setKey("")]}
          >
            {searchResult
              .filter((result) =>
                result.question_title.toLowerCase().includes(key)
              )
              .map((question) => (
                <div key={question._id} className="d-grid gap-2">
                  <a
                    onClick={() => {
                      navigate(`/question/${question._id}`);
                    }}
                    className=" link-light link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover text-center pb-2"
                    style={{ cursor: "pointer" }}
                  >
                    {question.question_title}
                  </a>
                </div>
              ))}
          </div>
          {isLoading && (
            <div className="spinner-border text-info" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error.message || error}
            </div>
          )}
        </Container>
      )}
    </>
  );
}

export default NavScroll;
