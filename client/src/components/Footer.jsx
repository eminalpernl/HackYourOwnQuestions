import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-secondary mt-5">
      <div className="container d-flex gap-1 justify-content-center align-items-center p-3 text-white">
        <div>
          <Navbar.Brand className="text-info">
            <Nav.Link as={Link} to="/landing-page">
              <strong>&lt;HYQ/&gt;</strong>
            </Nav.Link>
          </Navbar.Brand>
        </div>
        <p className="mb-0">
          Developed with ❤️️ by Group A - Class 42 -{" "}
          <a
            href="https://www.hackyourfuture.net/"
            className="text-white"
            target="blank"
          >
            Hack Your Future
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
