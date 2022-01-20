import { Link } from 'react-router-dom';
import { Navbar, Container, Button, Nav } from 'react-bootstrap'
import { myRole } from '../Utils';
import './Layouts.css';

export function Header() {
    function handlerClick(e) {
        e.preventDefault();
        localStorage.removeItem('auth');
        window.location.href = "/";
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
                            {myRole() ?
                                (myRole() === "admin" ?
                                    <Link to='/admin' className="btn btn-outline-light"><i className='bx bxs-dashboard' /> Panel Admin</Link>
                                    :
                                    <Button variant="danger" onClick={handlerClick}>Keluar</Button>
                                )
                                :
                                <Link to='/login' className="btn btn-outline-light">Masuk sebagai Admin</Link>
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