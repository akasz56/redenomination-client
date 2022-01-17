import React from 'react'
import { Link } from 'react-router-dom';
import { Navbar, Container, Button, Nav } from 'react-bootstrap'
import { logout, isAdmin, isAuth } from '../utils/Auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Layouts.css';

export function Header() {
    const handlerClick = (event) => {
        event.preventDefault();
        logout(() => {
            window.location.href = "/";
        });
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand>
                    <Link to="/" style={{ color: "#ffffff", textDecoration: "none" }}>Redenomination Project</Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mt-2 me-auto"></Nav>
                    <Nav>
                        <div>
                            {isAuth() ?
                                (isAdmin() ?
                                    <Link to='/simulations' className="btn btn-outline-light"><i className='bx bxs-dashboard' /> Panel Admin</Link>
                                    :
                                    <Button variant="danger" onClick={handlerClick}>Log Out</Button>
                                )
                                :
                                <Link to='/login' className="btn btn-primary">Login as Admin</Link>
                            }
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar >
    )
}

export function Footer() {
    return (
        <footer className='footer'>
            <hr />
            <p className='text-center text-muted fw-bold'>© 2022 Codepanda.id</p>
        </footer>
    )
}