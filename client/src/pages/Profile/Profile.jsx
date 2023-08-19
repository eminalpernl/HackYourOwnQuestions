import React, { useState, useRef, useEffect } from "react";
import { Card, Button, Form, Row, Col, Modal } from "react-bootstrap";
import useFetch from "../../hooks/useFetch";

function ProfilePage() {
  const [id, setId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [editProfile, setEditProfile] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const grabUser = useFetch("/user/profile", (user) => {
    user = user.result[0];
    setId(user._id);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setBio(user.bio);
    setPassword(user.password);
  });

  useEffect(() => {
    grabUser.performFetch();
  }, []);

  const updateDate = useFetch(`/user/update/${id}`, () => {});
  const updateSecurity = useFetch(`/user/update-security/${id}`, () => {});
  const deleteAccount = useFetch(`/user/delete/${id}`, () => {});
  const logout = useFetch("/auth/logout", () => {});
  const profileFormRef = useRef(null);
  const passwordFormRef = useRef(null);
  const checkPassword = useFetch("/user/check", (res) => {
    if (res.success) {
      setEditPassword(true);
      setShowPasswordModal(false);
      setPasswordError("");
      setPasswordChanged(false);
    } else {
      setPasswordError(res.message);
    }
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const form = profileFormRef.current;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    updateDate.performFetch({
      method: "PUT",
      body: JSON.stringify({
        user: { firstName, lastName, bio },
      }),
    });
    setValidated(true);
    setEditProfile(false);
  };

  const handleChangeSecurity = (e) => {
    e.preventDefault();
    const form = profileFormRef.current;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    let user = {
      email: email,
      confirmPassword: passwordInput,
    };

    if (newPassword.length > 1) {
      user = { ...user, password: newPassword };
    } else {
      user = { ...user, password: passwordInput };
    }
    updateSecurity.performFetch({
      method: "PUT",
      body: JSON.stringify({
        user,
      }),
    });
    setValidated(true);
    setEditProfile(false);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    localStorage.clear();
    deleteAccount.performFetch({
      method: "delete",
      body: JSON.stringify({
        password: passwordInput,
      }),
    });
    logout.performFetch({
      method: "POST",
    });
    setValidated(true);
    setEditPassword(false);
    window.location.href = "/landing-page";
  };

  const handleChangeEmail = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    const form = passwordFormRef.current;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    setValidated(true);

    if (newPassword !== confirmNewPassword) {
      form.elements.confirmPassword.setCustomValidity("Passwords do not match");
      return;
    }

    form.elements.confirmPassword.setCustomValidity("");

    setEditPassword(false);
    handleChangeSecurity(e);
    setPasswordInput("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordChanged(true);
  };

  const handleCancelProfile = () => {
    setEditProfile(false);
    setValidated(false);
  };

  const handleCancelPassword = () => {
    setEditPassword(false);
    setValidated(false);
    setPasswordChanged(false);
  };

  const handleEditAccount = () => {
    setShowPasswordModal(true);
    setPasswordInput("");
    setPasswordError("");
    setPasswordChanged(false);
  };

  const handleConfirmPassword = () => {
    checkPassword.performFetch({
      method: "POST",
      body: JSON.stringify({
        password: password,
        confirmPassword: passwordInput,
      }),
    });
  };

  const handleNewPassword = (e) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
  };

  const handleConfirmNewPassword = (e) => {
    const confirmNewPassword = e.target.value;
    setConfirmNewPassword(confirmNewPassword);
  };

  return (
    <div className="container mt-5 align-items-center justify-content-center">
      <div className="column align-items-center justify-content-center">
        <div className="row-lg-6 align-items-center justify-content-center">
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="d-flex align-items-center justify-content-center">
                Profile
              </Card.Title>
              <Form
                noValidate
                validated={validated}
                onSubmit={handleSaveProfile}
                ref={profileFormRef}
              >
                <Form.Group as={Row} controlId="firstName" className="mt-4">
                  <Form.Label column sm={4}>
                    First Name:
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      readOnly={!editProfile}
                      required
                      className="border-bottom border-0"
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="lastName" className="mt-3">
                  <Form.Label column sm={4}>
                    Last Name
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      readOnly={!editProfile}
                      required
                      className="border-bottom border-0"
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="bio" className="mt-3 mb-3">
                  <Form.Label column sm={4}>
                    Bio
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      as="textarea"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      readOnly={!editProfile}
                      rows={3}
                      maxLength={300}
                      className="border-bottom border-0"
                    />
                  </Col>
                </Form.Group>
                {!editProfile ? (
                  <Button
                    variant="info"
                    onClick={() => setEditProfile(true)}
                    className="me-2"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button variant="info" type="submit" className="me-2">
                      Save Profile
                    </Button>
                    <Button variant="secondary" onClick={handleCancelProfile}>
                      Cancel
                    </Button>
                  </>
                )}
              </Form>
            </Card.Body>
          </Card>
        </div>

        <div className="row-lg-6 align-items-center justify-content-center">
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="d-flex align-items-center justify-content-center">
                Security
              </Card.Title>
              <Form
                noValidate
                validated={validated}
                onSubmit={handleChangePassword}
                ref={passwordFormRef}
              >
                <Form.Group as={Row} controlId="email" className="mt-3">
                  <Form.Label column sm={4}>
                    Email
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={handleChangeEmail}
                      readOnly={!editProfile && !editPassword}
                      required
                      className="border-bottom border-0"
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="newPassword" className="mt-3">
                  <Form.Label column sm={4}>
                    New Password
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="password"
                      value={newPassword}
                      onChange={handleNewPassword}
                      readOnly={!editPassword}
                      required
                      className="border-bottom border-0"
                    />
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  controlId="confirmPassword"
                  className="mt-3"
                >
                  <Form.Label column sm={4}>
                    Confirm Password
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="password"
                      value={confirmNewPassword}
                      onChange={handleConfirmNewPassword}
                      readOnly={!editPassword}
                      required
                      className="border-bottom border-0"
                    />
                  </Col>
                </Form.Group>
                {!editPassword ? (
                  <Button
                    variant="info"
                    onClick={handleEditAccount}
                    className="me-2"
                  >
                    Edit Account
                  </Button>
                ) : (
                  <>
                    <Button variant="info" type="submit" className="me-2">
                      Save
                    </Button>
                    <Button variant="secondary" onClick={handleCancelPassword}>
                      Cancel
                    </Button>
                    <Button
                      className="float-end"
                      variant="danger"
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </Form>
              {passwordChanged && (
                <div className="mt-3 text-success">Saved successfully.</div>
              )}

              {updateSecurity?.error && (
                <div className="mt-3 text-success">
                  {String(updateSecurity?.error)}
                </div>
              )}
              {deleteAccount?.error && (
                <div className="mt-3 text-success">
                  {String(deleteAccount?.error)}
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated}>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
              {checkPassword?.error && (
                <p className="text-danger">{checkPassword?.error}</p>
              )}
              {passwordError && <p className="text-danger">{passwordError}</p>}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPasswordModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmPassword}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProfilePage;
