import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import useFetch from "../../hooks/useFetch";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const { isLoading, error, performFetch } = useFetch(
    "/auth/register",
    (res) => {
      if (res.success) {
        navigate("/login");
      }
    }
  );

  const handleSubmitRegister = async (e) => {
    const form = e.currentTarget;
    e.preventDefault(); // Prevent the default form submission behavior

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else if (password !== confirmPassword) {
      setValidated(false);
      return;
    } else {
      performFetch({
        method: "POST",
        body: JSON.stringify({
          user: { firstName, lastName, email, password },
        }),
      });
    }

    setValidated(true);
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center mt-5 border rounded w-50 pt-3 pb-3">
      <Navbar.Brand href="/landing-page" className="fs-2 fw-bold text-info">
        &lt;HYQ /&gt;
      </Navbar.Brand>
      <Form
        noValidate
        validated={validated}
        className="login-form"
        onSubmit={handleSubmitRegister}
      >
        <div className="d-flex align-items-center gap-3 mb-3 mt-3">
          <Form.Group controlId="validationCustom01">
            <Form.Label className="float-start">First Name:</Form.Label>
            <Form.Control
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter your first name
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="validationCustom02">
            <Form.Label className="float-start">Last Name:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter your last name
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <Form.Group controlId="validationCustom03">
          <Form.Label className="float-start">Email address:</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please enter your email
          </Form.Control.Feedback>
        </Form.Group>
        <div className="d-flex justify-content-between align-items-center gap-3 my-3">
          <div className="row">
            <div className="col">
              <Form.Group controlId="validationCustom04">
                <Form.Label className="float-start">Password:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className=""
                />
                <Form.Control.Feedback type="invalid">
                  Please enter your password
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col">
              <Form.Group controlId="validationCustom05">
                {" "}
                {/* Changed the controlId for confirm password */}
                <Form.Label className="float-start">
                  Confirm Password:
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className=""
                  isInvalid={password !== confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  Passwords do not match
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>
        </div>
        {error && (
          <div className="text-danger">
            <p>{error}</p>
          </div>
        )}
        <Button
          variant="info"
          type="submit"
          className="container"
          disabled={isLoading}
        >
          Register
        </Button>
        <div className="mt-3 fs-6 fst-italic text-center">
          <Link to="/login">
            Do you have an account? Please click here to login
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default Register;
