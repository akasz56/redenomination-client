import { Navbar, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand>
                    <Link to="/" className="fw-bold" style={{ color: "#ffffff", textDecoration: "none" }}>Redenomination Project</Link>
                </Navbar.Brand>
                {false ?
                    <Link to='/login' className="btn btn-primary">Login as Admin</Link>
                    :
                    <Link to='/admin' className="btn btn-outline-primary">Dashboard</Link>
                }
            </Container>
        </Navbar >
    )
}
