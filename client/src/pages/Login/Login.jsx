import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import useFetch from "../../hooks/useFetch";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useUserContext } from "../../hooks/useUserContext";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const { login, auth } = useAuthContext();
  const { setUser } = useUserContext();

  const { isLoading, error, performFetch } = useFetch(
    "/auth/login",
    (response) => {
      login(response.authUser);
    }
  );

  useEffect(() => {
    if (auth) {
      userFetch();
    }
  }, [auth]);

  const {
    isLoading: userLoading,
    error: userError,
    performFetch: userFetch,
  } = useFetch(`/user/${auth}`, (response) => {
    setUser(response.user);
  });

  useEffect(() => {
    if (auth) {
      navigate("/landing-page");
    }
  }, [auth]);

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      performFetch({
        method: "POST",
        body: JSON.stringify({ user: { email, password } }),
      });
    }

    setValidated(true);
  };

  return (
    <div className=" container d-flex flex-column justify-content-center align-items-center mt-5  border rounded w-25 pt-3 pb-3">
      <Navbar.Brand href="/landing-page" className="fs-2 fw-bold text-info">
        &lt;HYQ /&gt;
      </Navbar.Brand>
      <Form
        noValidate
        validated={validated}
        className="login-form mt-3"
        onSubmit={handleSubmitLogin}
      >
        <Form.Group className="mb-3 " controlId="validationCustom01">
          <Form.Label className="mt-4 float-start">Email address:</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />

          <Form.Control.Feedback type="invalid">
            Please enter your email
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="validationCustom02">
          <Form.Label className="float-start">Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please enter your password
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          variant="info"
          type="submit"
          className="container"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
        {error && <p className="text-danger">{error}</p>}
        <div className="mt-3 fs-6 fst-italic text-center">
          {userLoading && (
            <div className="spinner-border text-info" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          )}
          {userError && (
            <div className="alert alert-danger" role="alert">
              {userError.message || userError}
            </div>
          )}
          <Link to="/register">No account? Please click here</Link>
        </div>
      </Form>
    </div>
  );
}

export default Login;
