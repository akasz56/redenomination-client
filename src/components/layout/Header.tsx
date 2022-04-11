import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getCurrentRole, logout, ROLE } from "../../common/utils/authHandler";

export default function Header() {
  function handlerLogout(e: React.FormEvent) {
    e.preventDefault();
    logout();
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>
          <Link to="/" style={{ color: "#ffffff", textDecoration: "none" }}>
            Redenomination Project
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mt-2 me-auto"></Nav>
          <Nav>
            {getCurrentRole() ? (
              <>
                {getCurrentRole() === ROLE.ADMIN ? (
                  <Link
                    to="/admin"
                    className="btn btn-outline-light me-lg-3 my-lg-0 my-2"
                  >
                    <i className="bx bxs-dashboard" /> Panel Admin
                  </Link>
                ) : (
                  <></>
                )}
                <Button variant="danger" onClick={handlerLogout}>
                  Keluar
                </Button>
              </>
            ) : (
              <Link to="/login" className="btn btn-outline-light me-3">
                Masuk sebagai Admin
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
