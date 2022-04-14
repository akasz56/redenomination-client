import { Link } from "react-router-dom";
import { Navbar, Container, Button, Nav } from "react-bootstrap";
import { myRole } from "../Utils";
import "./Layouts.css";

export function Header() {
  function handlerClick(e) {
    e.preventDefault();
    localStorage.removeItem("auth");
    window.location.href = "/";
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
            <div>
              {myRole() === "admin" ? (
                <Link to="/admin" className="btn btn-outline-light">
                  <i className="bx bxs-dashboard" /> Panel Admin
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline-light me-3">
                    Masuk sebagai Admin
                  </Link>
                  <Button variant="danger" onClick={handlerClick}>
                    Keluar
                  </Button>
                </>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export function Footer() {
  return (
    <footer className="footer text-muted fw-bold">
      <hr />
      <Container>
        <section className="row mb-3">
          <div className="col-md-6">
            Created By :
            <br />
            Prof. Dr. Ir. Bambang Juanda, MS
            <br />
            Habib Furqony Andrianus
            <br />
            Akaasyah Nurfath
          </div>
          <div className="col-md-6">
            <p>
              Sponsored By :
              <br />
              Bank Indonesia
            </p>
          </div>
        </section>
      </Container>
    </footer>
  );
}
